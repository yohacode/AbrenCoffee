# in cart/urls.py

from django.urls import path
from .views import (
    CartAPIView,
    CartItemCreateAPIView,
    CartItemUpdateAPIView,
    CartItemDeleteAPIView,
    CartMergeAPIView
)
from .views import clear_cart

urlpatterns = [
    path('', CartAPIView.as_view(), name='cart-detail'),
    path('add/', CartItemCreateAPIView.as_view(), name='cart-add'),
    path('update/<int:pk>/', CartItemUpdateAPIView.as_view(), name='cart-update'),
    path('delete/<int:pk>/', CartItemDeleteAPIView.as_view(), name='cart-delete'),
    path('merge/', CartMergeAPIView.as_view(), name='cart-merge'),

     path('clear/', clear_cart, name='clear-cart'),
]
