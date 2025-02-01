import { APIProvider, Map, useMap, Marker } from "@vis.gl/react-google-maps";
import { useRef, useEffect } from "react";
import PropTypes from "prop-types";

function RouteMap({ route, deliveries, depot }) {
  // Define a component to render the route polyline
  const PolylineComponent = () => {
    const map = useMap(); // Access the map instance
    const polylineRef = useRef(null);

    // Generate a gradient array of colors based on the number of points
    const generateGradient = (numPoints) => {
      const colors = [];
      const startColor = [255, 193, 113];
      const endColor = [255, 97, 109];

      for (let i = 0; i < numPoints; i++) {
        const ratio = i / (numPoints - 1); // Calculate ratio for interpolation
        const color = [
          Math.round(startColor[0] * (1 - ratio) + endColor[0] * ratio),
          Math.round(startColor[1] * (1 - ratio) + endColor[1] * ratio),
          Math.round(startColor[2] * (1 - ratio) + endColor[2] * ratio),
        ];
        colors.push(`rgb(${color[0]}, ${color[1]}, ${color[2]})`);
      }
      return colors;
    };

    // create the route polyline
    useEffect(() => {
      // Check if Google Maps API is loaded
      if (map && window.google && window.google.maps) {
        // Decode the polyline path
        let path = [];
        for (let i = 0; i < route.routes.length; i++) {
          path = path.concat(
            window.google.maps.geometry.encoding.decodePath(
              route.routes[i].routes[0].polyline.encodedPolyline
            )
          );
        }

        // Generate gradient colors
        const colors = generateGradient(path.length);

        // Create polyline segments with varying colors
        for (let i = 0; i < path.length - 1; i++) {
          const segmentPath = [path[i], path[i + 1]]; // Two points for each segment
          const color = colors[i];

          // Create and add polyline for each segment
          const polyline = new window.google.maps.Polyline({
            path: segmentPath,
            geodesic: true,
            strokeColor: color,
            strokeOpacity: 1.0,
            strokeWeight: 4,
          });
          polyline.setMap(map);
        }

        // Calculate and fit bounds to polyline
        const bounds = new window.google.maps.LatLngBounds();
        path.forEach((point) => bounds.extend(point)); // Extend bounds for each point
        map.fitBounds(bounds); // Fit map to bounds
      } else {
        console.error("Google Maps API is not loaded.");
      }

      // Cleanup polyline
      const currentPolyline = polylineRef.current;
      return () => {
        if (currentPolyline) {
          currentPolyline.setMap(null);
        }
      };
    }, [map]);

    return null; // No need to render anything
  };

  // Define a function to create markers
  const createMarkers = (locations, type) => {
    // Create markers for each location
    return locations.map((location, index) => {
      return (
        <Marker
          key={index}
          // Set the label to the index of the delivery or "D" for depot
          label={{
            text: type === "delivery" ? `${index + 1}` : "D",
            color: "white",
          }}
          // Set the position to the first navigation point
          position={{
            lat: location.navigation_points[0].location.latitude,
            lng: location.navigation_points[0].location.longitude,
          }}
        />
      );
    });
  };

  return (
    // Wrap the map in an APIProvider with the Google Maps API key
    <APIProvider
      apiKey={import.meta.env.VITE_GOOGLEMAPS_API_KEY}
      libraries={["geometry"]}
    >
      <div style={{ height: "100%", width: "100%" }}>
        {/* Render the map */}
        <Map
          id="map"
          defaultCenter={{ lat: 44.0356414, lng: -79.48604770000001 }}
          defaultZoom={12}
          options={{
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
          }}
        >
          {/* Render the polyline component */}
          <PolylineComponent />
          {/* Render markers for deliveries and depot */}
          {createMarkers(deliveries, "delivery")}
          {createMarkers([depot], "depot")}
        </Map>
      </div>
    </APIProvider>
  );
}

// Define prop types for RouteMap component
RouteMap.propTypes = {
  route: PropTypes.object.isRequired,
  deliveries: PropTypes.array.isRequired,
  depot: PropTypes.object.isRequired,
};

export default RouteMap;
