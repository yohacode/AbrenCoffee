# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Subscription
from products.models import Product
from .stripe_utils import create_stripe_subscription
from .paypal_utils import create_paypal_subscription  # Add this import if the function exists in paypal_utils.py
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
import json
import stripe
from users.models import CustomUser
from django.conf import settings

@csrf_exempt
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
    except Exception:
        return HttpResponse(status=400)

    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        email = session['customer_email']
        CustomUser.objects.filter(email=email).first()
        Subscription.objects.create(
            user=CustomUser.objects.get(email=email),
            provider='stripe',
            external_id=session['subscription'],
            active=True
        )
    return HttpResponse(status=200)

@csrf_exempt
def paypal_webhook(request):
    data = json.loads(request.body)
    event_type = data.get("event_type")
    resource = data.get("resource", {})
    if event_type == "BILLING.SUBSCRIPTION.ACTIVATED":
        email = resource["subscriber"]["email_address"]
        CustomUser.objects.filter(email=email).first()
        Subscription.objects.create(
            user=CustomUser.objects.get(email=email),
            provider='paypal',
            external_id=resource["id"],
            active=True
        )
    return HttpResponse(status=200)

class CreateSubscriptionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        provider = request.data.get("provider")
        product_id = request.data.get("product_id")
        product = Product.objects.get(id=product_id)
        user = request.user

        if provider == "stripe":
            return Response(create_stripe_subscription(user, product, frequency=product.delivery_frequency))
        elif provider == "paypal":
            return Response(create_paypal_subscription(user, product, frequency=product.delivery_frequency))
        elif provider in ["klarna", "swish"]:
            return Response({"error": f"{provider.title()} is not implemented yet."}, status=501)
        return Response({"error": "Unsupported provider"}, status=400)


