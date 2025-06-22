from django.db import models
from products.models import Product
from users.models import CustomUser
from django.core.exceptions import ValidationError
from django.db.models import Q
from phonenumber_field.modelfields import PhoneNumberField
from uuid import uuid4

def format_date(date_obj):
    return date_obj.strftime("%Y-%m-%d %H:%M:%S") if date_obj else "Not Available"


class ShippingAddress(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, blank=True)
    session_key = models.CharField(max_length=40, null=True, blank=True)
    full_name = models.CharField(max_length=50)
    phone_number = models.CharField(max_length=20)
    email = models.EmailField(max_length=254)
    address1 = models.CharField(max_length=50)
    address2 = models.CharField(max_length=50, blank=True, null=True)
    city = models.CharField(max_length=50, blank=True, null=True)
    street = models.CharField(max_length=50, null=True, blank=True)
    state = models.CharField(max_length=50, null=True, blank=True)
    country = models.CharField(max_length=50)
    zipcode = models.CharField(max_length=50)
    status = models.CharField(max_length=20, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Shipping Address - User: {self.user.id if self.user else 'Guest'}"

    def full_address(self):
        parts = [self.address1, self.address2, self.city, self.street, self.state, self.zipcode, self.country]
        return ", ".join(part for part in parts if part)


class BillingAddress(models.Model):
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)
    country = models.CharField(max_length=100)

    def __str__(self):
        return f"Billing to {self.name}"


class Order(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True)
    session_key = models.CharField(max_length=255, null=True, blank=True)
    shipping_address = models.ForeignKey(ShippingAddress, on_delete=models.PROTECT)
    invoice_pdf = models.FileField(upload_to='invoices/', blank=True, null=True)
    invoice_number = models.CharField(max_length=100, unique=True, blank=True, null=True)
    reference = models.CharField(max_length=64, unique=True, default=uuid4, null=True, blank=True)
    refund_requested = models.BooleanField(default=False, blank=True, null=True)
    REFUND_STATUS_CHOICES = [
        ('none', 'None'),
        ('requested', 'Requested'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('processed', 'Processed'),
    ]
    refund_status = models.CharField(max_length=20, choices=REFUND_STATUS_CHOICES, default='none', blank=True, null=True)
    created_at = models.DateField(auto_now_add=True, blank=True, null=True)
    is_paid = models.BooleanField(default=False)
    status = models.CharField(max_length=30, default="pending")
    total_price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Order {self.id} - User: {self.user.username if self.user else 'Guest'} - Status: {self.status}"
    

class OrderItem(models.Model):
    DELIVERY_FREQUENCIES = [
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
    ]
    
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)  # Price at time of purchase
    delivery_frequency = models.CharField(
            max_length=20,
            choices=DELIVERY_FREQUENCIES,
            default='monthly', blank=True, null=True
        )
    
    def total_price(self):
        return self.quantity * self.price

    def __str__(self):
        return f"{self.product.name} x {self.quantity}"



