# signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from orders.models import OrderItem

#@receiver(post_save, sender=OrderItem)
# def decrease_product_stock(sender, instance, created, **kwargs):
#    if created:
#        product = instance.product
#        product.stock -= instance.quantity
#        product.save()