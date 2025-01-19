import "../styles/CSVUpload.css";
import { useState } from "react";
import Papa from "papaparse";
import PropTypes from "prop-types";

function CSVUpload({ setDeliveries, geocodeDeliveryAddress }) {
  const [fileSelected, setFileSelected] = useState(false);

  function handleUpload(e) {
    e.preventDefault();
    const file = e.target.file.files[0];

    if (!file) return;

    if (file.type !== "text/csv") {
      alert("File must be a CSV file");
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        let error = [];

        const rows = results.data;

        for (const [index, row] of rows.entries()) {
          try {
            const result = await geocodeDeliveryAddress(
              row["streetnumber"],
              row["streetname"],
              row["postalcode"],
              row["city"],
              row["province"],
              row["demand"]
            );
            setDeliveries((prev) => [...prev, result]);
          } catch (err) {
            error.push(index);
          }
        }

        if (error.length > 0) {
          alert(`Unable to add lines:\n${error.join(", ")}`);
        }
      },
      error: (err) => {
        alert(err.message);
      },
    });
  }

  return (
    <form className="CSVUpload-form" onSubmit={handleUpload}>
      <button className="btn btn-primary" disabled={!fileSelected}>
        Upload Deliveries
      </button>
      <input
        type="file"
        name="file"
        accept=".csv"
        onChange={() => setFileSelected(true)}
      />
    </form>
  );
}

CSVUpload.propTypes = {
  setDeliveries: PropTypes.func.isRequired,
  geocodeDeliveryAddress: PropTypes.func.isRequired,
};

export default CSVUpload;
