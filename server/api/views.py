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

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class GeocodeAddressView(APIView):
    permission_classes = [IsAuthenticated]

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

    
class OptimizeRoutesView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        depot = request.data.get("depot")
        deliveries = request.data.get("deliveries")
        numVehicles = int(request.data.get("numVehicles"))
        # demand = request.data.get("demand") # reinstate this code after testing
        demand = [10, 20, 20, 40, 10, 50, 10, 5, 5]; # test demand

        depotCoordinates = (depot["navigation_points"][0]["location"]["latitude"], depot["navigation_points"][0]["location"]["longitude"])

        deliveriesCoordinates = []
        for delivery in deliveries:
            deliveriesCoordinates.append((delivery["navigation_points"][0]["location"]["latitude"], delivery["navigation_points"][0]["location"]["longitude"]))

        #! reinstate this code after testing
        # routes = quantumCVRP(demand, depotCoordinates, deliveriesCoordinates, numVehicles)
        routes = [[6, 2], [1, 5, 7, 8, 3, 0, 4]]

        #todo format and pass the quantum results into GRA
        #! edit for quantum results, running multiple times for each quantum route
        depotRouteData = {
            "location": {
                "latLng": {
                    "latitude": depotCoordinates[0],
                    "longitude": depotCoordinates[1]
                }
            },
            "vehicleStopover": True
        }

        deliveriesRouteData = []
        for route in routes:
            deliveriesRouteData.append([])
            # route = route.astype(int) # reinstate with the quantum results
            for delivery in route:
                deliveriesRouteData[len(deliveriesRouteData) - 1].append({
                    "location": {
                        "latLng": {
                            "latitude": deliveriesCoordinates[delivery][0],
                            "longitude": deliveriesCoordinates[delivery][1]
                        }
                    },
                    "vehicleStopover": True
                })


        api_url = "https://routes.googleapis.com/directions/v2:computeRoutes"
        api_headers = {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": os.getenv('GOOGLEMAPS_API_KEY'),
            "X-Goog-FieldMask": "routes.routeToken,routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline"
        }
        api_data = {
            "origin": depotRouteData,
            "destination": depotRouteData,
            #todo multiple requests for each quantum route, then combine the results. deliveresRouteData[0] is the first quantum route
            "intermediates": deliveriesRouteData[0],
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
                return Response(
                    {"error": error_message},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            
            # Parse JSON response
            data = response.json()

            # Return routes results
            return Response(data, status=status.HTTP_200_OK)
        
        except requests.exceptions.HTTPError as http_err:
            error_message = "An error occurred while fetching data from the API."
            print(f"HTTP error occurred: {http_err}")
            return Response({"error": error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as err:
            error_message = "An unexpected error occurred"
            print(f"Other error occurred: {err}")
            return Response({"error": error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({"routes": results}, status=status.HTTP_200_OK)
        # return Response({"message": "Routes Optimized!" }, status=status.HTTP_200_OK)