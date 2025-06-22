from rest_framework import serializers
from .models import Product, Category, Discount
from .models import Transaction  # Import the Transaction model
from orders.models import ShippingAddress, Order, OrderItem

class ProductCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    class Meta:
        model = Product
        fields = ['id', 'name', 'category', 'category_name', 'stock', 'quantity', 'description', 'price', 'discount', 'image', 'created_at']
        read_only_fields = ('id', 'created_at', 'updated_at')

class ProductUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'category', 'stock', 'quantity', 'description', 'price', 'image']
        read_only_fields = ('id', 'created_at', 'updated_at')

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'


class DiscountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Discount
        fields = ['product', 'discount_type', 'percent', 'start_date', 'end_date', 'promo_code']
        
