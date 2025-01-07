from django.contrib import admin
from django.urls import path, include
from api.views import CreateUserView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls), # Django admin
    path('api/user/register/', CreateUserView.as_view(), name='register'), # User registration
    path('api/token/', TokenObtainPairView.as_view(), name="get_token"), # Token based authentication
    path('api/token/refresh/', TokenRefreshView.as_view(), name="refresh_token"), # Refresh token
    path('api-auth/', include("rest_framework.urls")), # Login and logout views for the browsable API
    path('api/', include("api.urls")) # API endpoints
]
