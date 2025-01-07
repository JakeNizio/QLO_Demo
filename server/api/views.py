from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
import requests
import json
from optimization.quantumCVRP import quantumCVRP
from dotenv import load_dotenv
import os
load_dotenv()

# Create user view
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny] # Allow any user to create an account

# Geocode address view
class GeocodeAddressView(APIView):
    permission_classes = [IsAuthenticated] # Ensure user is authenticated

    def post(self, request):
        # Validate input data
        address = request.data.get("address")
        if not address:
            return Response(
                {"error": "Address field is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Format the address for API query
        formatted_address = address.replace(" ", "+")
        api_url = f"https://maps.googleapis.com/maps/api/geocode/json?address={formatted_address}&key={os.getenv('GOOGLEMAPS_API_KEY')}"

        try:
            # Make external API request
            response = requests.get(api_url, timeout=10)
            response.raise_for_status()  # Raise exception for HTTP errors

            # Parse JSON response
            data = response.json()

            # Handle Google API errors
            if data.get("status") != "OK":
                error_message = data.get("error_message", "Geocoding failed.")
                return Response(
                    {"error": error_message},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Return geocoding results
            return Response(data, status=status.HTTP_200_OK)
        
        except requests.exceptions.HTTPError as http_err:
            error_message = "An error occurred while fetching data from the API."
            print(f"HTTP error occurred: {http_err}")
            return Response({"error": error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as err:
            error_message = "An unexpected error occurred"
            print(f"Other error occurred: {err}")
            return Response({"error": error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Optimize routes view
class OptimizeRoutesView(APIView):
    permission_classes = [IsAuthenticated] # Ensure user is authenticated

    # Optimize routes
    def post(self, request):
        # input data
        depot = request.data.get("depot")
        deliveries = request.data.get("deliveries")
        numVehicles = int(request.data.get("numVehicles"))

        # Select coordinates for depot
        depotCoordinates = (depot["navigation_points"][0]["location"]["latitude"], depot["navigation_points"][0]["location"]["longitude"])

        # Select coordinates and demand for deliveries
        deliveriesCoordinates = []
        demand = []
        for delivery in deliveries:
            deliveriesCoordinates.append((delivery["navigation_points"][0]["location"]["latitude"], delivery["navigation_points"][0]["location"]["longitude"]))
            demand.append(delivery["demand"])

        # Optimize routes using quantum CVRP
        routes = quantumCVRP(demand, depotCoordinates, deliveriesCoordinates, numVehicles)

        # Prepare data for Google Maps API
        depotRouteData = { # Depot route data
            "location": {
                "latLng": {
                    "latitude": depotCoordinates[0],
                    "longitude": depotCoordinates[1]
                }
            },
            "vehicleStopover": True
        }

        # Deliveries route data
        deliveriesRouteData = []
        for route in routes:
            route = route.astype(int)
            if len(route) != 0:
                deliveriesRouteData.append([])
                for delivery in route:
                    deliveriesRouteData[len(deliveriesRouteData) - 1].append({
                        "location": {
                            "latLng": {
                                "latitude": deliveriesCoordinates[delivery][0],
                                "longitude": deliveriesCoordinates[delivery][1]
                            }
                        },
                        "vehicleStopover": True,
                    })

        api_url = "https://routes.googleapis.com/directions/v2:computeRoutes" # Google Maps API URL
        
        api_headers = { # Google Maps API headers
            "Content-Type": "application/json",
            "X-Goog-Api-Key": os.getenv('GOOGLEMAPS_API_KEY'),
            "X-Goog-FieldMask": "routes.routeToken,routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline"
        }

        # Get routes from Google Maps API
        googleRoutes = []
        for i in range(len(deliveriesRouteData)):
            api_data = { # Complete POST request body for a single route
                "origin": depotRouteData,
                "destination": depotRouteData,
                "intermediates": deliveriesRouteData[i],
                "travelMode": "DRIVE",
                "routingPreference": "TRAFFIC_AWARE",
                "computeAlternativeRoutes": False,
                "routeModifiers": {
                    "avoidTolls": False,
                    "avoidHighways": False,
                    "avoidFerries": False
                },
                "languageCode": "en-US",
                "units": "METRIC"
            }
            
            try:
                # Make external API request
                response = requests.post(api_url, headers=api_headers, data=json.dumps(api_data))

                response.raise_for_status()  # Raise exception for HTTP errors
                
                # Handle Google API errors
                if response.status_code != 200:
                    error_message = data.get("error_message", "Route calculation failed.")
                    googleRoutes.append({"error": error_message})
                
                # Parse JSON response
                data = response.json()
                data["deliveries"] = routes[i]
                # Return routes results
                googleRoutes.append(data)

            except requests.exceptions.HTTPError as http_err:
                error_message = "An error occurred while fetching data from the API."
                print(f"HTTP error occurred: {http_err}")
                googleRoutes.append({"error": error_message})
            except Exception as err:
                error_message = "An unexpected error occurred"
                print(f"Other error occurred: {err}")
                googleRoutes.append({"error": error_message})
            
        return Response(googleRoutes, status=status.HTTP_200_OK)