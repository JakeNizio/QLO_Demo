import Modal from "react-modal";
import RouteMap from "../components/RouteMap";
import { useState } from "react";
import {
  useOptimizeRoutesMutation,
  useGeocodeAddressMutation,
} from "./managersApiSlice";
import {
  depot as testDepot,
  deliveries as testDeliveries,
} from "./testData.js";

Modal.setAppElement("#root");

function CreateRoutes() {
  const [
    optimizeRoutes,
    {
      data: optimizeRoutesData,
      error: optimizeRoutesError,
      isLoading: optimizeRoutesIsLoading,
    },
  ] = useOptimizeRoutesMutation();
  const [
    geocodeAddress,
    {
      data: geocodeAddressData,
      error: geocodeAddressError,
      isLoading: geocodeAddressIsLoading,
    },
  ] = useGeocodeAddressMutation();

  const [deliveries, setDeliveries] = useState(testDeliveries);
  const [numVehicles, setNumVehicles] = useState(2);
  const [depot, setDepot] = useState(testDepot);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  function setModalOpen() {
    setModalIsOpen(true);
  }

  function setModalClose() {
    setModalIsOpen(false);
  }

  async function handleAddDelivery(e) {
    e.preventDefault();
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
    if (!streetname || !/^[a-zA-Z\s\-]+$/.test(streetname)) {
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

    try {
      const response = await geocodeAddress({ address });
      const result = response.data.results[0];
      console.log(result);
      setDeliveries([...deliveries, result]);
    } catch (error) {
      console.error(error);
    }
    setModalClose();
  }

  function handleNumVehiclesChange(e) {
    setNumVehicles(e.target.value);
  }

  function handleDepotChange(e) {
    setDepot(e.target.value);
  }

  async function handleOptimization(e) {
    e.preventDefault();
    try {
      const demand = Array.from({ length: deliveries.length }, () => 1);
      const response = await optimizeRoutes({
        depot,
        deliveries,
        numVehicles,
        demand,
      });
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <div>
        <h1>Create Routes</h1>
        <h2>Deliveries</h2>
        <ul>
          {deliveries.map((delivery, index) => (
            <li key={index}>
              {delivery.formatted_address}
              <button
                onClick={() =>
                  setDeliveries(deliveries.filter((_, i) => i !== index))
                }
              >
                x
              </button>
            </li>
          ))}
        </ul>
        <button onClick={setModalOpen}>Add Delivery</button>
        <br />
        <form onSubmit={handleOptimization}>
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
            disabled
            value={depot.formatted_address}
            onChange={handleDepotChange}
          />
          <button>Optimize Routes</button>
        </form>
        {optimizeRoutesIsLoading && <p>Loading...</p>}
        {optimizeRoutesData && (
          <RouteMap
            route={optimizeRoutesData}
            deliveries={testDeliveries}
            depot={testDepot}
          />
        )}
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={setModalClose}
        contentLabel="Add Delivery"
      >
        <h2>Add Delivery</h2>
        <form onSubmit={handleAddDelivery}>
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
          <button>Add</button>
        </form>
      </Modal>
    </>
  );
}

export default CreateRoutes;
