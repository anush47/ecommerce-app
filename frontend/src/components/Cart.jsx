import "./Cart.css";
import React, { useState, useEffect } from "react";
import iphone from "../images/iphone.png";
import { ReactComponent as CloseIcon } from "../icons/close-icon.svg";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const baseURL = "http://127.0.0.1:5000";

const Cart = ({ open, handleClose, items }) => {
  const [isContentLoaded, setIsContentLoaded] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        setIsContentLoaded(true);
      }, 1000);
    }
  }, [open]);

  function isLoggedIn() {
    const userLoggedIn = localStorage.getItem("tz-user-logged-in");
    if (!userLoggedIn || userLoggedIn === "false") return false;
    else if (userLoggedIn === "true") return true;
  }

  function insertToCart() {
    let customer_id = localStorage.getItem("tz-user-id");
    axios
      .post(`${baseURL}/api/create-cart`, { customer_id : customer_id, cart_items : items })
      .then((response) => {
        localStorage.setItem('tz-cart-id', `${response.data.data.cartId}`)
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
  }

  return (
    <>
      {open && (
        <div className="cart">
          <div
            className="cart-overlay"
            onClick={() => {
              setIsContentLoaded(false);
              handleClose();
            }}
          >
            <div className="cart-container">
              {isContentLoaded && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "auto",
                    gridTemplateRows: "1fr auto 1fr",
                    justifyItems: "center",
                  }}
                >
                  <p className="cart-text">Cart</p>
                  <div
                    style={{
                      gridRow: "2/3",
                      height: "80vh",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      overflowY: "scroll",
                    }}
                  >
                    {items.map((item) => {
                      return (
                        <div
                          key={item.variant_id}
                          className="cart-item-container"
                        >
                          <img
                            src={item.imageUrl}
                            alt=""
                            className="cart-item-image"
                          />
                          <div className="cart-item-description">
                            <p className="cart-item-title-text">{item.name}</p>
                            <p className="cart-item-variant-text">
                              {item.description}
                            </p>
                          </div>
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "1fr",
                              gridTemplateRows: "1fr 3fr 1fr",
                              marginLeft: "auto",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                padding: "0 10px 0 0",
                              }}
                            >
                              <CloseIcon
                                style={{
                                  height: "15px",
                                  fill: "black",
                                  gridRow: "1/2",
                                }}

                                onClick={() =>{
                                  console.log('Clicked');
                                  let currentCart = JSON.parse(localStorage.getItem('cart'));
                                  if(currentCart[item.product_id].variants.length === 1){
                                    delete currentCart[item.productId];
                                  }

                                  else{
                                    let variantArray = currentCart[item.product_id].variants;
                                    let newArray = variantArray.filter(variant => variant !== item.variant_id);
                                    currentCart[item.product_id].variants = newArray;
                                  }

                                  localStorage.setItem('cart', JSON.stringify(currentCart));
                                }}
                              />
                            </div>

                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                              }}
                            >
                              <p className="cart-item-price">
                                {"$" + item.price}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "5vh",
                      width: "10vw",
                      borderRadius: "5px",
                      backgroundColor: "var(--main-blue)",
                      gridRow: "3/4",
                    }}
                    onClick={async () => {
                      if (isLoggedIn()) {
                        insertToCart();
                        navigate("/checkout");
                      } else {
                        navigate("/login");
                      }
                    }}
                  >
                    <p
                      style={{
                        fontSize: "16pt",
                        fontWeight: "600",
                        color: "white",
                      }}
                    >
                      Checkout
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const transformCartToArray = (cart) => {
  let result = [];
  Object.keys(cart).forEach((productId) => {
    const productVariants = cart[productId].variants.map((variantId) => {
      return { product_id: parseInt(productId), variant_id: variantId };
    });
    result = result.concat(productVariants);
  });

  return result;
};

export { Cart, transformCartToArray };
