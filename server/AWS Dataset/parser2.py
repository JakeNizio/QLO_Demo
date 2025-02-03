import json
import csv

# Read the JSON file
file_path = 'actual_sequences.json'  # Replace with the path to your JSON file

# Load the JSON data from the file
with open(file_path, 'r') as file:
    json_data = json.load(file)

# # Initialize the reindexed data structure
# parsed_routes = {}

# # Loop through each route in the JSON
# for index, (route_id, route_data) in enumerate(json_data.items(), start=1):
#     # Extract stops with only lat and lng
#     stops = [{"lat": stop["lat"], "lng": stop["lng"]} for stop in route_data["stops"].values()]
    
#     # Add the route to the parsed_routes with reindexed route ID
#     parsed_routes[f"Route_{index}"] = stops

# # Print the parsed data
# print(json.dumps(parsed_routes, indent=4))

# Initialize the reindexed data structure
# parsed_routes = {}

# # Loop through each route in the JSON
# for index, (route_id, route_data) in enumerate(json_data.items(), start=1):
#     # Extract stops with initials, lat, and lng
#     stops = [
#         {"initial": stop_initial, "lat": stop["lat"], "lng": stop["lng"]}
#         for stop_initial, stop in route_data["stops"].items()
#     ]
    
#     # Add the route to the parsed_routes with reindexed route ID
#     parsed_routes[f"Route_{index}"] = stops

# # Print the parsed data
# print(json.dumps(parsed_routes, indent=4))


# Part 2 - Limit to processing only one route
# first_route_id, first_route_data = next(iter(json_data.items()))

# # Extract stops with initials, lat, and lng for the first route
# stops = [
#     {"initial": stop_initial, "lat": stop["lat"], "lng": stop["lng"]}
#     for stop_initial, stop in first_route_data["stops"].items()
# ]

# # Build the parsed result for one route
# parsed_route = {f"Route_1": stops}

# # Print the parsed data
# print(json.dumps(parsed_route, indent=4))


#Trial 3 - CSV writing to file
# File path for the CSV
# csv_file = "routes.csv"

# # Open the CSV file for writing
# with open(csv_file, mode='w', newline='') as file:
#     writer = csv.writer(file)
    
#     # Write the header row
#     writer.writerow(["Route ID", "Stop Initial", "Sequence Number"])
    
#     # Loop through each route and write the data
#     for route_id, route_data in json_data.items():
#         for stop_initial, sequence_number in route_data["actual"].items():
#             writer.writerow([route_id, stop_initial, sequence_number])

# print(f"Data has been written to {csv_file}")

#Trial 4 - make each route its own csv
for route_id, route_data in json_data.items():
    csv_file = f"{route_id}.csv"  # Name each file after the route

    # Open the CSV file for writing
    with open(csv_file, mode='w', newline='') as file:
        writer = csv.writer(file)

        # Write the header row
        writer.writerow(["Stop Initial", "Sequence Number"])

        # Write the stop data
        for stop_initial, sequence_number in route_data["actual"].items():
            writer.writerow([stop_initial, sequence_number])