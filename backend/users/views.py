from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import CustomUser, Role
from .serializers import UserSerializer, RoleSerializer, AdminUserCreateSerializer
from rest_framework.permissions import IsAuthenticated
from orders.models import ShippingAddress
from orders.models import Order
from orders.serializers import ShippingAddressSerializer
from django.db.models import Sum

class UserList(APIView):
    def get(self, request, format=None):
        user_list = CustomUser.objects.exclude(role__name='admin')
        data = []

        for user in user_list:
            shipping_address = ShippingAddress.objects.filter(user=user)
            total_spent = Order.objects.filter(user=user)
            if total_spent.exists():
                total_spent = Order.objects.filter(status__in=total_spent.values_list('status', flat=True))
            else:
                total_spent = []

            data.append({
                'user': UserSerializer(user).data,
                'shipping_address': ShippingAddressSerializer(shipping_address, many=True).data,
                'total_spent': total_spent.aggregate(total_amount=Sum('total_price'))['total_amount'] if total_spent else 0,
            })
        return Response(data, status=status.HTTP_200_OK)

class UserCreate(APIView):
    def post(self, request, format=None):
        serializer = AdminUserCreateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)      
    
class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    
class UserDetail(APIView):
    def get_object(self, pk):
        try:
            return CustomUser.objects.get(pk=pk)
        except CustomUser.DoesNotExist:
            return None

    def get(self, request, pk, format=None):
        user = self.get_object(pk)
        if user is None:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = UserSerializer(user)
        return Response(serializer.data)
class UserUpdate(APIView):
    permission_classes = [IsAuthenticated]
    
    def get_object(self, pk):
        try:
            return CustomUser.objects.get(pk=pk)
        except CustomUser.DoesNotExist:
            return None

    def put(self, request, pk, format=None):
        user = self.get_object(pk)
        if user is None:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = UserSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request, pk, format=None):  # <-- Add this
        user = self.get_object(pk)
        if user is None:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = UserSerializer(user, data=request.data, partial=True)  # <-- partial update
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserDelete(APIView):
    def get_object(self, pk):
        try:
            return CustomUser.objects.get(pk=pk)
        except CustomUser.DoesNotExist:
            return None

    def delete(self, request, pk, format=None):
        user = self.get_object(pk)
        if user is None:
            return Response(status=status.HTTP_404_NOT_FOUND)
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class RoleCreateView(APIView):
    def post(self, request):
        serializer = RoleSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class RoleListView(APIView):
    def get(self, request):
        roles = Role.objects.all()
        if not roles:
            return Response({'error': 'No roles found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = RoleSerializer(roles, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class RoleDeleteView(APIView):
    def delete(self, request):
        role = request.data.get('role')
        if not role:
            return Response({'error': 'Role not provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            Role.objects.filter(role=role).delete()
            return Response({'message': f'Role {role} deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        