import stripe
from decimal import Decimal
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from cart.cart import Cart
from .models import ShippingAddress, Order
from django.conf import settings
from reportlab.pdfgen import canvas
from io import BytesIO
from django.core.files.base import ContentFile
from .models import Order
from payment.models import Invoice

stripe.api_key = settings.STRIPE_SECRET_KEY


def generate_invoice_pdf(invoice: Invoice):
    buffer = BytesIO()
    p = canvas.Canvas(buffer)
    p.drawString(100, 800, f"Invoice #{invoice.number}")
    p.drawString(100, 780, f"User: {invoice.user}")
    p.drawString(100, 760, f"Payment: {invoice.payment}")
    p.drawString(100, 740, f"Status: {invoice.status}")
    p.drawString(100, 720, f"Created: {invoice.created_at.strftime('%Y-%m-%d')}")
    p.showPage()
    p.save()

    # Save to FileField
    buffer.seek(0)
    file_name = f"invoice-{invoice.id}.pdf"
    invoice.pdf_file.save(file_name, ContentFile(buffer.read()))
    invoice.save()

def generate_invoice_view(request, order_id):
    order = get_object_or_404(Order, id=order_id)

    # You could check permissions here
    generate_invoice_pdf(order)

    return JsonResponse({"status": "success", "message": "Invoice generated."})

def get_cart_total(request, user=None, session_key=None):
    """
    Calculate the total price of the cart based on user or session_key.
    """
    cart_items = Cart(request).get_items()
    total = sum(Decimal(item['product']['price']) * item['quantity'] for item in cart_items)
    return total

def get_cart_data(request):
    """
    Retrieve cart items from session, returning list of dicts with product_id and quantity.
    """
    cart = Cart(request)
    cart_data = []
    for item in cart.get_items():
        qty = item['quantity']
        if qty > 0:
            cart_data.append({'product_id': item['product']['id'], 'quantity': qty})
    return cart_data


def get_or_create_order(request):
    if not request.session.session_key:
        request.session.create()
    session_key = request.session.session_key

    if request.user.is_authenticated:
        order = Order.objects.filter(user=request.user, status='pending').first()
        if order:
            # 🟡 Add this to ensure session_key is saved
            if not order.session_key:
                order.session_key = session_key
                order.save()
            return order
    else:
        order = Order.objects.filter(session_key=session_key, status='pending').first()
        if order:
            return order

    # 🔵 Create new order
    order = Order.objects.create(
        user=request.user if request.user.is_authenticated else None,
        session_key=session_key,
        status='pending',
    )
    return order

def get_or_create_shipping_address(request):
    user = request.user if request.user.is_authenticated else None
    session_key = request.session.session_key if not user else None

    if user:
        return ShippingAddress.objects.filter(user=user).order_by('-created_at').first()
    elif session_key:
        return ShippingAddress.objects.filter(session_key=session_key).order_by('-created_at').first()
    return None

def is_identical_address(existing, new_data):
    return (
        existing.full_name == new_data.get("full_name") and
        existing.email == new_data.get("email") and
        existing.phone_number == new_data.get("phone_number") and
        existing.address1 == new_data.get("address1") and
        existing.address2 == new_data.get("address2") and
        existing.city == new_data.get("city") and
        existing.street == new_data.get("street") and
        existing.state == new_data.get("state") and
        existing.country == new_data.get("country") and
        existing.zipcode == new_data.get("zipcode")
    )
