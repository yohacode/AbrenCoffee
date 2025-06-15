from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from products.models import Product
from products.serializers import ProductSerializer
from .cart import Cart

@api_view(['POST'])
@permission_classes([AllowAny])
def clear_cart(request):
    cart = Cart(request)
    cart.clear()
    return Response({'message': 'Cart cleared successfully.'})

class CartAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        cart = Cart(request)
        return Response({
            'id': getattr(cart, 'id', 0),
            'cart_items': cart.get_items(),
            'total_price': cart.get_total_price(),
            'total_items': sum(item['quantity'] for item in cart.get_items())
        })

class CartItemCreateAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        cart = Cart(request)
        product_id = request.data.get('product_id')
        quantity = int(request.data.get('quantity', 1))

        if not product_id:
            return Response({'error': 'Product ID is required'}, status=400)

        product = get_object_or_404(Product, id=product_id)
        frequency = request.data.get('frequency')  # "daily", "monthly", or None
        cart.add(product=product, quantity=quantity, frequency=frequency)

        return Response({
            'cart': {
                'id': getattr(cart, 'id', 0),
                'cart_items': cart.get_items(),
                'total_price': cart.get_total_price(),
            }
        })

class CartItemUpdateAPIView(APIView):
    permission_classes = [AllowAny]

    def put(self, request, pk):
        cart = Cart(request)
        quantity = request.data.get('quantity')

        try:
            quantity = int(quantity)
            if quantity < 1:
                cart.remove(product=get_object_or_404(Product, id=pk))
                return JsonResponse({'message': 'Item removed from cart due to zero quantity'})
        except (TypeError, ValueError):
            return JsonResponse({'error': 'Invalid quantity'}, status=400)

        product = get_object_or_404(Product, id=pk)
        cart.update(product=product, quantity=quantity)
        return JsonResponse({'message': f'{product.name} quantity updated to {quantity}'})

class CartItemDeleteAPIView(APIView):
    permission_classes = [AllowAny]

    def delete(self, request, pk):
        cart = Cart(request)
        product = get_object_or_404(Product, id=pk)
        cart.remove(product=product)
        return JsonResponse({'message': f'{product.name} removed from cart'})

class CartMergeAPIView(APIView):
    def post(self, request):
        return JsonResponse({'message': 'Cart merge logic is handled in middleware'})
