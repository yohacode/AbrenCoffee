from rest_framework import serializers
from .models import WishlistItem

class WishlistItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = WishlistItem
        fields = ['user', 'product', 'added_at']
        read_only_fields = ['added_at']
