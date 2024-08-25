import React, { useState, useEffect } from "react";
import { TableCell, TableRow, TableHead } from "../tables/TableComponents";
import axios from "axios";

const baseUrl = "http://127.0.0.1:5000";

function Customers() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    axios
      .get(`${baseUrl}/api/customers`)
      .then((response) => {
        setCustomers(response.data);
      })
      .catch((error) => {
        alert("Something went wrong!");
        console.error(error);
      });
  }, []);
  return (
    <div style={{ display: "flex", flexDirection: "column", padding: "30px" }}>
      <p style={{ fontSize: "30pt", fontWeight: "600", marginBottom: "20px" }}>
        Customers
      </p>
      <TableHead>
        <TableCell fontColor="white" width="calc(100%/5)" fontSize="16pt">
          ID
        </TableCell>
        <TableCell fontColor="white" width="calc(100%/5)" fontSize="16pt">
          Name
        </TableCell>
        <TableCell fontColor="white" width="calc(100%/5)" fontSize="16pt">
          Email
        </TableCell>
        <TableCell fontColor="white" width="calc(100%/5)" fontSize="16pt">
          Phone
        </TableCell>
        <TableCell fontColor="white" width="calc(100%/5)" fontSize="16pt">
          City
        </TableCell>
      </TableHead>
      {customers &&
        customers.map((customer, index) => {
          return (
            <TableRow key={index} backgroundColor={index % 2 === 0 ? "#e7f0f9" : "#a5c5ea"}>
              <TableCell fontColor="black" width="calc(100%/5)" fontSize="14pt">
                {customer.customer_id}
              </TableCell>
              <TableCell fontColor="black" width="calc(100%/5)" fontSize="14pt">
              {customer.name}
              </TableCell>
              <TableCell fontColor="black" width="calc(100%/5)" fontSize="14pt">
              {customer.email}
              </TableCell>
              <TableCell fontColor="black" width="calc(100%/5)" fontSize="14pt">
              {customer.phone_no}
              </TableCell>
              <TableCell fontColor="black" width="calc(100%/5)" fontSize="14pt">
              {customer.city}
              </TableCell>
            </TableRow>
          );
        })}
    </div>
  );
}

export default Customers;
