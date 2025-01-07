import "../styles/CreateRoutes.css";
import Modal from "react-modal";
import RouteMap from "../components/RouteMap";
import { useState } from "react";
import {
  useOptimizeRoutesMutation,
  useGeocodeAddressMutation,
} from "./managersApiSlice";

// Test data for the depot and deliveries
import {
  depot as testDepot,
  deliveries as testDeliveries,
} from "./testData.js";

Modal.setAppElement("#root"); // Set the modal root element to the root div

const addDeliveryStyles = {
  // Styles for the Add Delivery modal
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  content: {
    maxHeight: "90vh",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, 0)",
    scrollbarWidth: "thin",
  },
};

const viewRouteStyles = {
  // Styles for the View Route modal
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  content: {
    maxHeight: "90vh",
    maxWidth: "90vw",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, 0)",
    scrollbarWidth: "thin",
  },
};

function CreateRoutes() {
  // Use the optimizeRoutes and geocodeAddress mutations from the API slice
  const [
    optimizeRoutes,
    { data: optimizeRoutesData, isLoading: optimizeRoutesIsLoading },
  ] = useOptimizeRoutesMutation();
  const [geocodeAddress] = useGeocodeAddressMutation();

  // Initialize state variables
  const [deliveries, setDeliveries] = useState(testDeliveries); // Initialized with test data
  const [numVehicles, setNumVehicles] = useState(2);
  const [depot, setDepot] = useState(testDepot); // Initialized with test data
  const [modalAddDeliveryIsOpen, setModalAddDeliveryIsOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [modalViewRouteIsOpen, setModalViewRouteIsOpen] = useState(false);

  function setModalAddDeliveryOpen() {
    setModalAddDeliveryIsOpen(true);
  }

  function setModalAddDeliveryClose() {
    setModalAddDeliveryIsOpen(false);
  }

  function setModalViewRouteOpen(route) {
    setSelectedRoute(route);
    setModalViewRouteIsOpen(true);
  }

  function setModalViewRouteClose() {
    setSelectedRoute(null);
    setModalViewRouteIsOpen(false);
  }

  // Handle adding a delivery
  async function handleAddDelivery(e) {
    e.preventDefault();

    // Get form values
    const streetnumber = e.target.elements.streetnumber.value.trim();
    const streetname = e.target.elements.streetname.value.trim();
    const postalcode = e.target.elements.postalcode.value.trim();
    const city = e.target.elements.city.value.trim();
    const province = e.target.elements.province.value.trim();

    // Validation flags
    let errors = [];

    // Validate street number (numeric and not empty)
    if (!streetnumber || !/^\d+$/.test(streetnumber)) {
      errors.push("Street number must be a valid number.");
    }

    // Validate street name (letters, spaces, and hyphens allowed)
    if (!streetname || !/^[a-zA-Z\s-]+$/.test(streetname)) {
      errors.push("Street name must contain only letters, spaces, or hyphens.");
    }

    // Validate postal code (Canadian postal code format: A1A 1A1)
    if (!postalcode || !/^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/.test(postalcode)) {
      errors.push("Postal code must be in the format A1A 1A1.");
    }

    // Validate city (letters and spaces only)
    if (!city || !/^[a-zA-Z\s]+$/.test(city)) {
      errors.push("City must contain only letters and spaces.");
    }

    // Validate province (two-letter codes, e.g., ON, BC, etc.)
    const validProvinces = [
      "AB",
      "BC",
      "MB",
      "NB",
      "NL",
      "NS",
      "NT",
      "NU",
      "ON",
      "PE",
      "QC",
      "SK",
      "YT",
    ];
    if (!province || !validProvinces.includes(province.toUpperCase())) {
      errors.push("Province must be a valid two-letter code (e.g., ON, BC).");
    }

    // If validation errors exist, show alerts and return
    if (errors.length > 0) {
      alert(errors.join("\n"));
      return;
    }

    // Concatenate validated address
    let address = `${streetnumber} ${streetname}, ${city}, ${province}, ${postalcode}`;

    // Get geocode data for the address
    try {
      const response = await geocodeAddress({ address }); // Call the geocodeAddress mutation
      const result = response.data.results[0]; // Get the first result
      const demand = e.target.elements.demand.value; // Get the demand value from the form
      setDeliveries([...deliveries, { ...result, demand: demand }]); // Add the delivery to the list
    } catch (error) {
      console.error(error);
    }
    setModalAddDeliveryClose();
  }

  function handleNumVehiclesChange(e) {
    setNumVehicles(e.target.value);
  }

  function handleDepotChange(e) {
    setDepot(e.target.value);
  }

  // Handle optimization
  async function handleOptimization(e) {
    e.preventDefault();

    // Call the optimizeRoutes mutation
    try {
      await optimizeRoutes({
        depot,
        deliveries,
        numVehicles,
      });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <div className="page-frame">
        <h1>Create Routes</h1>
        <hr />
        {/* Deliveries Section */}
        <div className="page-section create-routes-deliveries">
          <h2>Deliveries</h2>
          {/* Map and display the added deliveries */}
          <ul>
            {deliveries.map((delivery, index) => (
              <li key={index}>
                {`${delivery.formatted_address} (Demand: ${delivery.demand})`}
                <button
                  onClick={() =>
                    setDeliveries(deliveries.filter((_, i) => i !== index))
                  }
                >
                  ✖
                </button>
              </li>
            ))}
          </ul>
          {/* Button to add open the new delivery modal */}
          <button className="btn btn-primary" onClick={setModalAddDeliveryOpen}>
            Add Delivery
          </button>
        </div>
        <hr />
        {/* Optimize Routes Section */}
        <div className="page-section create-routes-optimizations">
          <h2>Optimize Routes</h2>
          {/* Form to input the number of vehicles and depot */}
          <form className="form" onSubmit={handleOptimization}>
            <label htmlFor="numVehicles">Number of Vehicles:</label>
            <input
              type="number"
              id="numVehicles"
              min="1"
              max="5"
              required
              value={numVehicles}
              onChange={handleNumVehiclesChange}
            />
            <label htmlFor="depot">Depot:</label>
            <input
              type="text"
              id="depot"
              required
              disabled // Disabled the input field for now
              value={depot.formatted_address}
              onChange={handleDepotChange}
            />
            <button className="btn btn-primary">Optimize Routes</button>
          </form>
          {optimizeRoutesIsLoading && <p>Loading...</p>}
        </div>

        {/* Conditionally display optimization results if available */}
        {optimizeRoutesData && (
          <>
            <hr />
            {/* Results Section */}
            <div className="page-section create-routes-results">
              <h2>Results</h2>
              {/* Display each optimized route as a button which opens the route view */}
              <div className="create-routes-results-buttons">
                {optimizeRoutesData.map((route, index) => (
                  <button
                    key={index}
                    onClick={() => setModalViewRouteOpen(route)}
                  >
                    <b>Route {index + 1} |</b>
                    {` ${route.deliveries.length} stops | ${(
                      route.routes[0].distanceMeters / 1000
                    ).toFixed(1)} km | ${route.deliveries.reduce(
                      (acc, id) => acc + deliveries[id].demand,
                      0
                    )} demand`}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modals */}

      {/* Add delivery modal */}
      <Modal
        isOpen={modalAddDeliveryIsOpen}
        onRequestClose={setModalAddDeliveryClose}
        style={addDeliveryStyles}
        contentLabel="Add Delivery"
      >
        <button className="modal-close" onClick={setModalAddDeliveryClose}>
          ✖
        </button>
        <div className="page-frame">
          <h2>Add Delivery</h2>
          <hr />
          {/* Add delivery form */}
          <div className="page-section">
            <form
              className="form add-delivery-form"
              onSubmit={handleAddDelivery}
            >
              <label htmlFor="streetnumber">Street Number:</label>
              <input type="text" id="streetnumber" required />
              <label htmlFor="streetname">Street Name:</label>
              <input type="text" id="streetname" required />
              <label htmlFor="postalcode">Postal Code:</label>
              <input type="text" id="postalcode" required />
              <label htmlFor="city">City:</label>
              <input type="text" id="city" required />
              <label htmlFor="province">Province:</label>
              <select id="province" required>
                <option value="AB">AB</option>
                <option value="BC">BC</option>
                <option value="MB">MB</option>
                <option value="NB">NB</option>
                <option value="NL">NL</option>
                <option value="NS">NS</option>
                <option value="NT">NT</option>
                <option value="NU">NU</option>
                <option value="ON">ON</option>
                <option value="PE">PE</option>
                <option value="QC">QC</option>
                <option value="SK">SK</option>
                <option value="YT">YT</option>
              </select>
              <label htmlFor="demand">Demand:</label>
              <input type="number" id="demand" min="1" required />
              <button className="btn btn-primary">Add</button>
            </form>
          </div>
        </div>
      </Modal>

      {/* View route modal */}
      <Modal
        isOpen={modalViewRouteIsOpen}
        onRequestClose={setModalViewRouteClose}
        style={viewRouteStyles}
        contentLabel="View Route"
      >
        <button className="modal-close" onClick={setModalViewRouteClose}>
          ✖
        </button>
        <div className="page-frame">
          <h2>View Route</h2>
          <hr />
          {/* Route Map section */}
          <div className="page-section">
            {selectedRoute && (
              <div className="create-routes-view-route">
                <RouteMap
                  route={selectedRoute}
                  deliveries={selectedRoute.deliveries.map(
                    (id) => deliveries[id]
                  )}
                  depot={depot}
                />
              </div>
            )}
          </div>
          <hr />
          {/* Route details section */}
          <div className="page-section create-routes-view-route-details">
            <h2>Route Details</h2>
            {selectedRoute && (
              <div>
                <p>
                  <b>Number of Stops: </b>
                  {selectedRoute.deliveries.length}
                </p>
                <p>
                  <b>Estimated Distance: </b>
                  {(selectedRoute.routes[0].distanceMeters / 1000).toFixed(2)}
                  km
                </p>
                <p>
                  <b>Total Demand: </b>
                  {selectedRoute.deliveries.reduce(
                    (acc, id) => acc + deliveries[id].demand,
                    0
                  )}
                </p>
              </div>
            )}
          </div>
          <hr />
          {/* Deliveries section */}
          <div className="page-section create-routes-view-route-deliveries">
            <h2>Deliveries</h2>
            <ul>
              {selectedRoute &&
                selectedRoute.deliveries.map((id, index) => (
                  <li key={id}>
                    <b>Stop {index + 1}: </b>
                    {`${deliveries[id].formatted_address} (${deliveries[id].demand} demand)`}
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default CreateRoutes;
