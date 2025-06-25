from django.urls import path
from .views import (BlogList, 
                    BlogDetail, BlogCreate, 
                    BlogUpdate, BlogDelete,
                    CategoriesView, CreateCategoryView,
                    CommentCreateView, CommentView)

urlpatterns = [
    path('list/', BlogList.as_view(), name='blog-list'),
    path('detail/<int:pk>/', BlogDetail.as_view(), name='blog-detail'),
    path('create/', BlogCreate.as_view(), name='blog-create'),
    path('update/<int:pk>/', BlogUpdate.as_view(), name='blog-update'),
    path('delete/<int:pk>/', BlogDelete.as_view(), name='blog-delete'),

    path('category/', CategoriesView.as_view(), name='category'),
    path('category/create/', CreateCategoryView.as_view(), name='create-category'),

    path('comment/<int:pk>/', CommentView.as_view(), name='comment-detail'),
    path('comment/create/<int:pk>/', CommentCreateView.as_view(), name='create-comment-detail'),
]
