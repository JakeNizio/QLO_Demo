import json

# Read the JSON file
file_path = 'new_route_data.json'  # Replace with the path to your JSON file

# Load the JSON data from the file
with open(file_path, 'r') as file:
    data = json.load(file)

# Parse and process each route
for route_id, route_details in data.items():
    print(f"Route ID: {route_id}")
    print(f"  Station Code: {route_details['station_code']}")
    print(f"  Date: {route_details['date_YYYY_MM_DD']}")
    print(f"  Departure Time (UTC): {route_details['departure_time_utc']}")
    print(f"  Executor Capacity (cm³): {route_details['executor_capacity_cm3']}")

    # Access and process stops
    stops = route_details.get('stops', {})
    for stop_id, stop_info in stops.items():
        print(f"    Stop ID: {stop_id}")
        print(f"      Latitude: {stop_info['lat']}")
        print(f"      Longitude: {stop_info['lng']}")
        print(f"      Type: {stop_info['type']}")
        print(f"      Zone ID: {stop_info.get('zone_id', 'N/A')}")

# Create a new dictionary to store routes with stop names only
routes_with_stop_names = {}

# Parse and process each route again to create the new dictionary
for route_id, route_details in data.items():
    stop_names = list(route_details.get('stops', {}).keys())
    routes_with_stop_names[route_id] = {
        "station_code": route_details['station_code'],
        "date_YYYY_MM_DD": route_details['date_YYYY_MM_DD'],
        "departure_time_utc": route_details['departure_time_utc'],
        "executor_capacity_cm3": route_details['executor_capacity_cm3'],
        "stops": stop_names
    }

# Print the new dictionary
print(json.dumps(routes_with_stop_names, indent=4))

# Example: You can save this new dictionary to a file if needed
with open('filtered_routes.json', 'w') as output_file:
     json.dump(routes_with_stop_names, output_file, indent=4)
