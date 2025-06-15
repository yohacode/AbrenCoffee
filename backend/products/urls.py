from django.urls import path

from .views import (
    ProductList,
    ProductDetail,
    ProductCreate,
    ProductUpdate,
    ProductDelete,
    TransactionCreateView,ProductCategoryCreateView,
    ProductCategoryListView,
    DiscountView
)

urlpatterns = [
    path('list/', ProductList.as_view(), name='product-list'),
    path('detail/<int:pk>/', ProductDetail.as_view(), name='product-detail'),
    path('create/', ProductCreate.as_view(), name='product-create'),
    path('update/<int:pk>', ProductUpdate.as_view(), name='product-update'),
    path('delete/<int:pk>/', ProductDelete.as_view(), name='product-delete'),
    
    path('create-transaction/', TransactionCreateView.as_view(), name='create_transaction'),
    path('create-category/', ProductCategoryCreateView.as_view(), name='create-category'),
    path('list-category/', ProductCategoryListView.as_view(), name='list-category'),
    #path('list-transaction/', TransactionList.as_view(), name='list-transaction'),
    path('discount/list/', DiscountView.as_view(), name='discount-list'),
]