from . import views
from django.urls import path

urlpatterns = [
    path('geocodeaddress/', views.GeocodeAddressView.as_view(), name='geocodeaddress'), # Geocode an address
    path('optimizeroutes/', views.OptimizeRoutesView.as_view(), name='optimizeroutes'), # Optimize routes
]