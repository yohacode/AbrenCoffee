# admin_urls.py

from django.urls import path
from .views import (
    AdminUserAPI, AdminProductAPI, 
    AdminBlogAPI, AdminOrderDetailView,
    TotalProductsView,SalesTrendView,
    TotalStockProductsView,UserEngagementView,
    TotalSalesProductsView,AdminRefundRequestView,
    TotalOrdersCountView, TopProductsView,
    AdminRefundAprovalView,RecentOrderView,
    SalesPerDayView,AdminOrdersView,
    TotalOrderCompletedCountView,visitor_analytics,
    RefundView
    )

urlpatterns = [
    path('users/', AdminUserAPI.as_view(), name='admin-user-list-create'),
    path('users/<int:pk>/', AdminUserAPI.as_view(), name='admin-user-update-delete'),

    path('orders/', AdminOrdersView.as_view(), name='admin-order-list-create'),
    path('completed_orders/', TotalOrderCompletedCountView.as_view(), name='completed-orders'),
    path('admin_order_detail/<int:pk>/', AdminOrderDetailView.as_view(), name='admin-order-detail'),
    path('admin-refund-requests/', AdminRefundRequestView.as_view(), name='refund_requests_list'),
    path('admin-process-refund/<int:pk>', AdminRefundAprovalView.as_view(), name='process_refund_aproval'),

    path('products/', AdminProductAPI.as_view(), name='admin-product-list-create'),
    path('products/<int:pk>/', AdminProductAPI.as_view(), name='admin-product-update-delete'),

    path('blogs/', AdminBlogAPI.as_view(), name='admin-blog-list-create'),
    path('blogs/<int:pk>/', AdminBlogAPI.as_view(), name='admin-blog-update-delete'),

    path('total-products/', TotalProductsView.as_view(), name='total_products'),
    path('total-stock/', TotalStockProductsView.as_view(), name='total_stock'),
    path('total-sales/', TotalSalesProductsView.as_view(), name='total_sales'),
    path('total-orders/', TotalOrdersCountView.as_view(), name='total_orders'),
    path('top-products/', TopProductsView.as_view(), name='top-products'),
    path('sales-per-day/', SalesPerDayView.as_view(), name='sales-per-day'),

    path('visitor-analytics/', visitor_analytics, name='visitor_analytics'),
    path('recent-orders/', RecentOrderView.as_view(), name='recent_orders'),

    path('sales-trend/', SalesTrendView.as_view(), name='sales-trend'),
    path('total-refunds/', RefundView.as_view(), name='total_refund'),
    path('user-engagement/', UserEngagementView.as_view(), name='user-engagement'),
]
