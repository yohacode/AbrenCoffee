# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from rest_framework import generics
from .models import Subscription
from products.models import Product
from .stripe_utils import create_stripe_subscription
from .paypal_utils import create_paypal_subscription  # Add this import if the function exists in paypal_utils.py
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse, JsonResponse
import json
import stripe
from users.models import CustomUser
from django.conf import settings
from .serializers import SubscriptionSerializer

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

# subscriptions/views.py

@csrf_exempt
def paypal_webhook(request):
    payload = json.loads(request.body)
    event_type = payload.get("event_type")
    subscription_id = payload.get("resource", {}).get("id")

    if not subscription_id:
        return JsonResponse({"error": "No subscription ID"}, status=400)

    try:
        sub = Subscription.objects.get(external_id=subscription_id, provider="paypal")
    except Subscription.DoesNotExist:
        sub = None

    if event_type == "BILLING.SUBSCRIPTION.ACTIVATED" and sub:
        sub.active = True
        sub.save()

    elif event_type in ["BILLING.SUBSCRIPTION.CANCELLED", "BILLING.SUBSCRIPTION.SUSPENDED"] and sub:
        sub.active = False
        sub.save()

    return JsonResponse({"status": "received"})

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

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_subscriptions(request):
    subs = Subscription.objects.filter(user=request.user)
    return Response(SubscriptionSerializer(subs, many=True).data)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def cancel_subscription(request, pk):
    sub = Subscription.objects.get(id=pk, user=request.user)

    # Cancel on PayPal
    from .paypal_utils import cancel_paypal_subscription
    cancel_paypal_subscription(sub.external_id)

    sub.active = False
    sub.save()
    return Response({"status": "cancelled"})

class AdminSubscriptionListView(generics.ListAPIView):
    permission_classes = [IsAdminUser]
    serializer_class = SubscriptionSerializer
    queryset = Subscription.objects.select_related('user').all()

@api_view(['POST'])
@permission_classes([IsAdminUser])
def cancel_subscription(request, pk):
    try:
        subscription = Subscription.objects.get(pk=pk)
        subscription.active = False
        subscription.save()
        return Response({"detail": "Subscription cancelled."}, status=status.HTTP_200_OK)
    except Subscription.DoesNotExist:
        return Response({"detail": "Subscription not found."}, status=status.HTTP_404_NOT_FOUND)