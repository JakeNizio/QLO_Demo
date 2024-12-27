import Modal from "react-modal";
import { useState } from "react";
import {
  useOptimizeRoutesMutation,
  useGeocodeAddressMutation,
} from "./managersApiSlice";

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

  const [deliveries, setDeliveries] = useState([]);
  const [numVehicles, setNumVehicles] = useState(1);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  function setModalOpen() {
    setModalIsOpen(true);
  }

  function setModalClose() {
    setModalIsOpen(false);
  }

  async function handleAddDelivery(e) {
    e.preventDefault();
    const address = e.target.elements.address.value;
    // validate address and backend geocode it to coordinates to confirm it's a valid address
    try {
      const response = await geocodeAddress({ address });
      console.log(response);
      setDeliveries([...deliveries, address]);
    } catch (error) {
      console.error(error);
    }
    setModalClose();
  }

  function handleNumVehiclesChange(e) {
    setNumVehicles(e.target.value);
  }

  async function handleOptimization(e) {
    e.preventDefault();
    try {
      const response = await optimizeRoutes({ deliveries, numVehicles });
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
              {delivery}{" "}
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
          <button>Optimize Routes</button>
        </form>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={setModalClose}
        contentLabel="Add Delivery"
      >
        <h2>Add Delivery</h2>
        <form onSubmit={handleAddDelivery}>
          <label htmlFor="address">Address:</label>
          <input type="text" id="address" />
          <button>Add</button>
        </form>
      </Modal>
    </>
  );
}

export default CreateRoutes;
