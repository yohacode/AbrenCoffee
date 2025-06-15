import stripe
from django.shortcuts import get_object_or_404, redirect
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import ShippingAddress, OrderItem, Product, Order
from .serializers import ShippingAddressSerializer
from orders.serializers import OrderSerializer
from django.conf import settings
from .models import Order
from .utils import get_cart_total,get_cart_data, get_or_create_shipping_address, is_identical_address


stripe.api_key = settings.STRIPE_SECRET_KEY

# ----------------------------------------
# Helper functions
# ----------------------------------------
# utils.py

# ----------------------------------------
# Order Views
# ----------------------------------------

class OrderCreateView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        shipping_address = get_or_create_shipping_address(request)
        if not shipping_address:
            return Response({"error": "Shipping address is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        user = request.user if request.user.is_authenticated else None
        session_key = None
        if not user:
            if not request.session.session_key:
                request.session.save()
            session_key = request.session.session_key

        # Calculate the total from the cart
        total_price = get_cart_total(request, user=user, session_key=session_key)  # Replace with your actual logic

        order, created = Order.objects.get_or_create(
            user=user,
            session_key=None if user else session_key,
            status='pending',
            defaults={
                'shipping_address': shipping_address,
                'total_price': total_price,
            }
        )

        # If the order already existed, optionally update shipping and recalculate total
        order.shipping_address = shipping_address
        order.total_price = get_cart_total(request, user=user, session_key=session_key)
        order.save()
        order_items = []
        cart_items = get_cart_data(request)
        for item in cart_items:
            product = get_object_or_404(Product, id=item['product_id'])
            frequency = item.get('delivery_frequency', 'none')
            order_item, created = OrderItem.objects.get_or_create(
                order=order,
                product=product,
                defaults={'quantity': item['quantity'], 'price': product.price},
                delivery_frequency=frequency,
            )
            if not created:
                order_item.quantity += item['quantity']
                order_item.save()
            order_items.append(order_item)

            product.stock -= item['quantity']
            product.save()

        return Response({
            'order_id': order.id,
            'shipping_address_id': shipping_address.id,
            'total_price': order.total_price,
            'created': created,
        }, status=status.HTTP_200_OK)

class OrderListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        orders = Order.objects.filter(user=request.user).order_by('-created_at')
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class OrderDeleteView(APIView):
    permission_classes = [IsAdminUser]

    def delete(self, request, pk):
        order = get_object_or_404(Order, pk=pk, user=request.user)
        if order.status != 'pending':
            return Response({'error': 'Only pending orders can be deleted'}, status=status.HTTP_400_BAD_REQUEST)
        
        order.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class OrderDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        order = get_object_or_404(Order, id=pk)

        # Ensure the order belongs to the requesting user
        if order.user != request.user:
            return Response({'detail': 'Not authorized to view this order.'}, status=status.HTTP_403_FORBIDDEN)

        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_200_OK)

class OrderUpdateView(APIView):
    permission_classes = [IsAdminUser]

    def put(self, request, pk):
        order = get_object_or_404(Order, pk=pk, user=request.user)
        serializer = OrderSerializer(order, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PendingOrderView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        if request.user.is_authenticated:
            order = Order.objects.filter(user=request.user, status='pending').last()
        else:
            session_key = request.session.session_key
            if not session_key:
                request.session.save()
                session_key = request.session.session_key
            order = Order.objects.filter(session_key=session_key, status='pending').last()

        if order:
            serializer = OrderSerializer(order)
            return Response(serializer.data)
        return Response({'detail': 'No pending orders'}, status=404)

class CancelOrderView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, order_id):
        order = get_object_or_404(Order, id=order_id)

        # Ownership check
        if request.user.is_authenticated:
            if order.user != request.user:
                return Response({'detail': 'Unauthorized'}, status=403)
        else:
            session_key = request.session.session_key
            if not session_key or order.session_key != session_key:
                return Response({'detail': 'Unauthorized'}, status=403)

        if order.status != 'pending':
            return Response({'detail': 'Order cannot be cancelled'}, status=400)

        for item in order.items.all():
            item.product.stock += item.quantity
            item.product.save()

        order.status = 'cancelled'
        order.save()
        return Response({'detail': 'Order cancelled and stock restored'})
    
class RequestRefundView(APIView):
    permission_classes = [IsAuthenticated]
    def post(request, pk):
        try:
            order = Order.objects.get(id=pk, user=request.user)
            if order.status != 'delivered' or order.refund_requested:
                return Response({'status': 'error', 'message': 'Refund not allowed'})

            order.refund_requested = True
            order.save()

            return Response({'status': 'success'})
        except Exception as e:
            return Response({'status': 'error', 'message': str(e)}, status=400)


# ----------------------------------------
# Shipping Address Views with ownership checking
# ----------------------------------------

class ShippingAddressOwnershipMixin:
    """
    Mixin to filter queryset by user or session_key ownership.
    """

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            return ShippingAddress.objects.filter(user=user)
        session_key = self.request.session.session_key
        if not session_key:
            self.request.session.create()
            session_key = self.request.session.session_key
        return ShippingAddress.objects.filter(session_key=session_key)


class ShippingAddressCreateView(ShippingAddressOwnershipMixin, APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data
        serializer = ShippingAddressSerializer(data=data)
        
        if serializer.is_valid():
            # Ensure session is created for guest users
            if not request.user.is_authenticated:
                if not request.session.session_key:
                    request.session.create()

            # Determine ownership filter
            if request.user.is_authenticated:
                addresses = ShippingAddress.objects.filter(user=request.user)
            else:
                addresses = ShippingAddress.objects.filter(session_key=request.session.session_key)

            # Reuse identical address if found
            for addr in addresses:
                if is_identical_address(addr, serializer.validated_data):
                    return Response(
                        ShippingAddressSerializer(addr).data,
                        status=status.HTTP_200_OK
                    )

            # Save new address with proper ownership
            if request.user.is_authenticated:
                serializer.save(user=request.user)
            else:
                serializer.save(session_key=request.session.session_key)

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ShippingAddressListView(ShippingAddressOwnershipMixin, APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        queryset = self.get_queryset()
        serializer = ShippingAddressSerializer(queryset, many=True)
        return Response(serializer.data)

class ShippingAddressDetailView(ShippingAddressOwnershipMixin, APIView):
    permission_classes = [AllowAny]

    def get_object(self, pk):
        return get_object_or_404(self.get_queryset(), pk=pk)

    def get(self, request, pk):
        address = self.get_object(pk)
        serializer = ShippingAddressSerializer(address)
        return Response(serializer.data)

    def delete(self, request, pk):
        address = self.get_object(pk)
        address.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class ShippingAddressUserView(ShippingAddressOwnershipMixin, APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        queryset = self.get_queryset()
        serializer = ShippingAddressSerializer(queryset, many=True)
        return Response(serializer.data)
    
class ShippingAddressUpdateView(ShippingAddressOwnershipMixin, APIView):
    permission_classes = [AllowAny]

    def get_object(self, pk):
        return get_object_or_404(self.get_queryset(), pk=pk)

    def put(self, request, pk):
        address = self.get_object(pk)
        serializer = ShippingAddressSerializer(address, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class ShippingAddressDeleteView(ShippingAddressOwnershipMixin, APIView):
    permission_classes = [AllowAny]

    def get_object(self, pk):
        return get_object_or_404(self.get_queryset(), pk=pk)

    def delete(self, request, pk):
        address = self.get_object(pk)
        address.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class ShippingAddressRetrieveView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        address = ShippingAddress.objects.filter(user=request.user).last()
        if not address:
            return Response({'detail': 'No address found.'}, status=404)
        serializer = ShippingAddressSerializer(address)
        return Response(serializer.data)
