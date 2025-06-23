from rest_framework import serializers
from subscription.models import Subscription

class SubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = ["id", "provider", "external_id", "active", "created_at"]
        read_only_fields = ["id", "created_at"]

