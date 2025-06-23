from django.urls import path
from .views import CreateSubscriptionView, stripe_webhook, paypal_webhook

urlpatterns = [
    path('to/', CreateSubscriptionView.as_view()),
    path('webhook/stripe/', stripe_webhook),
    path('webhook/paypal/', paypal_webhook),
]
