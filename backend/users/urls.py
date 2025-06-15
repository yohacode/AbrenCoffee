from django.urls import path
from .views import UserList, UserDetail, UserUpdate, UserDelete, UserCreate, CurrentUserView, RoleCreateView, RoleListView, RoleDeleteView

urlpatterns = [
    path('users/', UserList.as_view(), name='user-list'),
    path('create/', UserCreate.as_view(), name='user-create'),
    path('me/', CurrentUserView.as_view(), name='user-me'),
    path('detail/<int:pk>/', UserDetail.as_view(), name='user-detail'),
    path('update/<int:pk>/', UserUpdate.as_view(), name='user-update'),
    path('delete/<int:pk>/', UserDelete.as_view(), name='user-delete'),

    path('role/create/', RoleCreateView.as_view(), name='role-create'),
    path('role/list/', RoleListView.as_view(), name='role-list'),
    path('role/delete/', RoleDeleteView.as_view(), name='role-delete'),

]