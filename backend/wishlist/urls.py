from django.urls import path
from .views import (
    WishlistView, WishlistCreateView, WishlistRemoveView
)

urlpatterns = [
    path('list/', WishlistView.as_view(), name='wishlist-view'),
    path('create/<int:pk>', WishlistCreateView.as_view(), name='wishlist-create'),
    path('remove/<int:pk>', WishlistRemoveView.as_view(), name='wishlist-remove'),
]
