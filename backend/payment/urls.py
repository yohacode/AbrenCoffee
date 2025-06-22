from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PaymentListView, StripeCheckoutView, 
    stripe_webhook_view,PayPalCaptureView,
    SwishSetupView, SwishWebhookView, PayPalSetupView,
    InvoiceCreateView, InvoiceDownloadView, InvoiceListView,
    InvoiceView, InvoiceDetailView,PayPalWebhookView,
    MockSwishCallbackView,InvoiceDeleteView
)

urlpatterns = [
    # Custom payment endpoints
    path("dj-stripe/", include("djstripe.urls", namespace="djstripe")),
    path('webhooks/stripe/', stripe_webhook_view, name='stripe-webhook'),
    path('stripe/', StripeCheckoutView.as_view(), name='stripe-checkout'),

    path('paypal/setup/', PayPalSetupView.as_view(), name='paypal-checkout'),
    path('paypal/webhook/', PayPalWebhookView.as_view(), name='paypal-webhook'),
    path('paypal/capture/', PayPalCaptureView.as_view(), name='paypal-cature'),
    
    path('swish/setup/', SwishSetupView.as_view(), name='swish-setup'),
    path('swish/webhook/', SwishWebhookView.as_view(), name='swish-webhook'),
    path('swish/mock-callback/', MockSwishCallbackView.as_view(), name='mock-swish-callback'),

    path('list/', PaymentListView.as_view(), name='payment-list'),

    # Invoice management
    path('invoices/', InvoiceView.as_view(), name='invoice-list'),
    path('invoices/user/', InvoiceListView.as_view(), name='user-invoices'),
    path('invoices/detail/<int:pk>/', InvoiceDetailView.as_view(), name='invoice-detail'),
    path('invoices/create/<int:pk>/', InvoiceCreateView.as_view(), name='create-invoice'),
    path('invoices/delete/<int:pk>/', InvoiceDeleteView.as_view(), name='delete-invoice'),
    path('invoices/download/<int:pk>/', InvoiceDownloadView.as_view(), name='download-invoice'),

]

