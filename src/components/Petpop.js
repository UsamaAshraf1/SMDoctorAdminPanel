import React, { useState } from "react";
import cross from "../assets/cross.png";

export default function Petpop(props) {
  const [pdf, setPdf] = useState([]);
  const handleDownload = (i) => {
    console.log(i);
    setPdf([]);
    let array = [];
    i.document_array.map((doc) => {
      array.push(doc);
    });
    setPdf(array);
  };

  function calculateAge(dob) {
    if (!dob) {
      return null;
    }

    const today = new Date();
    const [day, month, year] = dob.split("-").map(Number);
    const birthDate = new Date(year, month - 1, day);

    const ageInMilliseconds = today - birthDate;
    const ageInYears = today.getFullYear() - birthDate.getFullYear();
    const ageInMonths = Math.floor(
      ageInMilliseconds / (30.44 * 24 * 60 * 60 * 1000)
    );

    if (ageInYears >= 1) {
      return ageInYears + " year";
    } else {
      return ageInMonths + " months";
    }
  }
  // console.log(props.query);
  return props.trigger ? (
    <div className="popup">
      <div className="popup-content">
        <div className="popup-header">
          <div className="popup-heading">{props.query?.first_name}</div>
          <button
            className="icon-btn"
            onClick={() => {
              props.setTrigger(false);
              setPdf("");
            }}
          >
            <img src={cross} alt="cross icon" />
          </button>
        </div>
        {props.query?.Pets.length ? (
          props.query?.Pets?.map((i) => {
            return (
              <div className="linked">
                <span className="form-headings">{i.pet_name}</span>
                <div className="" style={{ display: "flex", flexWrap: "wrap" }}>
                  <span className="badge mrs mts pointer">
                    {" "}
                    {calculateAge(i.dob) || "age unknown"}
                  </span>
                  <span className="badge mrs mts pointer">
                    {i.breed || "Breed not mentioned"}
                  </span>
                  <span className="badge mrs mts pointer">
                    {i.dob || "No dob available"}
                  </span>
                  <span
                    className="badge mrs mts pointer"
                    onClick={() => handleDownload(i)}
                  >
                    DownLoad Docs
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <span className="form-headings">has no Pets to show</span>
        )}
        {pdf
          ? pdf.map((item) => {
              console.log(pdf);
              return (
                <iframe
                  src={
                    item?.key.substring(0, 4) === "http"
                      ? item.key
                      : "https://petsetgostorage.blob.core.windows.net/petsetgo-u2/" +
                        item.key
                  }
                  alt=""
                  height="40px"
                  className="mt-1"
                  style={{ display: "none" }}
                />
              );
            })
          : ""}
      </div>
    </div>
  ) : (
    ""
  );
}
