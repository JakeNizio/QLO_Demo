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
        tempdata  = {
    "data": [
        {
            "routes": [
                {
                    "distanceMeters": 29640,
                    "duration": "3356s",
                    "polyline": {
                        "encodedPolyline": "i|liGxpgcNUw@HMOq@m@h@]RtK|]wHzF}AbAmAfAEPkB|AmBxBeIpJ{@fAeCjCmBxAyBjA{Aj@aCh@}MdCs\\vG}MlCuBn@uBdAmBtAyKvJuB|AwBhAyB|@eCn@kI`BaEh@wCTuMn@cB?aBOkBe@wK_EsBg@kBUsEOgDKqC[oCk@kC{@{BcA_CuAaCkBqBoB}Wi\\uAkBgAsBq@kBk@}B_@}BQwBGqB@eCRaEhAuQJoDCcCSwC]gCk@_Cw@yB_AiBuB_DiD_FkA{By@qBy@oC}BkIaAcC{@{AgAyAgAgA{AcA_Bq@{A_@{G_A_H_AgBe@}Au@_BmAaAcA{B}CuKePyAgByAkAmAq@aBk@yAWkAI_BBiBTaAV}An@gBlAiB`BqEnEkCvB_DtBmDfB}@^WMu@Jk@Ag@YcC{Bg@WaAMw@Ga@?s@Y_@e@g@oAqCqP{Fo]g@mDi@uHIuC?uDJsDLwBJiAPoAzCi_@l@sIl@eIJwC@kBAaFg@yJ[mBYcC{@qFw@cG}A{K_B_MeFa_@mAwIo@gE_BoLoAeKa@iCu@sFc@}DaBsL}@cHoAqIa@eDa@oCq@sDaAqGWeC|BcAjGoBdCy@WgBVfBtIuCjq@sTjHeChF}AbB[~@jGJXdCbQ`DnRp@pEA`@l@~DRhBp@nFLzADPZbDhFv_@fAbILbARxALNf@dDlArJ~Fxb@dAvHx@rFl@bFt@lFLdA?p@b@KxBw@|FmBNn@JFjBR~L~FjATrFP`HAjGRhKJ~APpDh@bBDhEQjYyAHh@pDfWdEsAv@vFjGwBtOuEP@PDh@IpPiFZWn@w@l@y@l@[d@MtCR^ITOt@bGj@vEVnAzA~EtCnJt@vB`AvBdA~AvLpNpLwDlLkDhQqFL@|@Uz@Cb@F~@^dAx@~@`A~@zAn@~Ah@pBZlBpB~NbCxPpBdOTp@d@jDvEb]Bj@hAhIZfBvAlKjBdN^jBx@rCrGtQrIjUtE`NzA~EvAlE`A~Cd@tA\\Sl@i@Np@ILTv@"
                    },
                    "routeToken": "CtwDCu8CMuwCGnYKJAIWCTronzhFgAjdEeoF-A_GviDR8NEOsvXOC7WmzBHSx9YRABIgCvbNJkPFSAnBLYFtIJ74m7cgvgCzS4UnwlKo_Pj8zssaCgAGAzTWDgihASkqCBN2WxxycRtdMgECPTzZKj9FEV6uPkiRkZX9867ppfEBGmEKHgIWBy7jTyRGgAiGGZjNTq-ciwWBhsEF-JkBouVSABIY-fzOy-VaX7ZWNTiIQsezcV6XzlU3ln__GgYADjcWDiUqBlRhHVsbFjIBAz340Cg_RWXZ5T5I6dWk5-rnxOxHGnYKIwIWCTou5O1EgAi26wnF3wPsqx6jj4YBipfXBJmRkAdatxEAEiQ3ln__Yu3CPAOehL7yIs0OSkPh8DVRuuM0Wj05QsVICQv2zSYaCgBdFyUmxQUACgYqCVQGXx1gX3UZcz1l2eU-RYhNqj5I3P3KlNCcm4AaIhd1eUo0Wjh2NEI3eXZ2T01Qb3JLWW9RdxAFGk8KTQoYCg0KAggBEQAAAAAAgGZAEajGSzc5TsVAEhIIABADEAYQExASGAJCBBoCCAUiGwoXdXlKNFo3eWtCYnl2dk9NUG9yS1lvUXdwASgBIhUAAIGZFn9e7Rx2hUhTJ87pkdLlFYEaGAoKDUDfBBoVz1C10BIKDSzdBBoVoFK10A"
                }
            ],
            "deliveries": [
                6,
                2
            ]
        },
        {
            "routes": [
                {
                    "distanceMeters": 59275,
                    "duration": "10026s",
                    "polyline": {
                        "encodedPolyline": "i|liGxpgcNUw@HMOq@m@h@]RtK|]wHzF}AbAmAfAEPkB|AmBxBeIpJ{@fAeCjCmBxAyBjA{Aj@aCh@}MdCs\\vG}MlCuBn@uBdAmBtAyKvJuB|AwBhAyB|@eCn@kI`BaEh@wCTuMn@cB?aBOkBe@eC}@M[]UUe@Ki@Cg@Do@Pg@`@e@b@Sl@@\\N\\`@Rr@Bf@Cl@u@xFAv@Fx@Lt@b@|@l@p@n@`@jDzAv@l@`AlAfJjP|AlCDNx@xAHz@A`@I`@Ub@ULe@D[KOMOWQy@UmB@k@Na@n@_ABUn@u@tFeIrAyAxAkAfBcA|LaF`BaA|AsAbAiAdGwIVEXQj@?RNP`@Fj@?VSfAaGxVKz@CdA@dFGbAMv@_@fA_AlB]`AYpAQxAs@xQKfCQ~B?~CYxFB~PGbDaAlXIvCW~BU|AYx@i@x@i@h@w@\\_Ez@SRK`@?l@FbAz@`GbCbRN`@gA~BMj@GbABbA`AfIV~AdA|J@t@CrESnBYbAwEjIk@v@QJoC|@OQ@l@P|ABF_EhFe@dAYpAG|@B`@j@jDbDxQNpARGSFFdB?jPJjHFxBee@~MwJxCc[lJ_AXmJpCyn@nRqK|ClClSn@vEnArK`BjM`@jD_AVqC|BsAt@wEpBiV~HsD`BcZxPcElBwDrAm[`JkZrIwWpHg@EmD`@eCVa@JcBLs@Eg@Mk@]gDmDy@k@{@[q@Iw@Bw@Rm@Xk@f@q@dAYh@W`AQrAEvAF~AXvBf@tB\\dA^x@DVfB`EnA`DVv@DXpBnH\\XhBhH\\nBnEx\\|@bGpH|k@jBdMbZjnBhAzId@bFNzCAn@FvNL|CR~Cd@tDlAdGdBnIh@jDb@zE|Bx^xAdWbCld@fAdUXxGN`CJxAz@|HlCnRJlAr@dFG`@l@rFFdBGrAoAzHEvADjANxAkBf@KIc@HsE~AWQIY?StDiOZoBRkCBcBEcCO_CyLm|@Ei@_BoK]eCI]WgBU{AGKYqB`Bk@X[|CuFPs@Dg@Ew@cD}T{BePvZmF\\W|GiANDjDq@tAYzB[RgHNeB`@aCn@iCz@_Ch@sA@[xT}`@vA{B|AuBjGmHbAaBt@_BtFmN`AaBt@{@jA_An@_@`A]p@Q|KkAxBWjCk@lBm@~CwAhKcGvLcHzBeAfDcAbK_CvG_CfEkBvNgHND^kCVwAj@uBj@{A~@aBhDkEj@q@jKcK|@aAjNyRhAoAtAaAtB_AhC}@x@i@p@s@l@eAz@yB\\c@j@YhA]PCPWdKkDpjAg_@?|@tB`PuBaP?}@lNqEf_@kLpIsAzA_@ft@_UlCeAzDeAHADQVg@Ru@t@mHRi@zBqTHaBAeBKsCDqAPaA|CqJh@mBjAiFhA{DdGoQdAuBjCiD`@}@h@_B`@}Ad@eCZwCR{Bf@sIVoCV}B@sBCq@KTs@`@i@Lk@Ac@S[]Ug@Uw@OIsYa_Be@{DUoDIsDCiMG_E_@cJu@qPEgD@{DVcN?yCMoEiH_w@]eCFc@oA_Oc@aC_AoDs@yCGQMEo@gG_HnBiOzEk@`@KNSQg@Lya@lMYyBoBn@nBo@i@{DeAiIY|AS\\IDuEjAwA`@w@V{Cz@uBn@qA`@kBf@]J_@iD[sB{@oGpNqExPoFpDgAhA_@_@aDsB}O~J_Dr@tFBP`Cu@~AvLdJuCTBxIuCdGoBPGNQzCgBv@xCrC}Ah@_@LM^UVZNf@dA}@nAeBpAuBrIeMfHwLzJsS`GwO~AqGzAkJrAoLT}@K{A@I`BMx@YnCoBwCtB}@T]B{@nCGZyAnMuAjI_BpGaGvO{JrSgHvLsIdMqAtBoAdBeA|@Og@W[a@TKL_Al@}BnAcAuDiA{E{CsL_BeGcAwEuLef@k@uB[g@a@WeE}AgAoEeCiKSeAUgAOuBAcB@[Lc@Ra@rAsBTk@H]Hm@BaAGgAMy@wBwG[aBGcAw@oCiBwFwBeG}BaH_AqCcCyIOm@oDkLl@i@Np@ILTv@"
                    },
                    "routeToken": "CvwICo8IMowIGqcBCjUCFg9e6J84RYAI3RHqBfgPxr4gz5jtAsCqzAPqyA6loQ7ImTmbjbUFiM-qAbypKuoS-tsgABIwCvbNJkPFSAnBLYFtIJ74myzeYuI7DZ7liG6VK7t604V2QJCoC4_xedmSkVa9BijiGhQABgM0eLwC_____w_vAsIBjQEAYCoME3ZbHA8BABwJc3ZVMgMCAgU9PNkqP0UYJEY-SLqumr3U-MvemwEatAEKOgIWD17xzYjvKgi3AfbOCs-7jwKo6pEC4coss9iRA8zGkAO10wTy7g_29a0W1Zi6FvHFCM8yzYOsAQASPLwGKOISRUVB5Bve5R8vlcM6Mu6jMpuumngClriVMg6FXSSOsky3LtXWVDXfPRpQZaVYppRiJtWntsVnBxoTAAUNGQYBC_____8PJyczGgMCRCoPc2gZWx0BAwBnbgEVdg51Pfp2Tj9FV-IEP0jxhvGMmc3YpR0aewomAhYJOrfVa-wqCMVTzZMi9uM0u5wWmIuZBtOMmQaYpKcD-6yuAwASJLbFZwde4s9Z2MfFw2aEsiSnrdYlH9uK5pgQ4ADBrTrPFaCS9RoLABB_CAHQAQOEAQAqCRgcGWAAEGoodz1X4gQ_RWhuRj9Ihbnr-oWxmYyjARp_CigCFgpAglET7yoIvaYIlOiwBreWuAabEYm_6QXKhcgF99E8kPEdkigAEiQUoJL1sassExzUEWJ4JJY9__CG_qo4OgtVKLLp6V3HdMqAviQaCgAH7gMJAXgoHBgqCRgdaE0CAV0dbzIBCD1gRmY-RQAAgD9Irbru7snmqNzhARpmCh4CFgg0QjW77yoI3AOxAc3oAtOvDoDiB42LCLKWBgASGMuAviTPojgS0x1YiUU9yT7jD6ZQP0TnFhoKAAgQFSX_____DyoGNl5IIBoAMgIAAz0AAAAARU1y8z5I8oDyvrrrjMEnGlUKFwIWBSKFURBFgAicmQflgRLyiAybiQMAEhQ_ROcWlXR0F2lD_nQffAM8Z8Q80hoJAA0KE_____8PKgU2Wx0ddz1NcvM-RSQiXz9I_f3w87KmytoQGmsKHwIWCDQc_BFFgAiGAtKSA8zVDYODGNCnONHjBr_SKQASIGfEPNJRJtRdeLZu6BOxNKexgFSdX3YBZ8sQZeO8suWbGggABFAQBzAZAioIVHFkG111E3c9JCJfP0VcVTw_SOW78sbct6j_eBpmCh8CFgcu3GBhRYAIm8UBq460AYCIqwTswgq2w7YBtxEAEhy9suWb9xsk1_zFpealzuUbNFo9OULFSAkL9s0mGgcABmklYwoGKgdvbiYCGRlzPUhVhz5FiE2qPkjZ14f46Z_439ABIhd1eUo0Wjk2cUhMbTk2clFQMHZfbTJBdxAFGk8KTQoYCg0KAggBEQAAAAAAgGZAEQRWDi3iUtxAEhIIABADEAYQExASGAJCBBoCCAUiGwoXdXlKNFo1eUhHcm05NnJRUDB2X20yQXdwASgBIhUAAIGZFvxBlr2aofltIiL4n9_zZY4aGAoKDUDfBBoVz1C10BIKDSzdBBoVoFK10A"
                }
            ],
            "deliveries": [
                1,
                5,
                7,
                8,
                3,
                0,
                4
            ]
        }
    ]
}
        return Response(tempdata, status=status.HTTP_200_OK)

        depot = request.data.get("depot")
        deliveries = request.data.get("deliveries")
        numVehicles = int(request.data.get("numVehicles"))

        depotCoordinates = (depot["navigation_points"][0]["location"]["latitude"], depot["navigation_points"][0]["location"]["longitude"])

        deliveriesCoordinates = []
        demand = []
        for delivery in deliveries:
            deliveriesCoordinates.append((delivery["navigation_points"][0]["location"]["latitude"], delivery["navigation_points"][0]["location"]["longitude"]))
            demand.append(delivery["demand"])

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
            # route = route.astype(int) # reinstate with the quantum results
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


        api_url = "https://routes.googleapis.com/directions/v2:computeRoutes"
        api_headers = {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": os.getenv('GOOGLEMAPS_API_KEY'),
            "X-Goog-FieldMask": "routes.routeToken,routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline"
        }

        googleRoutes = []
        for i in range(len(deliveriesRouteData)):
            api_data = {
                "origin": depotRouteData,
                "destination": depotRouteData,
                #todo multiple requests for each quantum route, then combine the results. deliveresRouteData[0] is the first quantum route
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