from django.test import TestCase, Client
from django.contrib.sessions.middleware import SessionMiddleware
from django.contrib.auth import get_user_model
from django.urls import reverse
from decimal import Decimal
from products.models import Product
from orders.models import Order, OrderItem, Payment
from orders.models import ShippingAddress
from unittest.mock import patch
from django.conf import settings

User = get_user_model()

class StripeCheckoutViewTest(TestCase):
   
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username='esrael', password='password', email='esrael@example.com')
        self.product = Product.objects.create(name='Test Product', price=Decimal('19.99'), stock=10)
        self.url = reverse('stripe-checkout')  # Match this to your actual URL name

        # Setup session
        session = self.client.session
        session['cart'] = {
            str(self.product.id): {
                'quantity': 2,
                'price': str(self.product.price)
            }
        }
        session.save()
        self.session_key = session.session_key

        # Create shipping address
        self.shipping_address = ShippingAddress.objects.create(
            full_name='Esrael T.',
            address1='123 Test St',
            city='Testville',
            zipcode='12345',
            country='Testland',
            email='esrael@example.com',
            user=self.user,  # or session_key=self.session_key if testing guest
            session_key=self.session_key  # or session_key=self.session_key if testing guest
        )

        self.order = Order.objects.create(
            user=self.user,
            session_key=self.session_key,
            shipping_address=self.shipping_address,
            status='pending',
            total_price=Decimal('39.98')
        )

        OrderItem.objects.create(
            order=self.order,
            product=self.product,
            quantity=2,
            price=self.product.price
        )

    @patch('stripe.checkout.Session.create')
    def test_stripe_checkout_authenticated_user(self, mock_stripe_create):
        mock_stripe_create.return_value = {
            'id': 'sess_123',
            'url': 'https://checkout.stripe.com/pay/sess_123'
        }

        self.client.login(username='esrael', password='password')

        response = self.client.post(self.url, {'email': 'esrael@example.com'}, content_type='application/json')

        self.assertEqual(response.status_code, 200)
        self.assertIn('session_id', response.json())
        self.assertEqual(response.json()['session_id'], 'sess_123')
        self.assertTrue(Payment.objects.filter(order=self.order, payment_method='stripe').exists())

    @patch('stripe.checkout.Session.create')
    def test_stripe_checkout_guest_user(self, mock_stripe_create):
        mock_stripe_create.return_value = {
            'id': 'sess_456',
            'url': 'https://checkout.stripe.com/pay/sess_456'
        }

        guest_shipping_address = ShippingAddress.objects.create(
            full_name='Guest User',
            address1='456 Guest St',
            city='Guestcity',
            zipcode='54321',
            country='Guestland',
            email='guest@example.com',
            session_key=self.session_key
        )

        guest_order = Order.objects.create(
            session_key=self.session_key,
            status='pending',
            total_price=Decimal('39.98'),
            shipping_address=guest_shipping_address,
        )

        OrderItem.objects.create(
            order=guest_order,
            product=self.product,
            quantity=2,
            price=self.product.price
        )

        response = self.client.post(self.url, {'email': 'guest@example.com'}, content_type='application/json')

        self.assertEqual(response.status_code, 200)
        self.assertIn('session_id', response.json())
        self.assertEqual(response.json()['session_id'], 'sess_456')
        self.assertTrue(Payment.objects.filter(order=guest_order, payment_method='stripe').exists())

    def test_stripe_checkout_no_order(self):
        # Clear cart and orders
        Order.objects.all().delete()
        self.client.session['cart'] = {}
        self.client.session.save()

        response = self.client.post(self.url, {'email': 'noorder@example.com'}, content_type='application/json')

        self.assertEqual(response.status_code, 404)
        self.assertIn('error', response.json())
