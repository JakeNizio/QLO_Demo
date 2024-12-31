import { APIProvider, Map, useMap, Marker } from "@vis.gl/react-google-maps";
import { useRef, useEffect } from "react";

function RouteMap({ route, deliveries, depot }) {
  const PolylineComponent = () => {
    const map = useMap(); // Access the map instance
    const polylineRef = useRef(null);

    const generateGradient = (numPoints) => {
      // Generate a gradient array of colors based on the number of points
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

    useEffect(() => {
      // Check if Google Maps API is loaded
      if (map && window.google && window.google.maps) {
        // Decode the polyline path
        const path = window.google.maps.geometry.encoding.decodePath(
          route.routes[0].polyline.encodedPolyline
        );

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

        // // Create the polyline
        // polylineRef.current = new window.google.maps.Polyline({
        //   path,
        //   geodesic: true,
        //   strokeColor: "#FF0000",
        //   strokeOpacity: 1.0,
        //   strokeWeight: 4,
        // });

        // // Add polyline to the map
        // polylineRef.current.setMap(map);

        // Calculate and fit bounds to polyline
        const bounds = new window.google.maps.LatLngBounds();
        path.forEach((point) => bounds.extend(point)); // Extend bounds for each point
        map.fitBounds(bounds); // Fit map to bounds
      } else {
        console.error("Google Maps API is not loaded.");
      }

      // Cleanup polyline
      return () => {
        if (polylineRef.current) {
          polylineRef.current.setMap(null);
        }
      };
    }, [map]);

    return null; // No need to render anything
  };

  // Define a function to create markers
  const createMarkers = (locations, type) => {
    return locations.map((location, index) => {
      return (
        <Marker
          key={index}
          label={{
            text: type === "delivery" ? `${index + 1}` : "D",
            color: "white",
          }}
          position={{
            lat: location.navigation_points[0].location.latitude,
            lng: location.navigation_points[0].location.longitude,
          }}
        />
      );
    });
  };

  return (
    <APIProvider
      apiKey={import.meta.env.VITE_GOOGLEMAPS_API_KEY}
      libraries={["geometry"]}
    >
      <div style={{ height: "500px", width: "100%" }}>
        <Map
          id="map"
          defaultCenter={{ lat: 44.0356414, lng: -79.48604770000001 }}
          defaultZoom={12}
          options={{
            mapTypeControl: false, // Remove the map type (satellite, terrain, etc.)
            streetViewControl: false, // Remove the street view control
            fullscreenControl: false, // Optional: Remove fullscreen control
          }}
        >
          <PolylineComponent />
          {createMarkers(deliveries, "delivery")}
          {createMarkers([depot], "depot")}
        </Map>
      </div>
    </APIProvider>
  );
}

export default RouteMap;
