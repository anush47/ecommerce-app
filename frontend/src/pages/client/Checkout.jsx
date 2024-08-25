import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";
import { Navbar, NavItem } from "../../components/Navbar";
import { ReactComponent as MenuIcon } from "../../icons/new/menus.svg";
import { ReactComponent as UserIcon } from "../../icons/new/user.svg";
import { ReactComponent as LogoIcon } from "../../icons/new/logo.svg";
import axios from "axios";
import ActionButton from "../../components/ActionButton";

const baseURL = "http://127.0.0.1:5000";

function Checkout() {
  const [items, setItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [deliveryEstimate, setDeliveryEstimate] = useState(0);

  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");

  const [deliveryMethod, setDeliveryMethod] = useState("Deliver to Doorstep");
  const [courierService, setCourierService] = useState("");
  const [isCourierSelectable, setIsCourierSelectable] = useState(true);

  const navigate = useNavigate();

  const handleSelectChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  useEffect(() => {
    let cart_id = localStorage.getItem("tz-cart-id");
    axios
      .post(`${baseURL}/api/cart-items`, { cartId: cart_id })
      .then((response) => {
        console.log(response.data);
        setItems(response.data.items);
        setTotalAmount(response.data.totalAmount);
        setDeliveryEstimate(response.data.deliveryEstimate);
      })
      .catch((error) => {
        if (error.response) {
          const status = error.response.status;
          switch (status) {
            case 500:
              alert("Something went wrong.");
              break;
            default:
              alert("An unknown error occurred.");
              break;
          }
        } else if (error.request) {
          console.log(error.request);
          alert("The server did not respond. Please try again later.");
        } else {
          console.log("Error", error.message);
          alert("An error occurred while sending the request.");
        }
        console.log(error.config);
      });
  }, []);

  useEffect(() => {
    setIsCourierSelectable(deliveryMethod === "Deliver to Doorstep");
    if (deliveryMethod !== "Deliver to Doorstep") {
      setCourierService("");
    }
  }, [deliveryMethod]);

  const handleDeliveryChange = (event) => {
    setDeliveryMethod(event.target.value);
  };

  const handleCourierChange = (event) => {
    setCourierService(event.target.value);
  };

  async function placeOrder(orderData) {
    try {
      const response = await axios.post(`${baseURL}/api/insert-order`, {
        customer_id: parseInt(localStorage.getItem('tz-user-id')),
        total_amount: totalAmount,
        delivery_method: deliveryMethod,
        payment_method: paymentMethod,
        order_date: new Date().toISOString().split('T')[0],
        delivery_estimate: deliveryEstimate,
        cart_id: parseInt(localStorage.getItem("tz-cart-id"))
      });
      console.log('Order placed successfully:', response.data);
      navigate('/');
    } catch (error) {
      console.error('Error placing the order:', error.response ? error.response.data : error.message);
      throw error;
    }
  }

  return (
    <>
      <Navbar>
        <div className="logo-container">
          <LogoIcon className="nav-bar-logo-icon" />
        </div>
        <div className="nav-bar-route-container">
          <NavItem>
            <MenuIcon />
          </NavItem>
          <NavItem>
            <UserIcon />
          </NavItem>
        </div>
      </Navbar>
      <div
        style={{
          padding: "6vh 15vw 0 15vw",
          display: "flex",
          flexDirection: "column",
          height: "92.9vh",
        }}
      >
        <p
          style={{
            color: "#263228",
            fontSize: "30pt",
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: "500",
            marginBottom: "30px",
          }}
        >
          Your Cart
        </p>
        <div style={{ display: "grid", gridTemplateRows: "1fr 4fr" }}>
          <div style={{ gridRow: "1/2" }}>
            <hr style={{ width: "100%" }} />
          </div>
          <div
            style={{
              gridRow: "2/3",
              display: "grid",
              gridTemplateColumns: "3fr 2fr",
              gap: "30px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gridColumn: "1/2",
                overflowY: "scroll",
              }}
            >
              {items.map((item, index) => {
                return (
                  <CheckoutTile
                    key={index}
                    imageUrl={item.imageUrl}
                    title={item.title}
                    description={item.detailedDescription}
                    price={item.price}
                  />
                );
              })}
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateRows: "1fr, 1fr",
                gap: "20px",
                justifyItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gridRow: "1/2",
                  backgroundColor: "white",
                  width: "80%",
                  padding: "20px",
                  borderRadius: "5px",
                }}
              >
                <p>Total Amount : ${totalAmount}</p>
                <p>Choose payment method</p>
                <select
                  value={paymentMethod}
                  onChange={handleSelectChange}
                  className="select-box"
                >
                  <option value='Cash on Delivery'>Cash on Delivery</option>
                  <option value='Card'>Card Payment</option>
                </select>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gridRow: "2/3",
                  backgroundColor: "white",
                  width: "80%",
                  padding: "20px",
                  borderRadius: "5px",
                }}
              >
                <p>Choose delivery method</p>
                <select
                  value={deliveryMethod}
                  onChange={handleDeliveryChange}
                  className="select-box"
                >
                  <option value="Deliver to Doorstep">
                    Deliver to Doorstep
                  </option>
                  <option value="Store Pickup">Store Pickup</option>
                </select>

                <>
                  <p>Choose courier service</p>
                  <select
                    className="select-box"
                    value={courierService}
                    onChange={handleCourierChange}
                    disabled={!isCourierSelectable}
                  >
                    <option value="DHL">DHL</option>
                    <option value="Courier Service">Courier Service</option>
                  </select>
                </>

                <p>Estimated Delivery Time : {deliveryEstimate} days</p>
              </div>

              <ActionButton
                buttonText={"Complete Order"}
                onTap={async () => {
                  await placeOrder();
                }}
                fontSize={"14pt"}
                height="40px"
                width="200px"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function CheckoutTile(props) {
  return (
    <div className="checkout-tile-container">
      <div className="checkout-tile-img-cont">
        <img src={props.imageUrl} className="checkout-tile-img" alt="Loading" />
      </div>
      <div className="checkout-tile-detail-cont">
        <p>{props.title}</p>
        <p>{props.description}</p>
      </div>
      <div className="checkout-tile-price-cont">
        <p>${props.price}</p>
      </div>
      <div className="checkout-tile-close-btn-cont">
        <button>Close</button>
      </div>
    </div>
  );
}

export default Checkout;
