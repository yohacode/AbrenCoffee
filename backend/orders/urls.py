from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ShippingAddressCreateView,
    ShippingAddressListView,
    ShippingAddressDetailView,
    ShippingAddressUpdateView,
    ShippingAddressDeleteView,
    
    OrderCreateView, OrderListView,
    OrderDeleteView, OrderUpdateView, OrderDetailView,
    PendingOrderView, CancelOrderView, RequestRefundView,
  ShippingAddressRetrieveView,
)


urlpatterns = [
    # Shipping address management
    path('shipping-address/', ShippingAddressListView.as_view(), name='shipping-address-list'),
    path('shipping/create/', ShippingAddressCreateView.as_view(), name='shipping-address-create'),
    path('shipping/<int:pk>/', ShippingAddressDetailView.as_view(), name='shipping-address-detail'),
    path('shipping/<int:pk>/update/', ShippingAddressUpdateView.as_view(), name='shipping-address-update'),
    path('shipping/<int:pk>/delete/', ShippingAddressDeleteView.as_view(), name='shipping-address-delete'),
    path('shipping/user/', ShippingAddressListView.as_view(), name='user-shipping-address-list'),
    path('shipping/retrieve/', ShippingAddressRetrieveView.as_view(), name='retrieve-shipping-address'),

    # Order management
    path('create/', OrderCreateView.as_view(), name='order-create'),
    path('list/', OrderListView.as_view(), name='order_list'),
    path('delete/<int:pk>/', OrderDeleteView.as_view(), name='order-delete'),
    path('update/<int:pk>/', OrderUpdateView.as_view(), name='order-update'),
    path('detail/<int:pk>/', OrderDetailView.as_view(), name='order-detail'),

    path('request-refund/<int:pk>/', RequestRefundView.as_view(), name='request-refund'),
    path('pending/', PendingOrderView.as_view()),
    path('<int:order_id>/cancel/', CancelOrderView.as_view()),
]

