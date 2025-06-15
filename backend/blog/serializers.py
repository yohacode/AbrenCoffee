from rest_framework import serializers
from .models import Blog, Category
from django.conf import settings
from users.models import CustomUser

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id','name']
        read_only_fields = ['id']

class BlogSerializer(serializers.ModelSerializer):
    categories = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Category.objects.all()
    )
    categories_name = serializers.SerializerMethodField()
    author_username = serializers.CharField(source='author.username', read_only=True)

    class Meta:
        model = Blog
        fields = [
            'id',
            'title',
            'content',
            'author',
            'author_username',
            'image',
            'tags',
            'categories',
            'categories_name',
            'is_published',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'author', 'created_at', 'updated_at']

    def get_categories_name(self, obj):
        return [cat.name for cat in obj.categories.all()]

class BlogCreateSerializer(serializers.ModelSerializer):
    categories = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Category.objects.all()
    )
    class Meta:
        model = Blog
        fields = ['title', 'content', 'image', 'tags', 'categories','is_published']
        read_only_fields = ['author']  # Author will be set in the view, not in the serializer

    def create(self, validated_data):
        request = self.context.get('request')
        validated_data['author'] = request.user  # Set the author to the current user
        return super().create(validated_data)
    