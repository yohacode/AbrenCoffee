from rest_framework.test import APITestCase
from django.urls import reverse
from products.models import Product

class CartAPITests(APITestCase):
    def setUp(self):
        self.product = Product.objects.create(
            name="Amaricano",
            description="A strong coffee",
            price=6.00,
            stock=10,
            sku="AMA-001"
        )

    def test_cart_retrieve_empty(self):
        url = reverse('cart')  # make sure 'cart' is named in urls.py
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['total_items'], 0)

    def test_cart_add_item(self):
        url = reverse('cart_add')  # should be named in urls.py
        response = self.client.post(url, {'product_id': self.product.id, 'quantity': 2})
        self.assertEqual(response.status_code, 200)
        self.assertIn('qty', response.json())
        self.assertEqual(response.json()['qty'], 2)

    def test_cart_update_quantity(self):
        # Add first
        self.client.post(reverse('cart_add'), {'product_id': self.product.id, 'quantity': 1})
        # Update
        url = reverse('cart_update', args=[self.product.id])
        response = self.client.put(url, {'quantity': 3}, content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertIn('message', response.json())
        self.assertIn('updated to 3', response.json()['message'])

    def test_cart_remove_item(self):
        self.client.post(reverse('cart_add'), {'product_id': self.product.id, 'quantity': 1})
        url = reverse('cart_delete', args=[self.product.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 200)
        self.assertIn('removed from cart', response.json()['message'])

    def test_cart_merge_stub(self):
        url = reverse('cart_merge')
        response = self.client.post(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['message'], 'Cart merge logic is handled in middleware')
