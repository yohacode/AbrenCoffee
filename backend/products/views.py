from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Product, Category, Discount
from .serializers import ProductSerializer, DiscountSerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from django.db.models import Sum, Count, Avg
from rest_framework.response import Response
from .models import Product  # Assuming you have these models
from .serializers import TransactionSerializer, ProductCategorySerializer, ProductUpdateSerializer

class ProductCategoryCreateView(APIView):

    def post(self, request):
        serailizer = ProductCategorySerializer(data=request.data)
        if serailizer.is_valid():
            serailizer.save()
            return Response(serailizer.data, status=status.HTTP_201_CREATED)
        return Response(serailizer.error, status=status.HTTP_400_BAD_REQUEST)
    
class ProductCategoryListView(APIView):

    def get(self, request):
        categories = Category.objects.all()
        serializer = ProductCategorySerializer(categories, many=True)
        return Response(serializer.data)
    
class ProductList(APIView):
    def get(self, request, format=None):
        products = Product.objects.all()

        # Filtering
        category = request.query_params.get('category')
        price_min = request.query_params.get('price_min')
        price_max = request.query_params.get('price_max')

        if category:
            products = products.filter(category=category)
        if price_min:
            products = products.filter(price__gte=price_min)
        if price_max:
            products = products.filter(price__lte=price_max)

        # Searching
        search_query = request.query_params.get('search')
        if search_query:
            products = products.filter(name__icontains=search_query)

        # Ordering
        ordering = request.query_params.get('ordering')
        if ordering in ['price', '-price', 'created_at', '-created_at']:
            products = products.order_by(ordering)

        serializer = ProductSerializer(products, many=True, context={'request': request})
        return Response(serializer.data)

class ProductCreate(APIView):
    def post(self, request, format=None):
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ✅ Centralized get_object function
def get_product_or_404(pk):
    return get_object_or_404(Product, pk=pk)

class ProductDetail(APIView):
    def get(self, request, pk, format=None):
        product = get_product_or_404(pk)
        serializer = ProductSerializer(product)
        return Response(serializer.data)

class ProductUpdate(APIView):
    permission_classes = [IsAuthenticated]
    
    def put(self, request, pk, format=None):
        product = get_product_or_404(pk)
        serializer = ProductUpdateSerializer(product, data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProductDelete(APIView):
    def delete(self, request, pk, format=None):
        product = get_product_or_404(pk)
        product.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class ProductSearch(APIView):
    def get(self, request, format=None):
        query = request.query_params.get('query', None)
        if query:
            products = Product.objects.filter(name__icontains=query)
            serializer = ProductSerializer(products, many=True)
            return Response(serializer.data)
        return Response({"error": "Query parameter 'query' is required."}, status=status.HTTP_400_BAD_REQUEST)

class ProductFilter(APIView):
    def get(self, request, format=None):
        category = request.query_params.get('category', None)
        price_min = request.query_params.get('price_min', None)
        price_max = request.query_params.get('price_max', None)

        filters = {}
        if category:
            filters['category'] = category
        if price_min:
            filters['price__gte'] = price_min
        if price_max:
            filters['price__lte'] = price_max

        products = Product.objects.filter(**filters)
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

class ProductSort(APIView):
    def get(self, request, format=None):
        sort_by = request.query_params.get('sort_by', None)
        if sort_by:
            products = Product.objects.all().order_by(sort_by)
            serializer = ProductSerializer(products, many=True)
            return Response(serializer.data)
        return Response({"error": "Query parameter 'sort_by' is required."}, status=status.HTTP_400_BAD_REQUEST)

class TransactionCreateView(APIView):
    def post(self, request):
        serializer = TransactionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()  # triggers logic in model's save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DiscountView(APIView):
    def get(self, request):
        discount = Discount.objects.all()
        serializer = DiscountSerializer(discount, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
