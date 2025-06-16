import axios from "axios";
import React from "react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import cross from "../assets/cross.png";
import { useState } from "react";
import { url } from "../utils/urls.js";

export default function DeletePop(props) {
  // console.log(props.data);
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
  function empty() {
    props.setPopupDelete(false);
  }

  const handleDelete = async () => {
    if (props.data.store) {
      toast("Request loading please wait", {
        progress: true,
      });
      try {
        let obj = {};
        obj["data"] = [props.data.store.sid];
        let response = await axios.post(`${url}/v1/store/delete`, obj, {
          headers: { authtoken: authToken, sessionid: session_id },
        });
        if (response) {
          props.refreshFunc();
          navgate("/sellers");
          console.log(response);
        }
      } catch (err) {
        toast.dismiss();
        toast("request failed", {
          type: "error",
        });
        console.log(err);
      }
    } else {
      toast("User Does not have any store", {
        type: "error",
      });
    }
  };

  return props.popupDelete ? (
    <div className="popup">
      <div className="popup-content">
        <div className="popup-header">
          <div className="popup-heading">Delete Store</div>
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
            <span>
              Are you sure want to delete{" "}
              <span style={{ fontFamily: "Poppins", fontSize: "18px" }}>
                {props.data?.store?.store_name}
              </span>
            </span>
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
