from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Role

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    role = serializers.CharField(source='role.name', read_only=True)
    class Meta:
        model = User
        fields = ['id', 'username',
                  'first_name','profile_image', 
                  'last_name', 'email', 'role',
                    'date_joined']

class UserRoleUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['role']

class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, allow_null=True, required=False)

    class Meta:
        model = User
        fields = ('username', 'email', 'password')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
        )
        customer_role = Role.objects.get_or_create(name='customer')[0]
        user.role = customer_role
        user.save()
        return user


class AdminUserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, allow_null=True, required=False)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'role')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
        )
        user.role = validated_data.get('role')
        user.save()
        return user
    
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['role'] = user.role.name if user.role else None
        return token

    def validate(self, attrs):
        # Use email to find the user
        username = attrs.get('username')
        password = attrs.get('password')

        # Fetch user based on email, not username
        try:
            self.user = User.objects.get(username=username)
        except User.DoesNotExist:
            raise serializers.ValidationError({'username': 'User with this username does not exist.'})

        # Now use the default validate method
        attrs['username'] = self.user.username  # Make sure username is set for authentication
        data = super().validate(attrs)
        
        # Add additional fields (email, role) to the response data
        data['email'] = self.user.email
        data['role'] = self.user.role.name if self.user.role else None
        return data


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = '__all__'

