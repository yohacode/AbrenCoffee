from django.urls import path
from .views import CreateSubscriptionView, stripe_webhook, paypal_webhook, my_subscriptions, cancel_subscription, AdminSubscriptionListView

urlpatterns = [
    path('to/', CreateSubscriptionView.as_view()),
    path('webhook/stripe/', stripe_webhook),
    path('webhook/paypal/', paypal_webhook),

    path('my-subscriptions/', my_subscriptions, name='my_subscriptions'),
    path('cancel/<int:pk>/', cancel_subscription, name='cancel_subscription'),

    path('admin/subscriptions/', AdminSubscriptionListView.as_view(), name='admin-subscription-list'),
    path('admin/subscriptions/<int:pk>/cancel/', cancel_subscription, name='admin-subscription-cancel'),
]
