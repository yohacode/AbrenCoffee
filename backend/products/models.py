# products/models.py
from django.db import models
from django.utils import timezone

class Category(models.Model):
    name = models.CharField(("name"), max_length=50)

    def __str__(self):
        return self.name

class Product(models.Model):
    DELIVERY_CHOICES = [
        ('none', 'One-time Purchase'),
        ('daily', 'Daily Delivery'),
        ('monthly', 'Monthly Delivery'),
    ]

    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    category = models.ManyToManyField(Category, verbose_name=("Category"), blank=True)
    description = models.CharField(("Description"), max_length=50, blank=True)
    discount = models.DecimalField("Discount", max_digits=5, decimal_places=2, blank=True, null=True)    
    is_subscription = models.BooleanField(default=False, blank=True, null=True)
    delivery_frequency = models.CharField(
            max_length=10,
            choices=DELIVERY_CHOICES,
            default='none',
            help_text="Optional delivery frequency if product is a subscription",
            blank=True, null=True
        )    
    stock = models.PositiveIntegerField(default=0)
    sold = models.PositiveIntegerField(default=0)
    quantity = models.IntegerField(("Quantity"))
    image = models.ImageField(("Image"), upload_to='products/', height_field=None, width_field=None, max_length=None, default='products/coffee-packed-white-coffee-.jpg')
    created_at = models.DateField(("Created_at"), auto_now=False, auto_now_add=True)
    updated_at = models.DateField(("Updated_at"), auto_now=True)

    def __str__(self):
        return self.name
    
    class Meta:
        ordering = ['-created_at']

    def get_discounted_price(self):
        if self.discount:
            return self.price - (self.price * (self.discount / 100))
        return self.price


class Transaction(models.Model):
    TRANSACTION_CHOICES = [
        ("sale", "Sale"),
        ("return", "Return"),
    ]

    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    transaction_type = models.CharField(max_length=10, choices=TRANSACTION_CHOICES)
    amount = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.transaction_type} - {self.product.name} ({self.amount})"
    

class Discount(models.Model):
    DISCOUNT_TYPES = [
        ('subscription', 'Subscription'),
        ('seasonal', 'Seasonal'),
        ('promo', 'Promo Code'),
    ]

    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='discounts')
    discount_type = models.CharField(max_length=20, choices=DISCOUNT_TYPES)
    percent = models.DecimalField(max_digits=5, decimal_places=2)
    start_date = models.DateTimeField(null=True, blank=True)
    end_date = models.DateTimeField(null=True, blank=True)
    promo_code = models.CharField(max_length=50, null=True, blank=True)
    applies_to_subscriptions = models.BooleanField(default=False)

    @staticmethod
    def get_applicable_discount(product, user=None, promo_code=None):
        now = timezone.now()
        discounts = product.discounts.filter(
            start_date__lte=now,
            end_date__gte=now,
        )

        if promo_code:
            discounts = discounts.filter(discount_type='promo', promo_code=promo_code)
        elif user and user.is_authenticated and product.is_subscription_product:
            discounts = discounts.filter(discount_type='subscription')
        else:
            discounts = discounts.filter(discount_type='seasonal')

        return discounts.order_by('-percent').first()
    
    def applies_to(self, item):
        if self.applies_to_subscriptions and not item.is_subscription:
            return False
        if not self.applies_to_all and item not in self.products.all():
            return False
        return True

