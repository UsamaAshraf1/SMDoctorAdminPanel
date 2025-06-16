import React from "react";
import cross from "../assets/cross.png";
import { useState } from "react";
import { useEffect } from "react";

export default function RelocPop(props) {
  const [preData, setPreData] = useState("");
  useEffect(() => {
    setPreData(props.preData);
  }, [props]);
  return props.trigger ? (
    <div className="popup">
      <div className="popup-content">
        <div className="popup-header">
          <div className="popup-heading">Relocation Details</div>
          <button className="icon-btn" onClick={() => props.setTrigger(false)}>
            <img src={cross} alt="cross icon" />
          </button>
        </div>
        <div className="pop-inputs">
          <div className="linkedpop">
            <span className="form-headings">Relocation Request ID</span>
            <input
              type="text"
              className="popfield"
              placeholder="e.g PSG560IJK"
              defaultValue={preData?.requestID}
            />
          </div>
          <div className="linkedpop">
            <span className="form-headings">Name</span>
            <input
              type="text"
              className="popfield"
              placeholder="e.g Salah"
              defaultValue={preData?.Pet?.customer?.first_name}
            />
          </div>
          <div className="linkedpop">
            <span className="form-headings">Pet Name</span>
            <input
              type="text"
              className="popfield"
              placeholder="e.g Boss"
              defaultValue={preData.Pet?.pet_name}
            />
          </div>
          <div className="linkedpop">
            <span className="form-headings">Email</span>
            <input
              type="text"
              className="popfield"
              placeholder="e.g pet@Gmail.com"
              defaultValue={preData.email}
            />
          </div>
          <div className="linkedpop">
            <span className="form-headings"> Relocation Dates</span>
          </div>
          <div className="form-row">
            <input
              type="text"
              name="product_id"
              id="product_id"
              placeholder="Start Date"
              defaultValue={preData.from_date}
              className="popfield"
            />
            <input
              type="text"
              name="barcode"
              id="barcode"
              placeholder="End Date"
              defaultValue={preData.to_date}
              className="popfield"
            />
          </div>
          <div className="linkedpop">
            <span className="form-headings">From - To</span>
          </div>
          <div className="form-row">
            <input
              type="text"
              name="product_id"
              id="product_id"
              defaultValue={preData.relocation_from}
              placeholder="e.g Dubai"
              className="popfield"
            />
            <input
              type="text"
              name="barcode"
              id="barcode"
              defaultValue={preData.relocation_to}
              placeholder="e.g USA"
              className="popfield"
            />
          </div>
          <div className="linkedpop">
            <span className="form-headings">Additional info</span>
            <input
              type="text"
              className="popfield"
              placeholder="e.g test info"
              defaultValue={preData.additional_info}
            />
          </div>
        </div>
      </div>
    </div>
  ) : (
    ""
  );
}
