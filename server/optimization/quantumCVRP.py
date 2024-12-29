from dwave.system import LeapHybridNLSampler
from dwave.optimization.generators import capacitated_vehicle_routing
from dotenv import load_dotenv
import os

load_dotenv()

def quantumCVRP(demand, depot, deliveries, numVehicles=1, vehicleCapacity=200):
    demand = [0] + demand
    deliveries = [depot] + deliveries
    model = capacitated_vehicle_routing(
        demand=demand,
        number_of_vehicles=numVehicles,
        vehicle_capacity=vehicleCapacity,
        locations_x=[x for x,y in deliveries],
        locations_y=[y for x,y in deliveries])
    
    sampler = LeapHybridNLSampler(token=os.getenv('DWAVELEAP_TOKEN')) 
    sampler.sample( 
        model, 
        time_limit=10)
    
    num_samples = model.states.size()
    route, = model.iter_decisions()                     

    min_index = 0
    for i in range(num_samples):
        objectiveValue = model.objective.state(i)
        feasible = all(sym.state(i) for sym in model.iter_constraints())
        if feasible and objectiveValue < model.objective.state(min_index):
            min_index = i

    routes = list(route.iter_successors())

    optimalRoutes = []
    for r in routes:
        optimalRoutes.append(r.state(min_index))
    
    return optimalRoutes
    

# demandGoogle = [0, 10, 20, 20, 40, 10, 50, 10, 5, 5]
# sitesGoogle= [
#     (43.65107, -79.347015),  # Depot (Toronto)
#     (43.648883, -79.375395),  # Location 1
#     (43.676618, -79.410064),  # Location 2
#     (49.689533, -79.298968),  # Location 3
#     (43.654425, -79.380749),  # Location 4
#     (43.629310, -69.352850),  # Location 5
#     (43.718403, -79.518892),  # Location 6
#     (23.729432, -79.265549),  # Location 7
#     (43.657217, -79.463760),  # Location 8
#     (43.652607, -79.384223),  # Location 9
# ]

# model = capacitated_vehicle_routing(
#     demand=demandGoogle,
#     number_of_vehicles=2,
#     vehicle_capacity=200,
#     locations_x=[x for x,y in sitesGoogle],
#     locations_y=[y for x,y in sitesGoogle])

# sampler = LeapHybridNLSampler(token=os.getenv('DWAVELEAP_TOKEN')) 
# results = sampler.sample( 
#     model, 
#     time_limit=10)

# num_samples = model.states.size()
# route, = model.iter_decisions()                     

# min_index = 0
# for i in range(num_samples):
#     objectiveValue = model.objective.state(i)
#     feasible = all(sym.state(i) for sym in model.iter_constraints())
#     if feasible and objectiveValue < model.objective.state(min_index):
#         min_index = i

# routes = list(route.iter_successors())
# print(f"Objective value {int(model.objective.state(min_index))} for")
# for j, r in enumerate(routes):
#     print(f"\t Route {j+1}: {r.state(min_index)}", end="")
# print(f"\n\t Feasible: {all(sym.state(min_index) for sym in model.iter_constraints())}")