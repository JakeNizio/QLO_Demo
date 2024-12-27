from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class GeocodeAddressView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        print(request.data)
        return Response({"message": "Geocoded Address!" }, status=status.HTTP_200_OK)
    
class OptimizeRoutesView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        return Response({"message": "Routes Optimized!" }, status=status.HTTP_200_OK)