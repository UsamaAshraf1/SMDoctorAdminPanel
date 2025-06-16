import React, { useEffect, useState } from "react";
import cross from "../assets/cross.png";
import Select from "react-select";
import imageicon from "../assets/Imageicon.png";
import { toast } from "react-toastify";
import { url } from "../utils/urls.js";
import axios from "axios";

export default function Carouselupdate(props) {
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
    // { label: "Veterinary", value: "Veterinary" },
    // { label: "Grooming", value: "Grooming" },
    // { label: "Boarding", value: "Boarding" },
    // { label: "Training", value: "Training" },
    { label: "AT A CLINIC/GYM", value: "AT A CLINIC/GYM" },
    { label: "ON VIDEO CHAT", value: "ON VIDEO CHAT" },
    { label: "IN MY HOME", value: "IN MY HOME" },
  ];
  const status = [
    { label: "Enable", value: true },
    { label: "Disable", value: "false" },
  ];
  const [carousel, setCarousel] = useState({
    id: "",
    des: "",
    link: "",
    status: "",
    category: "",
  });
  const empty = () => {
    setCarousel({
      id: "",
      des: "",
      link: "",
      status: "",
      category: "",
    });
  };
  console.log(props.preData);
  const handleChange = (e, key) => {
    console.log(carousel);
    setCarousel({
      ...carousel,
      [key?.name || e?.target?.name || key]:
        e?.value || e?.target?.files?.[0] || e?.target?.value || "",
    });
  };
  useEffect(() => {
    setCarousel({
      id: props?.preData?.id ? props.preData.id : "",
      category: props?.preData?.category ? props.preData.category : "",
      status: props?.preData?.status ? props.preData.status : "",
      link: props?.preData?.link ? props.preData.link : "",
      des: props?.preData?.des ? props.preData.des : "",
    });
  }, [props.trigger === true]);
  function handlePicture(event) {
    event.preventDefault();
    setPicture(event.target.files[0]);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    let data = carousel;

    if (picture) {
      const pictureData = new FormData();
      pictureData.append("media", picture);
      const picResponse = await axios
        .post(`${url}/v1/store/media/upload`, pictureData, {
          headers: {
            authtoken: authToken,
            sessionid: session_id,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          data.link = "carasoule" + res.data.fileKey;
        })
        .catch(function (error) {
          toast.dismiss();
          toast("Picture not Uploaded", {
            type: "error",
          });
          console.log(error.response.data);
        });
    }

    try {
      console.log(data);
      const response = await axios.put(
        `${url}/v1/app/carasoule/update?id=${props?.preData?.id}`,
        data,
        {
          headers: { authtoken: authToken, sessionid: session_id },
        }
      );
      if (response) {
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
          <div className="popup-heading">Update Carousel</div>
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
              value={carousel.des}
              onChange={handleChange}
              name="des"
              id="des"
              placeholder="Write Description"
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
                defaultValue={
                  props.preData?.category
                    ? {
                        label: props.preData?.category,
                        value: props.preData.category,
                      }
                    : ""
                }
                options={categories}
                onChange={handleChange}
                name="category"
                id="category"
                // placeholder="Grooming"
                className="popSelect"
              />
              <Select
                styles={{
                  control: customColor,
                }}
                defaultValue={
                  props.preData?.status === true
                    ? {
                        label: "Enable",
                        value: true,
                      }
                    : props.preData?.status === "false"
                    ? {
                        label: "Disable",
                        value: false,
                      }
                    : ""
                }
                options={status}
                onChange={handleChange}
                name="status"
                id="status"
                // placeholder="Enable"
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
                          : props.preData.link
                          ? props.preData.link.substring(0, 4) === "http"
                            ? props.preData.link
                            : "https://petsetgostorage.blob.core.windows.net/petsetgo-u2/" +
                              props.preData.link
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
