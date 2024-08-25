import React, { useState, useEffect } from "react";
import axios from "axios";
import { TableCell, TableRow, TableHead } from "../tables/TableComponents";

const baseUrl = "http://127.0.0.1:5000";

function PeakInterestPeriod() {
  const [peakPeriod, setPeakPeriod] = useState({});
  const [productId, setProductId] = useState("");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (productId) {
      axios
        .get(`${baseUrl}/api/reports/peak-interest-period/${productId}`)
        .then((response) => {
          setPeakPeriod(response.data);
        })
        .catch((error) => {
          console.error("Error fetching data: ", error);
          alert("Error fetching data");
        });
    }
  }, [productId]); // This will re-run when `productId` changes

  useEffect(() => {
    axios
      .get(`${baseUrl}/api/products`, { params: { categoryId: 0 } })
      .then((response) => {
        let data = [];
        for (let key in response.data) {
          data.push(response.data[key]);
        }
        setProducts(data);
      });
  }, []);

  return (
    <div style={{display:'flex', flexDirection : 'column', padding : '30px'}}>
      <p style={{ fontSize: "30pt", fontWeight: "600", marginBottom: "20px" }}>
        Peak Interested Periods
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gridColumn: "1/2",
            overflowY: "scroll",
          }}
        >
          <p style={{ fontSize: "20pt", marginBottom : '10px' }}>Select a Product</p>
          <TableHead>
            <TableCell fontColor="white" fontSize="16pt" width="calc(100%/2)">
              Product ID
            </TableCell>
            <TableCell fontColor="white" fontSize="16pt" width="calc(100%/2)">
              Product Name
            </TableCell>
          </TableHead>
          {products.map((product, index) => {
            return (
              <TableRow
                key={index}
                backgroundColor={index % 2 === 0 ? "#e7f0f9" : "#a5c5ea"}
                onClick={() => {
                  setProductId(product.product_id);
                }}
              >
                <TableCell fontSize="14pt" width="calc(100%/2)">
                  {product.product_id}
                </TableCell>
                <TableCell fontSize="14pt" width="calc(100%/2)">
                  {product.title}
                </TableCell>
              </TableRow>
            );
          })}
        </div>
        <div
          style={{ disply: "flex", flexDirection: "column", girdColumn: "2/3" }}
        >
          
            <div style={{padding : '0 0 0 20px'}}>
            <p style={{ fontSize: "20pt", marginBottom : '10px' }}>Peak Date & No. of Cart Appearences</p>
              <p style={{ fontSize: "18pt", marginBottom : '8px' }} >Peak Interest Period: {peakPeriod.time_period || "N/A"}</p>
              <p style={{ fontSize: "18pt", marginBottom : '8px' }}>Cart Appearances: {peakPeriod.cart_appearances || "0"}</p>
            </div>
          
        </div>
      </div>
    </div>
  );
}

export default PeakInterestPeriod;
