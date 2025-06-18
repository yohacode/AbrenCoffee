from django.db import models
from products.models import Product
from users.models import CustomUser
from orders.models import Order, OrderItem
from django.core.exceptions import ValidationError
from django.db.models import Q
from phonenumber_field.modelfields import PhoneNumberField
from uuid import uuid4

def format_date(date_obj):
    return date_obj.strftime("%Y-%m-%d %H:%M:%S") if date_obj else "Not Available"

class Payment(models.Model):
    PAYMENT_METHOD_CHOICES = [
        ('stripe', 'Stripe'),
        ('paypal', 'PayPal'),
        ('klarna', 'Klarna'),
        ('swish', 'Swish'),
    ]

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    ]

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='payments', null=True, blank=True)
    session_key = models.CharField(max_length=255, null=True, blank=True)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='payment')
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    transaction_id = models.CharField(max_length=100)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.payment_method.capitalize()} - {self.transaction_id} - {self.status}"

    def clean(self):
        if self.amount <= 0:
            raise ValidationError("Payment amount must be greater than zero.")


class Invoice(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('refunded', 'Refunded'),
        ('cancelled', 'Cancelled'),
    ]

    user = models.ForeignKey(CustomUser, null=True, blank=True, on_delete=models.SET_NULL)
    session_key = models.CharField(max_length=100, null=True, blank=True)
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    number = models.CharField(max_length=50, unique=True)
    pdf = models.FileField(upload_to='invoices/' , blank=True, null=True)
    payment = models.OneToOneField('Payment', null=True, blank=True, on_delete=models.SET_NULL)
    currency = models.CharField(max_length=10, default='SEK')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', blank=True, null=True)  # pending, paid, cancelled
    created_at = models.DateField(auto_now_add=True)
    updated_at = models.DateField(auto_now=True)

    def is_guest(self):
        return self.user is None and self.session_key is not None
    
    def __str__(self):
        return f"Invoice {self.id} - User: {self.user.username if self.user else 'Guest'} - Status: {self.status} {self.currency}"
    
    def full_details(self):
        return {
            "id": self.id,
            "user": self.user.username if self.user else "Guest",
            "status": self.status,
            "amount": str(self.amount) + " " + self.currency,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }

