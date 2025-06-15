from .cart import Cart
from products.models import Product
from django.utils.deprecation import MiddlewareMixin

class CartMergeMiddleware(MiddlewareMixin):
    def process_request(self, request):
        if request.user.is_authenticated and 'cart_merged' not in request.session:
            session_cart = Cart(request)
            session_items = session_cart.cart.copy()

            # Store in DB or transfer logic here
            # For simplicity, we assume your DB cart is the same session cart
            # If you're not saving DB carts, we just keep session as source of truth
            for product_id, item in session_items.items():
                try:
                    product = Product.objects.get(id=product_id)
                    session_cart.add(product=product, quantity=item['quantity'])
                except Product.DoesNotExist:
                    continue

            request.session['cart_merged'] = True  # Prevent duplicate merging
