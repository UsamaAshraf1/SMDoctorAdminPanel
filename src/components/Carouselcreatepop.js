import React, { useState } from "react";
import cross from "../assets/cross.png";
import Select from "react-select";
import imageicon from "../assets/Imageicon.png";
import { toast } from "react-toastify";
import { url } from "../utils/urls.js";
import axios from "axios";

export default function Carouselcreatepop(props) {
  const [picture, setPicture] = useState("");
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
  const categories = [
    { label: "AT A CLINIC/GYM", value: "AT A CLINIC/GYM" },
    { label: "ON VIDEO CHAT", value: "ON VIDEO CHAT" },
    { label: "IN MY HOME", value: "IN MY HOME" },
    // { label: "Training", value: "Training" },
  ];
  const status = [
    { label: "Enable", value: true },
    { label: "Disable", value: "false" },
  ];
  const [carousel, setCarousel] = useState({
    des: "",
    link: "",
    status: "",
    category: "",
  });
  const empty = () => {
    setCarousel({
      des: "",
      link: "",
      status: "",
      category: "",
    });
    setPicture("");
  };
  const handleChange = (e, key) => {
    setCarousel({
      ...carousel,
      [key?.name || e?.target?.name || key]:
        e?.value || e?.target?.files?.[0] || e?.target?.value || "",
    });
  };
  function handlePicture(event) {
    event.preventDefault();
    setPicture(event.target.files[0]);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      let formData = new FormData();
      formData.append("image", picture);
      formData.append("des", carousel.des);
      formData.append("category", carousel.category);
      formData.append("status", carousel.status);
      const response = await axios.post(
        `${url}/v1/app/carasoule/add`,
        formData,
        {
          headers: { authtoken: authToken, sessionid: session_id },
        }
      );
      if (response) {
        toast("Carousel Created", {
          type: "success",
        });
        console.log(response);
        empty();
        props.fetchdata();
        props.setTrigger(false);
      }
    } catch (error) {
      console.error(error);
      toast(error.response?.data?.error || "request failed", {
        type: "error",
      });
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
          <div className="popup-heading">Add New Carousel</div>
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
            <span className="form-headings half">Description</span>
            <input
              type="text"
              name="des"
              id="des"
              onChange={handleChange}
              // placeholder="e.g 100AED"
              className="popfield"
            />
          </div>
          <div className="linkedpop">
            <div className="form-row">
              <span className="form-headings half">Category</span>
              <span className="form-headings half">Status</span>
            </div>
            <div className="form-row">
              <Select
                styles={{
                  control: customColor,
                }}
                name="category"
                id="category"
                onChange={handleChange}
                options={categories}
                className="popSelect"
              />
              <Select
                styles={{
                  control: customColor,
                }}
                options={status}
                name="status"
                id="status"
                onChange={handleChange}
                className="popSelect"
              />
            </div>
            <div className="linkedpop">
              <span className="form-headings half">Upload Image</span>
              <div className="form-row">
                <div className="image-sec-small">
                  <div className="imageicon">
                    {/* <img src={imageicon} alt="image" /> */}
                    <img
                      src={
                        picture
                          ? URL.createObjectURL(picture)
                          : carousel.link
                          ? carousel.link.substring(0, 4) === "http"
                            ? carousel.link
                            : "https://petsetgostorage.blob.core.windows.net/petsetgo-u2/" +
                              carousel.link
                          : imageicon
                      }
                      alt="image"
                      className="image"
                    />
                  </div>
                  <div className="imagehead">
                    <label htmlFor="image" style={{ cursor: "pointer" }}>
                      Upload images
                    </label>
                    <input
                      type="file"
                      name="image"
                      id="image"
                      className="file"
                      onChange={handlePicture}
                    />
                  </div>
                </div>
                <div className="empty-image"></div>
              </div>
            </div>
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
              onClick={handleSubmit}
              style={{ height: "40px", padding: "10px" }}
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
