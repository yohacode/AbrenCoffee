from rest_framework import serializers
from .models import (
    ShippingAddress,
    BillingAddress,
    Order,
    OrderItem,
)
from payment.models import Invoice, Payment



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
    
class ShippingAddressSerializer(serializers.ModelSerializer):

    class Meta:
        model = ShippingAddress
        fields = [
            'id', 'user', 'session_key',
            'full_name', 'phone_number', 'email',
            'address1', 'address2', 'city', 'street',
            'state', 'zipcode', 'country',
            'status', 'created_at', 'updated_at'
        ]
        read_only_fields = ['user', 'session_key', 'status', 'created_at', 'updated_at']



class BillingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = BillingAddress
        fields = ['id', 'name', 'address', 'city', 'postal_code', 'country']


class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'quantity', 'price']
        read_only_fields = ['price', 'product_name']


class OrderSerializer(serializers.ModelSerializer):
    order_items = OrderItemSerializer(many=True, read_only=True)
    user = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'user', 'session_key',
            'shipping_address', 'created_at',
            'is_paid', 'status', 'total_price',
            'order_items', 'refund_requested', 'refund_status'
        ]
        read_only_fields = ['user', 'created_at', 'is_paid', 'status', 'total_price']

    def create(self, validated_data):
        request = self.context.get('request')
        if request.user.is_authenticated:
            validated_data['user'] = request.user
        else:
            validated_data['session_key'] = request.session.session_key
        return super().create(validated_data)


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

