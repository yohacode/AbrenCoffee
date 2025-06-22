from rest_framework import serializers
from .models import Product, Category, Discount
from .models import Transaction  # Import the Transaction model
from orders.models import ShippingAddress, Order, OrderItem

class ProductCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), many=True)

    class Meta:
        model = Product
        fields = ['id', 'name', 'category', 'stock', 'quantity', 'description', 'price', 'discount', 'image', 'created_at']
        read_only_fields = ('id', 'created_at', 'updated_at')

    def update(self, instance, validated_data):
        categories = validated_data.pop('category', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if categories is not None:
            instance.category.set(categories)
        return instance

    def validate(self, data):
        if data['price'] < 0:
            raise serializers.ValidationError("Price must be a positive number.")
        if data['stock'] < 0:
            raise serializers.ValidationError("Stock must be a positive number.")
        return data

    def validate_sku(self, value):
        if Product.objects.filter(sku=value).exists():
            raise serializers.ValidationError("SKU must be unique.")
        return value

    def validate_image(self, value):
        if value.size > 5 * 1024 * 1024:
            raise serializers.ValidationError("Image size must be less than 5 MB.")
        return value

    def validate_name(self, value):
        if not value:
            raise serializers.ValidationError("Name cannot be empty.")
        return value 

    def validate_stock(self, value):
        if value < 0:
            raise serializers.ValidationError("Stock cannot be negative.")
        return value
 
class ProductUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'category', 'stock', 'quantity', 'description', 'price', 'discount', 'image']
        read_only_fields = ('id', 'created_at', 'updated_at')

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'


class DiscountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Discount
        fields = ['product', 'discount_type', 'percent', 'start_date', 'end_date', 'promo_code']
        
