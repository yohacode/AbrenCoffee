from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

from .models import WishlistItem
from .serializers import WishlistItemSerializer
from products.models import Product


class WishlistView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        wishlist = WishlistItem.objects.filter(user=user)

        data = []
        for item in wishlist:
            product = item.product

            data.append({
                "id": item.id,
                "added_at": item.added_at,
                "product" : {
                    "id": product.id,
                    "name": product.name,
                    "image": product.image.url if product.image else None,
                    "price": product.price,
                },
            })
        return Response(data, status=status.HTTP_200_OK)


class WishlistCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data.copy()
        data['user'] = request.user.id  # Ensure user is set from auth
        serializer = WishlistItemSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class WishlistRemoveView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        wishlist_item = get_object_or_404(WishlistItem, id=pk, user=request.user)
        wishlist_item.delete()
        return Response({'detail': 'Item removed successfully'}, status=status.HTTP_200_OK)
