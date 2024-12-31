from dwave.system import LeapHybridNLSampler
from dwave.optimization.generators import capacitated_vehicle_routing
from dotenv import load_dotenv
import os

load_dotenv()

def quantumCVRP(demand, depot, deliveries, numVehicles=1, vehicleCapacity=150):
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