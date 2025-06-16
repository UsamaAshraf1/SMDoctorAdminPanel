import axios from "axios";
import React from "react";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import cross from "../assets/cross.png";

export default function Deletecoupon(props) {
  // console.log(props);
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
  function empty() {
    props.setCouponsCodes([]);
    props.setTrigger(false);
  }

  const handleDelete = async () => {
    const data = props.couponsCodes;
    try {
      //   console.log(data);
      const response = await axios.post(
        "https://smart-care-backend-topaz.vercel.app/v1/admin/coupons/delete",
        { couponsCodes: data },
        {
          header: "Content-Type: application/json",
        }
      );
      if (response) {
        console.log(response);
        toast.dismiss();
        toast("Request Successfull", {
          type: "success",
        });
        empty();
        props.fetchdata();
      }
    } catch (error) {
      console.error(error);
      toast.dismiss();
      toast("request Failed", {
        type: "error",
      });
    }
  };

  return props.trigger ? (
    <div className="popup">
      <div className="popup-content">
        <div className="popup-header">
          <div className="popup-heading">Delete Coupon</div>
          <button
            className="icon-btn"
            onClick={() => {
              //   props.setPopupDelete(false);
              empty();
            }}
          >
            <img src={cross} alt="cross icon" />
          </button>
        </div>
        <div>
          <div>
            <span>Are you sure want to delete</span>
          </div>
          <div className="seller-btns">
            <button
              className="seller-cancel seller-btn"
              onClick={() => {
                // props.setPopupDelete(false);
                empty();
              }}
            >
              Cancel
            </button>
            <button
              className="seller-save seller-btn"
              onClick={() => handleDelete()}
            >
              Yes
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  ) : (
    ""
  );
}
