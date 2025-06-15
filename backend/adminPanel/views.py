from rest_framework.response import Response
from django.db.models.functions import TruncDate
from users.models import CustomUser
from users.serializers import UserSerializer
from orders.serializers import OrderSerializer
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.views import APIView
from products.models import Product
from django.db.models.functions import TruncMonth
from orders.models import OrderItem, Order
from payment.models import Payment
from products.serializers import ProductSerializer
from blog.models import Blog
from blog.serializers import BlogSerializer
from django.db.models import Sum, F, ExpressionWrapper, FloatField
from django.db.models.functions import Coalesce
from rest_framework.decorators import api_view, permission_classes
from django.utils.timezone import now, timedelta
from datetime import timedelta
from django.db.models import Count, Q
from .models import PageVisit

@api_view(['GET'])
@permission_classes([IsAdminUser])
def visitor_analytics(request):
    # Define time window
    last_7_days = now() - timedelta(days=7)
    
    # Define internal IPs you want to exclude (replace with yours)
    internal_ips = ['123.45.67.89', '111.222.333.444']
    
    # Define bot keywords (can expand this list as needed)
    bot_keywords = ['bot', 'crawl', 'spider', 'slurp', 'archive', 'python-requests']
    
    # Build Q object to exclude bots by user_agent
    bot_query = Q()
    for keyword in bot_keywords:
        bot_query |= Q(user_agent__icontains=keyword)
    
    # Base queryset filtering last 7 days, excluding bots and internal IPs
    base_qs = PageVisit.objects.filter(timestamp__gte=last_7_days) \
        .exclude(bot_query) \
        .exclude(ip_address__in=internal_ips)
    
    # Visits per day (total hits after filtering)
    visits_per_day = base_qs.extra({'day': "date(timestamp)"}) \
        .values('day') \
        .annotate(count=Count('id')) \
        .order_by('day')
    
    # Unique visitors per day (by distinct session_key)
    unique_visitors_per_day = base_qs.extra({'day': "date(timestamp)"}) \
        .values('day') \
        .annotate(unique_visitors=Count('session_key', distinct=True)) \
        .order_by('day')
    
    # Top visited product pages
    top_products = base_qs.filter(path__icontains='/product/') \
        .values('path') \
        .annotate(count=Count('id')) \
        .order_by('-count')[:10]
    
    # Top referrers
    top_referrers = base_qs.exclude(referrer__isnull=True).exclude(referrer='') \
        .values('referrer') \
        .annotate(count=Count('id')) \
        .order_by('-count')[:10]
    
    # Top customers by visit count (only authenticated users)
    top_customers = base_qs.filter(user__isnull=False) \
        .values('user__username') \
        .annotate(count=Count('id')) \
        .order_by('-count')[:10]
    
    # Last 10 visits (most recent)
    recent_visits_qs = base_qs.order_by('-timestamp')[:10]
    recent_visits_data = [
        {
            'user': v.user.username if v.user else 'Guest',
            'path': v.path,
            'timestamp': v.timestamp,
            'ip_address': v.ip_address,
            'referrer': v.referrer,
        }
        for v in recent_visits_qs
    ]
    
    return Response({
        'visits_per_day': list(visits_per_day),
        'unique_visitors_per_day': list(unique_visitors_per_day),
        'top_products': list(top_products),
        'top_referrers': list(top_referrers),
        'top_customers': list(top_customers),
        'recent_visits': recent_visits_data,
    })

class AdminUserAPI(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        users = CustomUser.objects.exclude(role__name='admin')
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk=None):
        if not pk:
            return Response({"error": "User ID is required for update."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = CustomUser.objects.get(pk=pk)
        except CustomUser.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None):
        if not pk:
            return Response({"error": "User ID is required for deletion."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = CustomUser.objects.get(pk=pk)
            user.delete()
            return Response({"message": "User deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
        except CustomUser.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

class AdminRoleVerificationAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.is_superuser:
            return Response({"is_admin": True}, status=status.HTTP_200_OK)
        else:
            return Response({"is_admin": False}, status=status.HTTP_403_FORBIDDEN)
        
class AdminProductAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk=None):
        if not pk:
            return Response({"error": "Product ID is required for update."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            product = Product.objects.get(pk=pk)
        except Product.DoesNotExist:
            return Response({"error": "Product not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = ProductSerializer(product, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None):
        if not pk:
            return Response({"error": "Product ID is required for deletion."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            product = Product.objects.get(pk=pk)
            product.delete()
            return Response({"message": "Product deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
        except Product.DoesNotExist:
            return Response({"error": "Product not found."}, status=status.HTTP_404_NOT_FOUND)

class AdminBlogAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        blogs = Blog.objects.all()
        serializer = BlogSerializer(blogs, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = BlogSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk=None):
        if not pk:
            return Response({"error": "Blog ID is required for update."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            blog = Blog.objects.get(pk=pk)
        except Blog.DoesNotExist:
            return Response({"error": "Blog not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = BlogSerializer(blog, data=request.data, partial=True)  # partial=True = allow updating some fields
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None):
        if not pk:
            return Response({"error": "Blog ID is required for deletion."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            blog = Blog.objects.get(pk=pk)
            blog.delete()
            return Response({"message": "Blog deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
        except Blog.DoesNotExist:
            return Response({"error": "Blog not found."}, status=status.HTTP_404_NOT_FOUND)

class TotalStockProductsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        total_stock = Product.objects.aggregate(total=Sum('stock'))['total'] or 0
        return Response({'total_stock': total_stock})
    
class TotalProductsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        total_products = Product.objects.count()
        return Response({'total_products': total_products})
    
class TotalSalesProductsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        total_sales = Payment.objects.filter(
            status='paid'  # adjust this depending on your model
        ).aggregate(total=Sum('amount'))['total'] or 0

        return Response({'total_sales': total_sales})

class AdminOrdersView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        orders = Order.objects.all()
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)
    
class AdminOrderDetailView(APIView):
    permission_classes = [IsAdminUser]

    def get(self,request, pk):
        order = Order.objects.get(id=pk)
        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_200_OK)

class TotalOrdersCountView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        total_orders = Order.objects.count()
        return Response({'total_orders': total_orders})
   
class TotalOrderCompletedCountView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        total_completed_orders = Order.objects.filter(status='paid').count()
        return Response({'total_completed_orders': total_completed_orders})

class RecentOrderView(APIView):
    def get(self, request):
        last_7_days = now() - timedelta(days=7)
        
        recent_orders = Order.objects.filter(created_at__gte=last_7_days).order_by('-created_at')[:20]

        recent_orders_data = [
            {
                'id': o.id,
                'user': o.user.username if o.user else 'Guest',
                'created_at': o.created_at,
                'reference': o.reference,
                'status': o.status,
                'total_price': o.total_price,
            }
            for o in recent_orders
        ]
        
        return Response({'recent_order_data': recent_orders_data}, status=status.HTTP_200_OK)

class AdminRefundRequestView(APIView):
    permission_classes = [IsAdminUser]

    def get(request):
        refund_orders = Order.objects.filter(refund_requested=True).order_by('-created_at')
        serializer = OrderSerializer(refund_orders, many=True)
        return Response(serializer.data)
    
class AdminRefundAprovalView(APIView):
    permission_classes = [IsAdminUser]

    def post(request, pk):
        try:
            order = Order.objects.get(id=pk, refund_requested=True)

            # Here you should trigger your real refund logic
            # For example: stripe.Refund.create(payment_intent=order.payment_intent_id)

            # For demo we just mark as processed:
            order.refund_status = 'processed'
            order.status = 'refunded'  # Optional: you may define "refunded" in your status flow
            order.save()

            # Optional: send email to user confirming refund processed

            return Response({'status': 'success'})
        except Exception as e:
            return Response({'status': 'error', 'message': str(e)}, status=400)
    
class TopProductsView(APIView):
    def get(self, request):
        top_products = (
            Product.objects
            .filter(orderitem__order__status='paid')
            .annotate(
                popularity=Coalesce(Sum('orderitem__quantity'), 0),
                sales=Coalesce(
                    Sum(
                        ExpressionWrapper(
                            F('orderitem__quantity') * F('orderitem__price'),
                            output_field=FloatField()
                        )
                    ),
                    0.0
                )
            )
            .order_by('-sales')[:10]
            .values('id', 'name', 'popularity', 'sales')
        )
        return Response(top_products) 

class SalesPerDayView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        today = now().date()
        seven_days_ago = today - timedelta(days=6)

        sales = (
            Order.objects
            .filter(status='paid')
            .annotate(day=TruncDate('created_at'))
            .filter(day__gte=seven_days_ago)
            .values('day')
            .annotate(total_sales=Sum('total_price'))
            .order_by('day')
        )

        return Response({'sales_per_day': list(sales)})
   
class SalesTrendView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        range_param = request.query_params.get('range', '6m')
        months = 6  # default
        if range_param == '3m':
            months = 3
        elif range_param == '12m':
            months = 12

        start_date = now() - timedelta(days=30 * months)

        sales_by_month = (
            Order.objects.filter(created_at__gte=start_date)
            .annotate(month=TruncMonth('created_at'))
            .values('month')
            .annotate(sales=Sum('total_price'))
            .order_by('month')
        )

        data = [
            {
                'month': entry['month'].strftime('%Y-%m'),  # YYYY-MM
                'sales': float(entry['sales'] or 0)
            }
            for entry in sales_by_month
        ]

        return Response(data, status=status.HTTP_200_OK)
    
class UserEngagementView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        # Optional: past N days (example: 30 days)
        days = int(request.query_params.get('days', 30))
        start_date = now() - timedelta(days=days)

        visits_per_day = (
            PageVisit.objects.filter(timestamp__gte=start_date)
            .annotate(day=TruncDate('timestamp'))
            .values('day')
            .annotate(visits=Count('id'))
            .order_by('day')
        )

        data = [
            {
                'date': entry['day'].strftime('%Y-%m-%d'),
                'visits': entry['visits']
            }
            for entry in visits_per_day
        ]

        return Response(data, status=status.HTTP_200_OK)
    
class RefundView(APIView):
    def get(self, request):
        refund = Order.objects.filter(refund_status__in=['approved']).count()
        return Response(refund)
