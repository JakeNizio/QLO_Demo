from . import views
from django.urls import path

urlpatterns = [
    path('geocodeaddress/', views.GeocodeAddressView.as_view(), name='geocodeaddress'), # Geocode an address
    path('optimizeroutes/quantum/', views.OptimizeRoutesView.as_view(), name='quantumoptimizeroutes'), # Optimize routes
    path('optimizeroutes/google/', views.GoogleOptimizeRoutesView.as_view(), name='googleoptimizeroutes'), # Optimize routes

]