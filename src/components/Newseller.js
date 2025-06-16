import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import cross from "../assets/cross.png";
import { toast, ToastContainer } from "react-toastify";
import { url } from "../utils/urls.js";

export default function SellerAdd(props) {
  const navgate = useNavigate();
  const [authToken, setAuthToken] = useState(
    localStorage.getItem("authToken")
      ? localStorage.getItem("authToken" + "")
      : ""
  );
  const [session_id, setSession_id] = useState(
    localStorage.getItem("session_id")
      ? localStorage.getItem("session_id" + "")
      : ""
  );
  const [disable, setDisable] = useState(false);
  const [seller, setSeller] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone_number: "",
    store_name: "",
  });
  const handleSellerChange = (e, key) => {
    setSeller({
      ...seller,
      [key?.name || e?.target?.name || key]:
        e?.value || e?.target?.files?.[0] || e?.target?.value || "",
    });
  };

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = seller;
    // console.log(formData);
    if (formData.password.length >= 8) {
      try {
        setDisable(true);
        toast("please wait", {
          progress: true,
        });
        const response = await axios.post(`${url}/v1/seller/signup`, formData, {
          headers: { authtoken: authToken, sessionid: session_id },
        });
        if (response) {
          setDisable(false);
          toast.dismiss();
          toast("Seller created", { type: "success" });
          let data = response.data.user;
          data["store"] = { store_name: seller.store_name };
          navgate("add-seller", {
            state: {
              data: data,
            },
          });
        }
      } catch (error) {
        toast.dismiss();
        toast("Seller  not created", { type: "error" });
        console.error(error);
        setDisable(false);
      }
    } else {
      toast("Password too short", { type: "error" });
    }
  }

  return props.trigger ? (
    <div className="popup">
      <div className="popup-content">
        <div className="popup-header">
          <div className="popup-heading">Create new Seller</div>
          <button className="icon-btn" onClick={() => props.setTrigger(false)}>
            <img src={cross} alt="cross icon" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="seller-inputs">
            <input
              required
              type="text"
              name="first_name"
              id="first_name"
              value={seller.first_name}
              onChange={handleSellerChange}
              className="seller-input"
              placeholder="First Name"
            />
            <input
              required
              type="text"
              name="last_name"
              id="last_name"
              value={seller.last_name}
              onChange={handleSellerChange}
              className="seller-input"
              placeholder="Last Name"
            />
            <input
              required
              type="email"
              name="email"
              id="email"
              value={seller.email}
              onChange={handleSellerChange}
              className="seller-input"
              placeholder="Email"
            />
            <input
              required
              type="password"
              name="password"
              id="password"
              value={seller.password}
              onChange={handleSellerChange}
              className="seller-input"
              placeholder="password"
            />
            <input
              required
              type="tel"
              name="phone_number"
              id="phone_number"
              value={seller.phone_number}
              onChange={handleSellerChange}
              className="seller-input"
              placeholder="Phone Number"
            />
            <input
              required
              type="text"
              name="store_name"
              id="store_name"
              value={seller.store_name}
              onChange={handleSellerChange}
              className="seller-input"
              placeholder="Store Name"
            />
          </div>
          <div className="seller-btns">
            <button
              className="seller-cancel seller-btn"
              onClick={() => props.setTrigger(false)}
            >
              Cancel
            </button>
            <button
              className="seller-save seller-btn"
              type="submit"
              disabled={disable}
            >
              Save
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  ) : (
    ""
  );
}
