from . import views
from django.urls import path

urlpatterns = [
    path('users/', views.GetUserView.as_view(), name='user-list'),
]