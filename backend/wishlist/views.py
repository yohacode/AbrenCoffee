from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import WishlistItem
from .serializers import WishlistItemSerializer

class WishlistView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        wishlist = WishlistItem.objects.get(user)
        serializer = WishlistItemSerializer(wishlist, many=True)
        return Response(serializer)

class WishlistCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        wishlist = WishlistItem.objects.get(id=pk)
        serializer = WishlistItemSerializer(wishlist)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class WishlistRemoveView(APIView):
    permission_classes = [IsAuthenticated]
    
    def delete(self, request, pk):
        wishlist_item = WishlistItem.objects.get(id=pk)
        wishlist_item.delete()
        return Response('Item removed successfully',status=status.HTTP_200_OK)

