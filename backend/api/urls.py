from django.urls import path
from .views import RegisterView, CustomLoginView, LogoutAndBlacklistRefreshTokenView, AuthStatusView, UserRoleUpdateView
from .views import CustomLoginView, LoginView,change_password, send_password_reset_email, confirm_password_reset

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutAndBlacklistRefreshTokenView.as_view(), name='logout'),
    path('auth/status/', AuthStatusView.as_view(), name='auth-status'),
    path('role/update/<int:pk>/', UserRoleUpdateView.as_view(), name='user-role-update'),
    path("token/", CustomLoginView.as_view(), name="token_obtain_pair"),

    path('change-password/', change_password, name='change-password'),
    path('auth/request-password-reset/', send_password_reset_email),
    path('auth/reset-password/', confirm_password_reset),
]
