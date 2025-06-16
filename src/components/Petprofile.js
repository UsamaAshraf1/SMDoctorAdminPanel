import React, { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Document, Page } from "react-pdf";
import imageicon from "../assets/Imageicon.png";
import { url } from "../utils/urls.js";

const RenderImageDoc = ({ file }) => {
  const key = file.key;

  const src =
    key.substring(0, 4) === "http"
      ? key
      : "https://petsetgostorage.blob.core.windows.net/petsetgo-u2/" + key;

  if (file.ext === "pdf") {
    return (
      <div style={{ width: "100%", height: "800px" }}>
        <iframe
          src={`${url}/v1/pet/get/pdffile?key=${key}`}
          width="100%"
          height="100%"
        ></iframe>

        {/* <Document
          file={
            "https://test-api.petsetgo.com/v1/pet/get/pdffile?key=pets/13tvtgcwlldrr8f5i.pdf"
          }
          // onLoadSuccess={onDocumentLoadSuccess}
          onError={(e) => console.log(e)}
        ></Document> */}
      </div>
    );
  } else if (file.ext === "jpg" || file.ext === "jpeg" || file.ext === "png") {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <img
          src={src}
          alt={file.fileName}
          style={{ maxWidth: "100%", maxHeight: "100%" }}
        />
      </div>
    );
  } else {
    return null;
  }
};

const PetProfile = (props) => {
  const [src, setSrc] = useState("");
  const [pdf, setPdf] = useState(false);
  const location = useLocation();
  const [previousData, setPreviousData] = useState(
    location.state ? location.state.data : ""
  );
  useEffect(() => {
    props.setName("Pet Profile");
  });
  useEffect(() => {}, [pdf]);

  // console.log(previousData);
  return (
    <div className="content">
      <div className="products" style={{ marginTop: "20px" }}>
        <div>
          <span className="bigger-font">
            {previousData?.pet_name || "profile"}
          </span>
        </div>
        <div className="search-div">
          {/* <input
            type="search"
            className="search-product"
            id="string"
            name="string"
            //   value={string}
            //   onChange={handleString}
            placeholder="Search"
          />
          <div>
            <button className="search-btn">Search</button>
          </div> */}
        </div>
      </div>
      <div className="products">
        <div className="small-image">
          <div className="empty-image">
            <div className="imageicon">
              <img
                src={
                  previousData?.pet_image
                    ? previousData?.pet_image.substring(0, 4) === "http"
                      ? previousData?.pet_image
                      : "https://petsetgostorage.blob.core.windows.net/petsetgo-u2/" +
                        previousData?.pet_image
                    : imageicon
                }
                alt="image"
                className="image"
              />
            </div>
          </div>
          <div className="pet">
            <div className="oheader">
              <span className="order-heading">PetID:</span>
              <span className="head-value">{previousData?.pet_id || ""}</span>
            </div>
            <div className="oheader">
              <span className="order-heading">PetName:</span>
              <span className="head-value">{previousData?.pet_name || ""}</span>
            </div>
            <div className="oheader">
              <span className="order-heading"> DOB :</span>
              <span className="head-value">{previousData?.dob || ""}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="petprofile">
        <div className="petinfo">
          <div className="oheader">
            <span className="order-heading">Pet Breed :</span>
            <span className="head-value">{previousData?.pet_breed || ""}</span>
          </div>
          <div className="oheader">
            <span className="order-heading">Species :</span>
            <span className="head-value">{previousData?.species || ""}</span>
          </div>
          <div className="oheader">
            <span className="order-heading">Gender :</span>
            <span className="head-value">{previousData?.gender || ""}</span>
          </div>
          <div className="oheader">
            <span className="order-heading">Breed :</span>
            <span className="head-value">{previousData?.breed || ""}</span>
          </div>
        </div>
        <div className="petinfo">
          <div className="oheader">
            <span className="order-heading">Active :</span>
            <span className="head-value">{previousData?.active || ""}</span>
          </div>
          <div className="oheader">
            <span className="order-heading">Issues :</span>
            <span className="head-value">{previousData?.issue || ""}</span>
          </div>
          <div className="oheader">
            <span className="order-heading">Spend Most Time :</span>
            <span className="head-value">
              {previousData?.spend_most_time || ""}
            </span>
          </div>
          <div className="oheader">
            <span className="order-heading">Special Care :</span>
            <span className="head-value">
              {previousData?.special_care || ""}
            </span>
          </div>
          <div className="oheader">
            <span className="order-heading">Medical File Name :</span>
            <span className="head-value">
              {previousData?.medical_file_name || ""}
            </span>
          </div>
          <div className="oheader">
            <span className="order-heading">Medical Docs :</span>
            <span className="head-value">
              {previousData?.medical_doc || ""}
            </span>
          </div>
          <div className="oheader">
            <span className="order-heading">Microchip Number :</span>
            <span className="head-value">
              {previousData?.microchip_number || ""}
            </span>
          </div>
        </div>
        <div className="petinfo">
          <div className="oheader">
            <span className="order-heading">Life Stage :</span>
            <span className="head-value">{previousData?.life_stage || ""}</span>
          </div>
          <div className="oheader">
            <span className="order-heading">Weight :</span>
            <span className="head-value">{previousData?.weight || ""}</span>
          </div>
          <div className="oheader">
            <span className="order-heading">Document Name :</span>
            <span className="head-value">
              {previousData?.document_name || ""}
            </span>
          </div>
          <div className="oheader">
            <span className="order-heading">Documets :</span>
            <span className="head-value">{previousData?.documents || ""}</span>
          </div>
          <div className="oheader">
            <span className="order-heading">Document Expiry Date :</span>
            <span className="head-value">
              {previousData?.document_expiry_date || ""}
            </span>
          </div>
        </div>
        <div className="petinfo">
          <div className="oheader">
            <span className="s-values">Customer Information</span>
          </div>
          <div className="oheader">
            <span className="order-heading">User ID :</span>
            <span className="head-value">
              {previousData?.customer?.customer_id || ""}
            </span>
          </div>
          <div className="oheader">
            <span className="order-heading">Customer Name :</span>
            <span className="head-value">
              {previousData?.customer?.first_name || ""}
            </span>
          </div>
          <div className="oheader">
            <span className="order-heading">Email :</span>
            <span className="head-value">
              {previousData?.customer?.email || ""}
            </span>
          </div>
          <div className="oheader">
            <span className="order-heading">Phone :</span>
            <span className="head-value">
              {previousData?.customer?.phone || ""}
            </span>
          </div>
        </div>
      </div>
      {previousData?.document_array?.map((file, index) => {
        return (
          <div key={index} className="petprofile" style={{ marginTop: "20px" }}>
            <RenderImageDoc file={file} />
          </div>
        );
      })}
    </div>
  );
};
export default PetProfile;
