import React, { useState } from "react";
import cross from "../assets/cross.png";
import { toast } from "react-toastify";
import axios from "axios";
import { useEffect } from "react";
import { url } from "../utils/urls.js";

export default function Vatpop(props) {
  const [vat, setVat] = useState({
    type: "VAT",
    percent: "",
  });
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
  // console.log(session_id);
  const handleVatChange = (e, key) => {
    setVat({
      ...vat,
      [key?.name || e?.target?.name || key]:
        e?.value || e?.target?.files?.[0] || e?.target?.value || "",
    });
  };
  async function handleSubmit(event) {
    event.preventDefault();
    const formData = JSON.stringify(vat);
    console.log(formData);
    try {
      toast("please wait", {
        progress: true,
      });
      const response = await axios.post(`${url}/v1/VAT/add`, formData, {
        headers: {
          authtoken: authToken,
          sessionid: session_id,
          "Content-Type": "application/json",
        },
      });
      if (response) {
        toast.dismiss();
        toast("Request Send", { type: "success" });
        fetchdata();
      }
    } catch (error) {
      toast.dismiss();
      toast(error.response.data.error, { type: "error" });
      console.error(error);
    }
  }

  const fetchdata = async () => {
    toast("loading please wait", {
      progress: true,
    });
    try {
      const response = await axios.get(`${url}/v1/vat/get/all`, {
        headers: { authtoken: authToken, sessionid: session_id },
      });
      toast.dismiss();

      if (response) {
        // console.log(response.data.data);
        setVat({
          percent: response.data.data.percent,
          type: response.data.data.type,
        });
      }
    } catch (error) {
      toast.dismiss();
      console.log(error);
    }
  };

  useEffect(() => {
    fetchdata();
  }, []);

  return props.trigger ? (
    <div className="popup">
      <div className="popup-content">
        <div className="popup-header">
          <div className="popup-heading">Enter Value Added Tax</div>
          <button className="icon-btn" onClick={() => props.setTrigger(false)}>
            <img src={cross} alt="cross icon" />
          </button>
        </div>
        <div className="seller-inputs">
          <div className="linked">
            <span className="form-headings">VAT Percentage</span>
            <input
              type="text"
              className="field"
              name="percent"
              id="percent"
              value={vat.percent}
              onChange={handleVatChange}
              placeholder="e.g 5%"
            />
          </div>
        </div>
        <div className="form-btns">
          <button className="cancel-btn" style={{ cursor: "Pointer" }}>
            Cancel
          </button>
          <button
            className="save-btn"
            style={{ cursor: "pointer" }}
            onClick={handleSubmit}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  ) : (
    ""
  );
}
