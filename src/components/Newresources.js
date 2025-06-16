import React, { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import cross from "../assets/cross.png";
import imageicon from "../assets/Imageicon.png";
import { ToastContainer, toast } from "react-toastify";
import { url } from "../utils/urls.js";

export default function Newresources(props) {
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
  const [picture, setPicture] = useState("");
  const [loading, setLoading] = useState(false);
  const availOptions = [
    { label: "Available", value: true },
    { label: "Not Available", value: false },
  ];
  const experienceOptions = [
    { label: "1 Year", value: "1 Year" },
    { label: "2 Years", value: "2 Years" },
    { label: "3 Years", value: "3 Years" },
    { label: "4 Years", value: "4 Years" },
  ];
  const expertiseOptions =
    props?.resource?.expertise === "Video Call"
      ? [{ label: "Video Call", value: "Video Call" }]
      : props?.resource?.expertise
      ? [
          // { label: "Grooming", value: "Grooming" },
          // { label: "Training", value: "Training" },
          // { label: "Veterinary", value: "Veterinary" },
          // { label: "Day Boarding", value: "Day Boarding" },
          { label: "AT A CLINIC/GYM", value: "AT A CLINIC/GYM" },
          { label: "ON VIDEO CHAT", value: "ON VIDEO CHAT" },
          { label: "IN MY HOME", value: "IN MY HOME" },
        ]
      : [
          // { label: "Grooming", value: "Grooming" },
          // { label: "Training", value: "Training" },
          // { label: "Veterinary", value: "Veterinary" },
          // { label: "Day Boarding", value: "Day Boarding" },
          // { label: "Video Call", value: "Video Call" },
          { label: "AT A CLINIC/GYM", value: "AT A CLINIC/GYM" },
          { label: "ON VIDEO CHAT", value: "ON VIDEO CHAT" },
          { label: "IN MY HOME", value: "IN MY HOME" },
        ];
  const roleOptions = [
    { label: "Normal", value: "normal" },
    { label: "Emergency", value: "emergency" },
  ];
  const [resource, setResource] = useState({
    seller_id: "",
    name: "",
    email: "",
    designation: "",
    status: "",
    expertise: "",
    experience: "",
    specialty: "",
    role: "",
    image: "",
  });
  useEffect(() => {
    setResource({
      seller_id: props?.data?.suid + "",
      name: props.resource ? props.resource.name : "",
      status: props.resource ? props.resource.status : "",
      expertise: props.resource ? props.resource.expertise : "",
      experience: props.resource ? props.resource.experience : "",
      specialty: props.resource ? props.resource.specialty : "",
      role: props.resource ? props.resource.role : "",
      image: props.resource ? props.resource.image : "",
      email: props.resource ? props.resource.email : "",
      // resource_id: props.resource ? props.resource.resource_id : "",
    });
  }, [props]);
  // console.log(props);
  const empty = () => {
    setResource("");
    setPicture("");
  };
  const handleResourceChange = (e, key) => {
    console.log(e.value);
    let data = resource;
    setResource({
      ...data,
      [key?.name || e?.target?.name || e?.label || key]:
        e?.value === false
          ? false
          : e.value || e?.target?.files?.[0] || e?.target?.value || "",
    });
  };

  const submitAfterPicture = async (data) => {
    setLoading(true);
    if (data.resource_id) {
      try {
        console.log(data);
        const response = await axios.put(
          `${url}/v1/seller/resources/update?resource_id=${data.resource_id}`,
          data,
          {
            headers: { authtoken: authToken, sessionid: session_id },
          }
        );
        if (response) {
          console.log(response);
          props.load();
          props.setTrigger(false);
          empty();
        }
      } catch (error) {
        console.error(error);
        toast(error.response?.data?.error || "request failed", {
          type: "error",
        });
      } finally {
        setLoading(false); // Set loading state to false when request ends
      }
    } else {
      try {
        console.log(data);
        const response = await axios.post(
          `${url}/v1/seller/resources/add`,
          data,
          {
            headers: { authtoken: authToken, sessionid: session_id },
          }
        );
        if (response) {
          console.log(response);
          props.load();
          props.setTrigger(false);
          empty();
        }
      } catch (error) {
        console.error(error);
        toast(error.response?.data?.error || "request failed", {
          type: "error",
        });
      } finally {
        setLoading(false); // Set loading state to false when request ends
      }
    }
  };

  async function handleSubmit(event) {
    event.preventDefault();
    let data = resource;

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
          console.log(res);
          data.image = "sellers/" + res.data.fileKey;
          console.log(data.image);
          submitAfterPicture(data);
        })
        .catch(function (error) {
          toast.dismiss();
          toast("Picture not Uploaded", {
            type: "error",
          });
          console.log(error.response.data);
        });
    } else {
      submitAfterPicture(data);
    }
  }
  function handlePicture(event) {
    event.preventDefault();
    setPicture(event.target.files[0]);
    // console.log(event.target.files[0]);
  }
  const customColor = (baseStyles) => ({
    ...baseStyles,
    height: "40px",
  });

  return props.trigger ? (
    <div className="popup">
      <div className="popup-content" style={{ width: "600px" }}>
        <div className="popup-header">
          <div className="popup-heading">
            {props?.resource?.resource_id
              ? "Update Resource"
              : "Create new Resource"}
          </div>
          <button
            className="icon-btn"
            onClick={() => {
              setResource({});
              props.setResource({});
              props.setTrigger(false);
              empty();
            }}
          >
            <img src={cross} alt="cross icon" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="seller-inputs" style={{ gap: "12px" }}>
            <div className="fields">
              <div>
                <span className="newresource-heading">Full name</span>
              </div>
              <input
                required
                type="text"
                name="name"
                id="name"
                value={resource.name}
                onChange={handleResourceChange}
                className="seller-input"
                placeholder="Full Name"
                style={{ height: "40px" }}
              />
            </div>

            <div className="form-row">
              <div className="fields" style={{ width: "50%" }}>
                <div>
                  <span className="newresource-heading">Availibility</span>
                </div>
                <Select
                  defaultValue={
                    props?.resource?.status === true
                      ? { label: "Available", value: true }
                      : props?.resource?.status === false
                      ? { label: "Not Available", value: false }
                      : ""
                  }
                  styles={{
                    control: customColor,
                  }}
                  name="status"
                  id="status"
                  options={availOptions}
                  placeholder="Aavailablity"
                  onChange={handleResourceChange}
                />
                {/* <select
                name="status"
                id="status"
                className="seller-input"
                onChange={handleResourceChange}
              >
                <option value={true}>Availiable</option>
                <option value={false}>Not Availiable</option>
              </select> */}
              </div>
              <div className="fields" style={{ width: "50%" }}>
                <div>
                  <span className="newresource-heading">Experience</span>
                </div>
                <Select
                  defaultValue={
                    props?.resource?.experience
                      ? {
                          label: props.resource.experience,
                          value: props.resource.experience,
                        }
                      : ""
                  }
                  styles={{
                    control: customColor,
                  }}
                  name="experience"
                  id="experience"
                  options={experienceOptions}
                  placeholder="Experience"
                  onChange={handleResourceChange}
                />
                {/* <select
                name="experience"
                id="experience"
                className="seller-input"
                onChange={handleResourceChange}
              >
                <option>1 Year</option>
                <option>2 Years</option>
                <option>3 Years</option>
                <option>4 Years</option>
              </select> */}
              </div>
            </div>
            <div className="fields">
              <div>
                <span className="newresource-heading">Expertise</span>
              </div>
              <Select
                defaultValue={
                  props?.resource?.expertise
                    ? {
                        label: props.resource.expertise,
                        value: props.resource.expertise,
                      }
                    : ""
                }
                styles={{
                  control: customColor,
                }}
                name="expertise"
                id="expertise"
                options={expertiseOptions}
                placeholder="Expertise"
                onChange={handleResourceChange}
              />
              {/* <select
                name="expertise"
                id="expertise"
                className="seller-input"
                onChange={handleResourceChange}
              >
                <option>Grooming</option>
                <option>Training</option>
                <option>Veterinary</option>
              </select> */}
            </div>
            <div
              className={
                resource.expertise === "Video Call" ? "form-row" : "hidden"
              }
            >
              <div className="fields" style={{ width: "50%" }}>
                <div>
                  <span className="newresource-heading">Email</span>
                </div>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={resource.email}
                  onChange={handleResourceChange}
                  className="seller-input"
                  placeholder="Email"
                  style={{ height: "40px" }}
                />
              </div>
              <div className="fields" style={{ width: "50%" }}>
                <div>
                  <span className="newresource-heading">Designation</span>
                </div>
                <input
                  type="text"
                  name="designation"
                  id="designation"
                  value={resource.designation}
                  onChange={handleResourceChange}
                  className="seller-input"
                  placeholder="Designation"
                  style={{ height: "40px" }}
                />
              </div>
            </div>
            <div
              className={
                resource.expertise === "Video Call" ? "form-row" : "hidden"
              }
            >
              <div className="fields" style={{ width: "50%" }}>
                <div>
                  <span className="newresource-heading">Speciality</span>
                </div>
                <input
                  type="text"
                  name="specialty"
                  id="specialty"
                  value={resource.specialty}
                  onChange={handleResourceChange}
                  className="seller-input"
                  placeholder="Speciality"
                  style={{ height: "40px" }}
                />
              </div>
              <div className="fields" style={{ width: "50%" }}>
                <div>
                  <span className="newresource-heading">Role</span>
                </div>
                <Select
                  defaultValue={
                    props?.resource?.role
                      ? {
                          label: props.resource.role,
                          value: props.resource.role,
                        }
                      : ""
                  }
                  styles={{
                    control: customColor,
                  }}
                  name="role"
                  id="role"
                  options={roleOptions}
                  placeholder="Role"
                  onChange={handleResourceChange}
                />
              </div>
            </div>
            <div
              className={
                resource.expertise === "Video Call" ? "form-row" : "hidden"
              }
            >
              <div className="image-sec-small">
                <div className="imageicon">
                  {/* <img src={imageicon} alt="image" /> */}
                  <img
                    src={
                      picture
                        ? URL.createObjectURL(picture)
                        : resource.image
                        ? resource.image.substring(0, 4) === "http"
                          ? resource.image
                          : "https://petsetgostorage.blob.core.windows.net/petsetgo-u2/" +
                            resource.image
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
          <div
            className="seller-btns"
            style={{ gap: "100px", marginTop: "16px" }}
          >
            <button
              className="seller-cancel seller-btn"
              onClick={() => {
                props.setTrigger(false);
                props.setResource({});
                empty();
              }}
              style={{ height: "40px", padding: "10px" }}
            >
              Cancel
            </button>
            <button
              className="seller-save seller-btn"
              type="submit"
              style={{ height: "40px", padding: "10px" }}
            >
              {loading ? "Saving..." : "Save"}
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
