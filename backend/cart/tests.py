from django.test import TestCase, RequestFactory
from django.contrib.sessions.middleware import SessionMiddleware
from products.models import Product, Discount
from cart.cart import Cart  # adjust path as needed
from django.core.files.uploadedfile import SimpleUploadedFile
from django.utils import timezone


def attach_session(request):
    middleware = SessionMiddleware(get_response=lambda r: None)
    middleware.process_request(request)
    request.session.save()


class CartTestCase(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.image = SimpleUploadedFile(name='test.jpg', content=b'', content_type='image/jpeg')

        product = Product.objects.create(
            name="Test Product",
            price=100.00,
            quantity=1,
            stock=10,
        )
        self.discount = Discount.objects.create(
            product=product,
            discount_type='promo',
            percent=10.00,
            promo_code='TEST10',
            applies_to_subscriptions=False,
            start_date=timezone.now(),
            end_date=timezone.now() + timezone.timedelta(days=7)
        )
        self.discount.is_valid = lambda: True
        self.discount.applies_to = lambda product: True

        self.request = self.factory.get('/')
        attach_session(self.request)
        self.cart = Cart(self.request)


    def test_add_product(self):
        self.cart.add(self.product1, 2)
        self.assertIn(str(self.product1.id), self.cart.cart)
        self.assertEqual(self.cart.cart[str(self.product1.id)]['quantity'], 2)

    def test_update_product_quantity(self):
        self.cart.add(self.product1, 1)
        self.cart.update(self.product1, 5)
        self.assertEqual(self.cart.cart[str(self.product1.id)]['quantity'], 5)

    def test_remove_product(self):
        self.cart.add(self.product1, 1)
        self.cart.remove(self.product1)
        self.assertNotIn(str(self.product1.id), self.cart.cart)

    def test_clear_cart(self):
        self.cart.add(self.product1, 1)
        self.cart.clear()
        self.assertEqual(len(self.cart.cart), 0)

    def test_get_items(self):
        self.cart.add(self.product1, 2)
        items = self.cart.get_items()
        self.assertEqual(len(items), 1)
        self.assertEqual(items[0]['quantity'], 2)
        self.assertEqual(items[0]['total_price'], 200)

    def test_get_total_price_without_discount(self):
        self.cart.add(self.product1, 1)
        self.cart.add(self.product2, 1)
        total = self.cart.get_total_price()
        self.assertEqual(total, 300)

    def test_apply_discount(self):
        self.cart.add(self.product1, 2)  # 100 * 2 = 200 → 10% = 20
        discount_amount = self.cart.apply_discount('SAVE10')
        self.assertEqual(discount_amount, 20)
        total = self.cart.get_total_price()
        self.assertEqual(total, 180)

    def test_apply_invalid_discount(self):
        discount_amount = self.cart.apply_discount('INVALID')
        self.assertEqual(discount_amount, 0)
