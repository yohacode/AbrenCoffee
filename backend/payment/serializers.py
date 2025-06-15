from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import (Payment,Invoice)
from orders.models import OrderItem, Order


class InvoiceSerializer(serializers.ModelSerializer):
    pdf = serializers.SerializerMethodField()

    class Meta:
        model = Invoice
        fields = '__all__'

    def get_pdf(self, obj):
        request = self.context.get('request')
        if obj.pdf and request:
            return request.build_absolute_uri(obj.pdf.url)
        return None
    
class PaymentSerializer(serializers.ModelSerializer):
    order = serializers.PrimaryKeyRelatedField(
        queryset=Order.objects.all(),
        write_only=True
    )
    order_id = serializers.IntegerField(source='order.id', read_only=True)

    class Meta:
        model = Payment
        fields = [
            'id', 'order', 'order_id',
            'payment_method', 'amount',
            'transaction_id', 'status', 'timestamp'
        ]
        read_only_fields = [
            'id', 'transaction_id', 'status', 'timestamp', 'order_id'
        ]

    def validate(self, attrs):
        order = attrs.get('order')
        if hasattr(order, 'payment'):
            raise serializers.ValidationError("Payment for this order already exists.")
        if attrs.get('amount') is not None and attrs['amount'] <= 0:
            raise serializers.ValidationError("Payment amount must be greater than zero.")
        return attrs

    def create(self, validated_data):
        request = self.context.get('request')
        order = validated_data.pop('order')

        user = request.user if request and request.user.is_authenticated else None
        session_key = request.session.session_key if request else None

        from uuid import uuid4
        transaction_id = str(uuid4())

        return Payment.objects.create(
            order=order,
            user=user,
            session_key=session_key,
            transaction_id=transaction_id,
            status='pending',
            **validated_data
        )

