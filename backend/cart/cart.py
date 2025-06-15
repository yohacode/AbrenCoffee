from products.models import Product, Discount 
from products.serializers import ProductSerializer 
from django.utils import timezone


class Cart:
    SESSION_KEY = 'cart'

    def __init__(self, request):
        self.session = request.session
        self.cart = self.session.get(self.SESSION_KEY, {})
        self.session[self.SESSION_KEY] = self.cart  # Ensure session key exists
        self.user = request.user if request.user.is_authenticated else None
        self.promo_code = self.session.get('promo_code', None)

    def add(self, product, quantity, frequency=None):
        product_id = str(product.id)
        if product_id not in self.cart:
            self.cart[product_id] = {
                'quantity': 0,
                'price': str(product.price),
                'frequency': frequency or product.delivery_frequency,
                'product': {
                    'id': product.id,
                    'name': product.name,
                    'description': product.description,
                    'price': str(product.price),
                    'image': product.image.url if product.image else None
                }
            }
        self.cart[product_id]['quantity'] += quantity
        self.session[self.SESSION_KEY] = self.cart
        self.session.modified = True

    def update(self, product, quantity):
        product_id = str(product.id)
        if product_id in self.cart:
            self.cart[product_id]['quantity'] = quantity
            self._save()

    def remove(self, product):
        product_id = str(product.id)
        if product_id in self.cart:
            del self.cart[product_id]
            self._save()

    def clear(self):
        self.session[self.SESSION_KEY] = {}
        self.session.modified = True

    def __len__(self):
        return len(self.cart)

    def _save(self):
        self.session[self.SESSION_KEY] = self.cart
        self.session.modified = True

    def get_items(self):
        product_ids = [int(pid) for pid in self.cart.keys()]
        products = Product.objects.filter(id__in=product_ids)
        items = []

        for product in products:
            pid = str(product.id)
            cart_item = self.cart.get(pid)
            if not cart_item:
                continue

            serialized_product = ProductSerializer(product).data
            quantity = cart_item['quantity']

            items.append({
                'product': serialized_product,
                'quantity': cart_item['quantity'],
                'price': float(cart_item['price']),
                'total_price': float(cart_item['quantity']) * float(cart_item['price']),
                'frequency': cart_item.get('frequency', 'none'),
            })

        return items

    def get_total_price(self):
        total = round(sum(item['total_price'] for item in self.get_items()), 2)
        discount = float(self.session.get('discount_total', 0))
        return round(total - discount, 2)

    def apply_discount(self, discount_code):
        try:
            discount = Discount.objects.get(code=discount_code, active=True)

            if not discount.is_valid():
                return 0

            discount_total = 0
            for item in self.get_items():
                product_data = item['product']
                product = Product.objects.get(id=product_data['id'])

                if not discount.applies_to(product):
                    continue

                quantity = item['quantity']
                price = item['price']

                if discount.discount_type == 'percent':
                    discount_total += price * quantity * (discount.value / 100)
                else:
                    discount_total += min(discount.value, price * quantity)

            self.session['discount_total'] = float(round(discount_total, 2))
            self.session['promo_code'] = discount.code
            self.session.modified = True

            discount.used_count += 1
            discount.save()

            return discount_total

        except Discount.DoesNotExist:
            return 0

