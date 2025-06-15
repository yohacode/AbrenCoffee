from django.contrib.auth.signals import user_logged_in
from django.dispatch import receiver
from orders.models import Order, ShippingAddress

@receiver(user_logged_in)
def merge_guest_data(sender, request, user, **kwargs):
    session_key = request.session.session_key

    # Merge Order
    guest_order = Order.objects.filter(user__isnull=True, session_key=session_key).first()
    if guest_order:
        print(f"Merging order {guest_order.id} to user {user.id}")
        guest_order.user = user
        guest_order.save()

   

          