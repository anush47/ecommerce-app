import React, { useState } from "react";
import "./Login.css";
import { ReactComponent as PersonIcon } from "../../icons/person-icon.svg";
import ActionButton from "../../components/ActionButton";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const baseURL = "http://127.0.0.1:5000";


function Login(props) {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const navigate = useNavigate();
  const location = useLocation();
  const fromPage = location.state?.from?.pathname || '/';

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    // event.preventDefault();
    const { username, password } = formData;
  
    axios.post(`${baseURL}/api/login`, { username, password })
      .then(response => {
        console.log('Login successful', response); // Assuming 'navigate' is correctly instantiated from useHistory or useNavigate
        localStorage.setItem('tz-user-logged-in', 'true')
        localStorage.setItem('tz-user-id', `${response.data.user_id}`)
        
        navigate(fromPage, { replace: true });
      })
      .catch(error => {
        if (error.response) {
          // Response was received but it's an error status code
          const status = error.response.status;
          switch (status) {
            case 400:
              alert("Invalid email format!");
              break;
            case 401:
              alert("Invalid password!");
              break;
            case 404:
              alert("Invalid username!");
              break;
            case 500:
              alert("Something went wrong.");
              break;
            default:
              alert("An unknown error occurred.");
              break;
          }
        } else if (error.request) {
          // The request was made but no response was received
          console.log(error.request);
          alert("The server did not respond. Please try again later.");
        } else {
          // Something else happened while setting up the request
          console.log('Error', error.message);
          alert("An error occurred while sending the request.");
        }
        console.log(error.config);
      });
  };
  

  const { username, password } = formData;
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          height: "60vh",
          width: "30vw",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(38, 50, 40, 0.2)",
          padding: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <PersonIcon className="login-icon" />
        <p
          style={{
            color: "#263228",
            fontSize: "20pt",
            fontWeight: "600",
            marginBottom: "10px",
          }}
        >
          Sign In to Technozone
        </p>
        <form onSubmit={handleSubmit} className="login-form">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <label htmlFor="username"></label>
            <p className="input-field-title">Email Address</p>
            <input
              className="input-field"
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={handleInputChange}
              required
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <label htmlFor="password"></label>
            <p className="input-field-title">Password</p>
            <input
              className="input-field"
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handleInputChange}
              required
            />

          </div>
          {/* <button type="submit">Login</button> */}
        </form>

        <ActionButton
          onTap={() => {
            handleSubmit();
          }}
          buttonText="Sign In"
          height="3.5vh"
          width="30%"
          margin="5px"
          fontSize="18pt"
        />

        <p
          style={{
            color: "grey",
            margin: "5px 0",
          }}
        >
          Dont have an account?{" "}
          <Link to="/register" style={{ color: "var(--bg-accent)" }}>
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
