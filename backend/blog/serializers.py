from rest_framework import serializers
from .models import Blog, Category, Comments, Reactions

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id','name']
        read_only_fields = ['id']

class BlogSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all()
    )
    category_name = serializers.SerializerMethodField()
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
            'category',
            'category_name',
            'is_published',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'author', 'created_at', 'updated_at']

    def get_category_name(self, obj):
        return obj.category.name

class BlogCreateSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all()
    )
    class Meta:
        model = Blog
        fields = ['title', 'content', 'image', 'tags', 'category','is_published']
        read_only_fields = ['author']  # Author will be set in the view, not in the serializer

    def create(self, validated_data):
        request = self.context.get('request')
        validated_data['author'] = request.user  # Set the author to the current user
        return super().create(validated_data)

class BlogUpdateSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())

    class Meta:
        model = Blog
        fields = ['title', 'content', 'image', 'category', 'is_published']
        read_only_fields = ['author']  # Author will be set in the view, not in the serializer

    def update(self, instance, validated_data):
        request = self.context.get('request')
        if request:
            validated_data['author'] = request.user
        return super().update(instance, validated_data)
    
class CommentsSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source='author.username', read_only=True)

    class Meta:
        model = Comments
        fields = ['id', 'author', 'author_username', 'content', 'created_at']
        read_only_fields = ['id', 'author', 'created_at']
    
    def create(self, validated_data):
        request = self.context.get('request')
        validated_data['author'] = request.user  # Set the author to the current user
        return super().create(validated_data)
    

class ReactionsSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source='author.username', read_only=True)

    class Meta:
        model = Reactions
        fields = ['id', 'author', 'author_username', 'reaction', 'created_at']
        read_only_fields = ['id', 'author','author_username', 'created_at']
    
    def create(self, validated_data):
        request = self.context.get('request')
        validated_data['author'] = request.user  # Set the author to the current user
        return super().create(validated_data)
    
