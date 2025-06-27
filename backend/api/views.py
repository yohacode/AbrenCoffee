from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from users.serializers import UserRegisterSerializer, CustomTokenObtainPairSerializer, UserRoleUpdateSerializer
from rest_framework.generics import UpdateAPIView
from users.models import CustomUser
from orders.models import ShippingAddress
from django.contrib.auth import authenticate, login,logout
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth import update_session_auth_hash
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator
from django.conf import settings
from django.utils.http import urlsafe_base64_decode
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth import get_user_model

def merge_session_order_with_user(request, user):
    session_key = request.session.session_key
    if not session_key:
        return

    session_order = ShippingAddress.objects.filter(session_key=session_key, user__isnull=True).order_by('-created_at').first()
    if session_order:
        # Check if user already has a newer order
        latest_user_order = ShippingAddress.objects.filter(user=user).order_by('-created_at').first()
        if not latest_user_order or latest_user_order.created_at < session_order.created_at:
            session_order.user = user
            session_order.session_key = None  # Optional: disassociate session
            session_order.save()

class UserRoleUpdateView(UpdateAPIView):
    permission_classes = [IsAdminUser]
    queryset = CustomUser.objects.all()
    serializer_class = UserRoleUpdateSerializer

class RegisterView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = UserRegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'User registered successfully.'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CustomLoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        # Authenticate user and get tokens as usual
        response = super().post(request, *args, **kwargs)

        # Now get the user from the serializer (decoded from the validated token)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.user

        # Ensure the session exists
        if not request.session.session_key:
            request.session.create()

        # Merge orders
        merge_session_order_with_user(request, user)

        return response

class LoginView(APIView): 
    def post(self, request): 
        username = request.data.get('username') 
        password = request.data.get('password') 
        user = authenticate(username=username, password=password) 
        if user is not None: 
            login(request, user) 
            refresh = RefreshToken.for_user(user) 
            return Response({
                'refresh': str(refresh), 
                'access': str(refresh.access_token), 
                'role': user.role.name
            }) 
        else: 
            return Response({'error': 'Invalid credentials'}, status=400)
        
class LogoutAndBlacklistRefreshTokenView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            if not refresh_token:
                return Response({'error': 'Refresh token is required'}, status=status.HTTP_400_BAD_REQUEST)
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class AuthStatusView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        if request.user.is_authenticated:
            refresh = RefreshToken.for_user(request.user)
            return Response({
                'isAuthenticated': True,
                'access_token': str(refresh.access_token),
                'refresh_token': str(refresh),
                'user': {
                    'username': request.user.username,
                    'email': request.user.email,
                    'role': request.user.role.name,
                }
            }, status=status.HTTP_200_OK)
        return Response({
            'isAuthenticated': False,
        }, status=status.HTTP_200_OK)
    
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def change_password(request):
    user = request.user
    old_password = request.data.get("old_password")
    new_password = request.data.get("new_password")
    confirm_password = request.data.get("confirm_password")

    if new_password != confirm_password:
        return Response({"error": "New passwords do not match"}, status=400)

    if not user.check_password(old_password):
        return Response({"error": "Old password is incorrect"}, status=400)

    user.set_password(new_password)
    user.save()

    update_session_auth_hash(request, user)  # keeps user logged in after password change

    return Response({"success": "Password updated successfully"})

@api_view(["POST"])
def send_password_reset_email(request):
    email = request.data.get("email")
    try:
        user = CustomUser.objects.get(email=email)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        reset_link = f"{settings.FRONTEND_URL}/reset-password/{uid}/{token}/"

        subject = "Reset your password"
        message = f"Hi {user.username},\n\nClick the link below to reset your password:\n\n{reset_link}"

        send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [email])
        return Response({"success": "Password reset email sent."})
    except CustomUser.DoesNotExist:
        return Response({"error": "User not found."}, status=404)
    

@api_view(["POST"])
def confirm_password_reset(request):
    uidb64 = request.data.get("uid")
    token = request.data.get("token")
    new_password = request.data.get("new_password")

    try:
        uid = urlsafe_base64_decode(uidb64).decode()
        user = get_user_model().objects.get(pk=uid)
    except Exception:
        return Response({"error": "Invalid link"}, status=status.HTTP_400_BAD_REQUEST)

    if not default_token_generator.check_token(user, token):
        return Response({"error": "Invalid or expired token"}, status=400)

    user.set_password(new_password)
    user.save()
    return Response({"success": "Password reset successful"})

