import React, { useState } from "react";
import cross from "../assets/cross.png";
import Select from "react-select";
import { toast } from "react-toastify";
import axios from "axios";
import { useEffect } from "react";
import { url } from "../utils/urls.js";

export default function Notifycustomerpop(props) {
  const [data, setData] = useState({
    customer_id: "",
    title: "",
    des: "",
  });
  useEffect(() => {
    setData({
      customer_id: props.query ? props.query.uid : "",
      title: "",
      des: "",
    });
  }, [props]);
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
  // console.log(props);
  const handleDataChange = (e, key) => {
    setData({
      ...data,
      [key?.name || e?.target?.name || key]:
        e?.value || e?.target?.files?.[0] || e?.target?.value || "",
    });
  };
  // console.log(data);
  const empty = () => {
    setData({
      customer_id: "",
      title: "",
      des: "",
    });
  };
  async function handleSubmit(event) {
    event.preventDefault();
    console.log(data);
    const formData = data;
    console.log(formData);
    try {
      toast("please wait", {
        progress: true,
      });
      const response = await axios.post(
        `${url}/v1/admin/notify/customer`,
        formData,
        {
          headers: {
            authtoken: authToken,
            sessionid: session_id,
            "Content-Type": "application/json",
          },
        }
      );
      if (response) {
        toast.dismiss();
        toast("Request Send", { type: "success" });
        props.setTrigger(false);
        empty();
      }
    } catch (error) {
      toast.dismiss();
      toast(error.response.data.error, { type: "error" });
      console.error(error);
    }
  }

  const customColor = (baseStyles) => ({
    ...baseStyles,
    backgroundColor: "rgba(239, 241, 249, 0.6)",
    minHeight: "42px",
  });
  return props.trigger ? (
    <div className="popup">
      <div className="popup-content">
        <div className="popup-header">
          <div className="popup-heading">Send Notification</div>
          <button
            className="icon-btn"
            onClick={() => {
              empty();
              props.setTrigger(false);
            }}
          >
            <img src={cross} alt="cross icon" />
          </button>
        </div>
        <div className="pop-inputs">
          <div className="linkedpop">
            <div className="form-row">
              <span className="form-headings half">Title</span>
            </div>
            <div className="form-row">
              <input
                type="text"
                name="title"
                id="title"
                placeholder="title"
                onChange={handleDataChange}
                // value={coupon.rate}
                className="popfield"
              />
            </div>
          </div>
          <div className="linkedpop">
            <span className="form-headings half">Description</span>
            <input
              type="text"
              name="des"
              id="des"
              placeholder=""
              onChange={handleDataChange}
              value={data.des}
              className="popfield"
            />
          </div>

          <div className="seller-btns">
            <button
              className="seller-cancel seller-btn"
              onClick={() => {
                empty();
                props.setTrigger(false);
              }}
              style={{ height: "40px", padding: "10px" }}
            >
              Cancel
            </button>
            <button
              className="seller-save seller-btn"
              style={{ height: "40px", padding: "10px" }}
              onClick={handleSubmit}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : (
    ""
  );
}
