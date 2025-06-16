import React, { useState } from "react";
import axios from "axios";
import "../styles/addforms.css";
import { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { url } from "../utils/urls.js";

export default function Bulkproducts(props) {
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
  const [file, setFile] = useState("");
  const [storeid, setStoreid] = useState("");
  console.log(storeid);
  const handleChange = (event) => {
    setFile(event.target.files[0]);
  };
  const handleSubmit = (event) => {
    if (!file) {
      toast("please select csv file", {
        type: "info",
      });
      return;
    }
    toast("request loading please wait", {
      progress: true,
    });
    event.preventDefault();
    const formData = new FormData();
    formData.append("store_id", storeid);
    formData.append("file", file);
    axios
      .post(`${url}/v1/admin/products/import/upload`, formData, {
        headers: {
          authtoken: authToken,
          sessionid: session_id,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(response.data);
        alert("File loaded");
        setFile("");
        toast.dismiss();
        toast("Product updated", {
          type: "success",
        });
      })
      .catch(function (error) {
        toast.dismiss();
        toast(error.response?.data?.message || "request failed", {
          type: "error",
        });
        console.log(error);
      });
  };
  useEffect(() => {
    if (props.storeId) {
      setStoreid(props.storeId);
    }
  }, [props.storeId]);

  return (
    <div className="content">
      <div className="csvupload">
        <input
          accept="text/csv"
          type="file"
          onChange={handleChange}
          onClick={(event) => {
            event.target.value = null;
          }}
        />
        <button onClick={handleSubmit} className="csvupload">
          Upload
        </button>
      </div>
      <p className="tpg" style={{ marginTop: "80px" }}>
        Disclaimer: This CSV upload functionality is subject to a maximum limit
        of 400 products or services per submission. Please Ensure that the CSV
        files adhere to this restriction. Any attempt to upload files exceeding
        this limit may result in errors.
      </p>
      <ToastContainer />
    </div>
  );
}
