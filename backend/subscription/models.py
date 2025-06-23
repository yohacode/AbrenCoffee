from django.db import models
from users.models import CustomUser

class Subscription(models.Model):
    PROVIDERS = [
        ('stripe', 'Stripe'),
        ('paypal', 'PayPal'),
        ('klarna', 'Klarna'),
        ('swish', 'Swish'),
    ]

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    provider = models.CharField(max_length=20, choices=PROVIDERS)
    external_id = models.CharField(max_length=255)
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.provider} subscription for {self.user.email}"
