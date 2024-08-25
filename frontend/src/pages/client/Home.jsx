import { ReactComponent as MenuIcon } from "../../icons/new/menus.svg";
import { ReactComponent as UserIcon } from "../../icons/new/user.svg";
import { ReactComponent as CartIcon } from "../../icons/new/shopping-cart.svg";
import { ReactComponent as LogoIcon } from "../../icons/new/logo.svg";
import { Navbar, NavItem } from "../../components/Navbar";
import { ProductGrid, ProductTile } from "../../components/Product";
import Modal from "../../components/Modal";
import React, { useState, useEffect, useRef } from "react";
import { Cart, transformCartToArray } from "../../components/Cart";
import axios from "axios";
import useSessionLikeLocalStorage from "../../components/hooks/SessionHook";
import Menu from "../../components/Menu";
import { useNavigate } from "react-router-dom";

const baseURL = "http://127.0.0.1:5000";

function Home() {
  const [openDialog, setOpenDialog] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState({});

  const [openCart, setOpenCart] = useState(false);

  const [cartItems, setCartItems] = useState([]);

  const [products, setProducts] = useState([]);

  const [displayMenu, setDisplayMenu] = useState(false);

  const [menu, setMenu] = useState([]);

  const [categoryId, setCategoryId] = useState(0);

  const navigate = useNavigate();

  function handleCategoryChange(id){
    console.log('About to set category in Home to:', id);
    setCategoryId(id);
    console.log('Category in Home : '+categoryId);
  }

  const menuRef = useRef(null);
  
  useSessionLikeLocalStorage();

  useEffect(() => {
    console.log('Updated Category in Home : ' + categoryId);
    axios.get(`${baseURL}/api/products`, {params : {categoryId : categoryId}}).then((response) => {
      let data = [];
      for (let key in response.data) {
        data.push(response.data[key]);
      }
      setProducts(data);
    })
  }, [categoryId]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setDisplayMenu(false)
      }
    }
  
    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);
  
    // Remove event listener on cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  useEffect(() => {
    axios.get(`${baseURL}/api/menu`).then((response) => {
      console.log(response.data)
      setMenu(response.data);
    });

    axios.get(`${baseURL}/api/products`, { params: { categoryId: 0 } }).then((response) => {
      let data = [];
      for (let key in response.data) {
        data.push(response.data[key]);
      }
      setProducts(data);

      let currentCart = JSON.parse(localStorage.getItem("cart") || "{}");
      console.log(currentCart);
      const items = transformCartToArray(currentCart);
      setCartItems(items);
    });
  }, []);

  useEffect(() => {
    if (!openDialog) {
      setSelectedVariant({});
    }
  }, [openDialog]);

  const handleOpenDialog = ({ productId }) => {
    const product = products.find((p) => p.product_id === productId);
    setSelectedVariant(product.variants[0]);
    setSelectedProduct(product);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenCart = () => {
    setOpenCart(true);
  };

  const handleCloseCart = () => {
    setOpenCart(false);
  };

  const addToCart = (item) => {
    let currentCart = JSON.parse(localStorage.getItem("cart") || "{}");
    if (!currentCart[item.product_id]) {
      currentCart[item.product_id] = { variants: [] };
    }
    currentCart[item.product_id].variants = [
      ...currentCart[item.product_id].variants,
      item.variant_id,
    ];
    localStorage.setItem("cart", JSON.stringify(currentCart));
    setCartItems([...cartItems, item]);
  };

  return (
    <>
      <Navbar>
        <div className="logo-container">
          <LogoIcon className="nav-bar-logo-icon" />
        </div>
        <div className="nav-bar-route-container">
          <NavItem>
            <MenuIcon
              onClick={() => {
                setDisplayMenu(true);
              }}
            />
          </NavItem>
          <NavItem>
            <UserIcon onClick={() =>{ 
              let userLoggedIn = localStorage.getItem('tz-user-logged-in') || 'false';
              if(!userLoggedIn || userLoggedIn !== 'true'){
                navigate('/login');
              }
             }} />
          </NavItem>
          <NavItem>
            <CartIcon onClick={handleOpenCart} />
          </NavItem>
        </div>
      </Navbar>
      <div className="category-menu"></div>
      <div>
        <p className="main-text">All Products</p>
      </div>
      {displayMenu && (
        <div
          ref={menuRef}
          style={{
            position: "absolute",
            zIndex: "2",
            display : 'flex',
            top: "70px",
            right: "200px",
          }}
        >
          <Menu items={menu} onMenuItemClick={handleCategoryChange}/>
        </div>
      )}
      <ProductGrid>
        {products.map((product, index) => {
          return (
            <ProductTile
              key={index}
              src={product.variants[0].imageUrl}
              onClick={() => {
                // alert(product.id)
                handleOpenDialog({ productId: product.product_id });
              }}
              title={product.title}
              price={product.default_price}
            ></ProductTile>
          );
        })}
      </ProductGrid>
      <Modal
        open={openDialog}
        handleClose={handleCloseDialog}
        title="Add product to Cart"
      >
        {openDialog && (
          <div className="add-product-to-cart-modal">
            <div style={divStyle1}>
              <p className="add-product-name-text">{selectedProduct.title}</p>
              <div className="add-product-modal-image-container">
                <img
                  src={selectedVariant.imageUrl}
                  alt=""
                  className="add-product-image"
                />
              </div>
            </div>

            <div className="choose-variant-and-price-container">
              <p className="add-product-variant-text">Product Variants:</p>
              <div className="variant-container">
                {selectedProduct.variants.map((variant) => (
                  <div
                    key={variant.variant_id}
                    className={`variant-description-container ${
                      selectedVariant.variant_id === variant.variant_id
                        ? "active"
                        : ""
                    }`}
                    onClick={() => {
                      setSelectedVariant(variant);
                    }}
                  >
                    <p>{variant.detailed_description}</p>
                  </div>
                ))}
              </div>
              <div style={divStyle2}>
                <p style={priceTextStyle}>Price: ${selectedVariant.price}</p>
                <div
                  style={addProductButtonStyle}
                  onClick={() => {
                    addToCart({
                      product_id: selectedProduct.product_id,
                      variant_id: selectedVariant.variant_id,
                    });
                    handleCloseDialog();
                  }}
                >
                  <p>Add Product</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
      <Cart
        open={openCart}
        handleClose={handleCloseCart}
        items={cartItems.map((item) => {
          const product = products.find(
            (p) => p.product_id === item.product_id
          );
          const variant = product.variants.find(
            (v) => v.variant_id === item.variant_id
          );
          return {
            product_id: item.product_id,
            variant_id: item.variant_id,
            imageUrl: variant.imageUrl,
            name: product.title,
            description: variant.details,
            price: variant.price,
          };
        })}
      />
    </>
  );
}

// {
//   id: 2,
//   name: "iPhone Pro",
//   price: 1000.0,
//   variant: {
//     variant_id: 2,
//     description:
//       "Illum pariatur possimus quaerat ipsum quos molestiae rem aspernatur dicta tenetur. Sunt placeat tempora vitae enim incidunt porro fuga ea.",
//   },
// },

const divStyle1 = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px",
};

const divStyle2 = {
  display: "flex",
  width: "90%",
  justifyContent: "space-around",
  alignItems: "center",
};

const priceTextStyle = {
  fontSize: "18pt",
  fontWeight: "700",
};

const addProductButtonStyle = {
  fontSize: "16pt",
  color: "white",
  backgroundColor: "#317af0",
  padding: "5px 10px",
  display: "flex",
  borderRadius: "5px",
  justifyContent: "center",
  alignItems: "center",
};

export default Home;
