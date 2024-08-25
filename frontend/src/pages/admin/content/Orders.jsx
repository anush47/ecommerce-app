import React, { useState, useEffect } from "react";
import axios from "axios";
import { TableCell, TableRow, TableHead } from "../tables/TableComponents";

const baseUrl = "http://127.0.0.1:5000";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);

  useEffect(() => {
    axios
      .get(`${baseUrl}/api/orders`)
      .then((response) => {
        setOrders(response.data);
      })
      .catch((error) => {
        alert("Something went wrong!");
        console.error(error);
      });
  }, []);

  useEffect(() => {
    if (selectedOrder) {
      axios
        .get(`${baseUrl}/api/order-items/${selectedOrder}`)
        .then((response) => {
          setOrderItems(response.data);
        })
        .catch((error) => {
          alert("Something went wrong fetching items!");
          console.error(error);
        });
    }
  }, [selectedOrder]);
  return (
    <div style={{ display: "flex", flexDirection: "column", padding: "30px" }}>
      <p style={{ fontSize: "30pt", fontWeight: "600", marginBottom: "20px" }}>
        Orders
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gridColumn: "1/2",
          }}
        >
          <p
            style={{
              fontSize: "20pt",
              fontWeight: "600",
              marginBottom: "20px",
            }}
          >
            Select an Order
          </p>
          <TableHead>
            <TableCell fontColor="white" width="calc(100%/5)" fontSize="16pt">
              Order ID
            </TableCell>
            <TableCell fontColor="white" width="calc(100%/5)" fontSize="16pt">
              Customer Name
            </TableCell>
            <TableCell fontColor="white" width="calc(100%/5)" fontSize="16pt">
              Customer Phone No.
            </TableCell>
            <TableCell fontColor="white" width="calc(100%/5)" fontSize="16pt">
              Total Amount
            </TableCell>
            <TableCell fontColor="white" width="calc(100%/5)" fontSize="16pt">
              Estimate Delivery
            </TableCell>
          </TableHead>
          {orders &&
            orders.map((order, index) => {
              return (
                <TableRow
                  key={index}
                  backgroundColor={index % 2 === 0 ? "#e7f0f9" : "#a5c5ea"}
                  onClick={() => {
                    setSelectedOrder(order.order_id);
                  }}
                >
                  <TableCell
                    fontColor="black"
                    width="calc(100%/5)"
                    fontSize="14pt"
                  >
                    {order.order_id}
                  </TableCell>
                  <TableCell
                    fontColor="black"
                    width="calc(100%/5)"
                    fontSize="14pt"
                  >
                    {order.name}
                  </TableCell>
                  <TableCell
                    fontColor="black"
                    width="calc(100%/5)"
                    fontSize="14pt"
                  >
                    {order.phone_no}
                  </TableCell>
                  <TableCell
                    fontColor="black"
                    width="calc(100%/5)"
                    fontSize="14pt"
                  >
                    {order.total_amount}
                  </TableCell>
                  <TableCell
                    fontColor="black"
                    width="calc(100%/5)"
                    fontSize="14pt"
                  >
                    {order.delivery_estimate}
                  </TableCell>
                </TableRow>
              );
            })}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gridColumn: "2/3",
            padding: "0 0 0 20px",
            overflowY: "scroll",
          }}
        >
          <p
            style={{
              fontSize: "20pt",
              fontWeight: "600",
              marginBottom: "20px",
            }}
          >
            Order Items
          </p>
          {orderItems &&
            orderItems.map((item, index) => {
              return (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    flexDirection : 'column',
                    justifyContent : 'space-evenly',
                    padding : '5px',
                    widht: "95%",
                    height: "100px",
                    borderRadius: "5px",
                    boxShadow: "0 4px 8px rgba(38, 50, 40, 0.2)",
                    marginBottom : '10px'
                  }}
                >
                    <p>{'Product Id : '+item.product_id}</p>
                    <p>{'Name : '+item.title}</p>
                    <p>{'Variant Id : '+item.variant_id}</p>
                    <p>{'Variant Desc. : '+item.details}</p>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default Orders;
