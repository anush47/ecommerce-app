import React, { useState } from "react";
import axios from "axios";

const baseUrl = "http://127.0.0.1:5000";

const TopSellingProduct = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [topSelling, setTopSelling] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    axios
      .post(`${baseUrl}/api/reports/top-selling`, {
        start_date: startDate,
        end_date: endDate,
      })
      .then((response) => {
        setTopSelling(response.data);
      })
      .catch((error) => {
        alert("Something went wrong!");
        console.error(error);
      });
  };

  return (
    <div style={{ padding: "30px" }}>
      <p style={{ fontSize: "30pt", fontWeight: "600", marginBottom: "20px" }}>
        Top Selling Products
      </p>
      <form onSubmit={handleSubmit}>
        <div
          style={{
            display: "flex",
            width: "40%",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label
              style={{ fontSize: "16pt", marginBottom: "10px" }}
              htmlFor="start-select"
            >
              Start Date:
            </label>
            <input
              id="start-select"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label
              style={{ fontSize: "16pt", marginBottom: "10px" }}
              htmlFor="end-select"
            >
              End Date:
            </label>
            <input
              id="end-select"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
        <button
          style={{
            height: "40px",
            width: "250px",
            backgroundColor: "var(--main-blue)",
            color: "white",
            fontSize: "14pt",
            border: "none",
            borderRadius: "5px",
            marginTop: "20px",
          }}
          type="submit"
        >
          Get Top Selling Product
        </button>
      </form>
      {topSelling && (
        <div>
          <h2>Results:</h2>
          <p>Product ID: {topSelling.product_id}</p>
          <p>Title: {topSelling.title}</p>
          <p>Total Sales: {topSelling.total_sales}</p>
        </div>
      )}
    </div>
  );
};

export default TopSellingProduct;
