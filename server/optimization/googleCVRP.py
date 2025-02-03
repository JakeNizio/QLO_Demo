import googlemaps
from ortools.constraint_solver import pywrapcp, routing_enums_pb2
from dotenv import load_dotenv
import os

load_dotenv()

gmaps = googlemaps.Client(key=os.getenv('GOOGLEMAPS_API_KEY'))

def googleCVRP(demand, depot, deliveries, numVehicles=1, vehicleCapacity=150):

    demand = [0] + demand
    deliveries = [depot] + deliveries

    distance_matrix = []
    for origin in deliveries:
        response = gmaps.distance_matrix(origins=[origin], destinations=deliveries, mode="driving")
        distances = [row['distance']['value'] for row in response['rows'][0]['elements']]
        distance_matrix.append(distances)

    manager = pywrapcp.RoutingIndexManager(len(distance_matrix), numVehicles, 0)
    routing = pywrapcp.RoutingModel(manager)

    # Create and register a transit callback
    def distance_callback(from_index, to_index):
        from_node = manager.IndexToNode(from_index)
        to_node = manager.IndexToNode(to_index)
        return distance_matrix[from_node][to_node]

    transit_callback_index = routing.RegisterTransitCallback(distance_callback)

    # Define cost of travel
    routing.SetArcCostEvaluatorOfAllVehicles(transit_callback_index)

    # Add demand constraints (capacity constraint)
    def demand_callback(from_index):
        from_node = manager.IndexToNode(from_index)
        return demand[from_node]

    demand_callback_index = routing.RegisterUnaryTransitCallback(demand_callback)

    # Set capacity constraints (vehicle capacity)
    routing.AddDimensionWithVehicleCapacity(
        demand_callback_index,
        0,  # null capacity slack
        [vehicleCapacity] * numVehicles,  # Vehicle capacity
        True,  # Start cumul to zero
        "Capacity"
    )

    # Set search parameters
    search_params = pywrapcp.DefaultRoutingSearchParameters()
    search_params.first_solution_strategy = routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC

    # Solve the problem
    solution = routing.SolveWithParameters(search_params)

    optimalRoutes = []

    for vehicle_id in range(manager.GetNumberOfVehicles()):
        index = routing.Start(vehicle_id)
        route = []
        while not routing.IsEnd(index):
            node_index = manager.IndexToNode(index)
            route.append(node_index - 1)
            index = solution.Value(routing.NextVar(index))
        route.append(manager.IndexToNode(index))
        optimalRoutes.append(route[1:-1])

    return optimalRoutes