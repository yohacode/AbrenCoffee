from django.test import TestCase
from products.models import Product, Transaction

class ProductModelTest(TestCase):
    def test_product_sale_transaction(self):
        # Create a product with 10 stock
        product = Product.objects.create(name="Espresso", price=5.0, stock=10)
        
        # Perform a sale of 5 products
        transaction = Transaction.objects.create(product=product, transaction_type="sale", amount=5)
        
        # Check that stock was reduced by 5 and sold was increased by 5
        product.refresh_from_db()
        self.assertEqual(product.stock, 5)
        self.assertEqual(product.sold, 5)
    
    def test_product_sale_insufficient_stock(self):
        product = Product.objects.create(name="Latte", price=6.0, stock=2)
        
        # Try to sell more products than available stock
        with self.assertRaises(ValueError):
            Transaction.objects.create(product=product, transaction_type="sale", amount=5)
    
    def test_product_return_transaction(self):
        product = Product.objects.create(name="Americano", price=4.0, stock=10, sold=5)
        
        # Perform a return of 3 products
        transaction = Transaction.objects.create(product=product, transaction_type="return", amount=3)
        
        # Check that stock was increased by 3 and sold was decreased by 3
        product.refresh_from_db()
        self.assertEqual(product.stock, 13)
        self.assertEqual(product.sold, 2)
