import React, { useState } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "../styles/form.css";
import vector1 from "./../assets/smartCare_hero.jpg";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { url } from "../utils/urls.js";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase.js";
// import { initializeApp } from "firebase/app";

// // Firebase configuration (replace with your actual config)
// const configuration = {
//   apiKey: "AIzaSyCRgnqpOobPwjvzvBKJsgyFQViN3TufteA",
//   authDomain: "smart-care-ca9ee.firebaseapp.com",
//   projectId: "smart-care-ca9ee",
//   storageBucket: "smart-care-ca9ee.firebasestorage.app",
//   messagingSenderId: "900524263296",
//   appId: "1:900524263296:web:c81deab9107eca4b5be365",
//   measurementId: "G-J8PV49805L",
// };

// // Initialize Firebase
// const app = initializeApp(configuration);
// const auth = getAuth(app);

export default function Login(props) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function validateForm() {
    return email.length > 0 && password.length > 0;
  }

  async function login(email, password) {
    toast("Please wait", {
      progress: true,
    });

    try {
      // Firebase authentication
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Get Firebase ID token
      const idToken = await user.getIdToken();

      // Send token to your backend
      const response = await axios.post(`${url}/v1/doctor/login`, {
        token: idToken,
        // email: email,
      });

      if (response.data?.success) {
        localStorage.setItem("login", true);
        localStorage.setItem("user", JSON.stringify(response.data));
        props.setRole(response.data.data.role);
        props.setLogin(true);
        window.location.reload();
        navigate("/");
      }
    } catch (error) {
      toast.dismiss();
      let errorMessage = "Login failed";

      // Handle Firebase specific errors
      if (error.code) {
        switch (error.code) {
          case "auth/wrong-password":
            errorMessage = "Invalid password";
            break;
          case "auth/user-not-found":
            errorMessage = "User not found";
            break;
          case "auth/invalid-email":
            errorMessage = "Invalid email format";
            break;
          default:
            errorMessage = error.message;
        }
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      toast(errorMessage, {
        type: "error",
      });
      console.error("Login error:", error);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    login(email, password);
  }

  return (
    <div className="loginpage" style={{ height: "100vh", overflow: "hidden" }}>
      <section className="logosection tab1">
        <div className="vector1">
          <img src={vector1} alt="logoimage" style={{height:"100vh"}}/>
        </div>
      </section>
      <section className="formsection tab2">
        <div className="heading">
          <h3 className="h3">Doctor Portal</h3>
          <p className="head-pg"></p>
        </div>
        <div className="form">
          <Form onSubmit={handleSubmit}>
            <div className="fields-group">
              <Form.Group className="mb-3 email" controlId="formBasicEmail">
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  className="form-field"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  className="form-field"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>
            </div>
            <Button
              className="btn form-btn"
              variant="secondary"
              type="submit"
              disabled={!validateForm()}
              style={{ cursor: "pointer" }}
            >
              Sign in
            </Button>
          </Form>
        </div>
      </section>
      <ToastContainer />
    </div>
  );
}
