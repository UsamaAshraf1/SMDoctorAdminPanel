import React from "react";
import cross from "../assets/cross.png";

export default function Askpop(props) {
  console.log(props.query);
  return props.trigger ? (
    <div className="popup">
      <div className="popup-content">
        <div className="popup-header">
          <div className="popup-heading"></div>
          <button className="icon-btn" onClick={() => props.setTrigger(false)}>
            <img src={cross} alt="cross icon" />
          </button>
        </div>
        <div className="seller-inputs">
          <div className="linked">
            <span className="form-headings">Store Name</span>
            <input
              type="text"
              className="field"
              placeholder="Store Name"
              value={props.query?.Seller?.store?.store_name}
            />
          </div>
          <div className="linked">
            <span className="form-headings">Subject</span>
            <input
              type="text"
              className="field"
              placeholder="Subject Line"
              value={props.query?.title}
            />
          </div>
          <div className="linked">
            <span className="form-headings">Message</span>
            <textarea
              type="text"
              className="field description"
              placeholder="Message Box"
              value={props.query?.desc}
            />
          </div>
        </div>
      </div>
    </div>
  ) : (
    ""
  );
}
