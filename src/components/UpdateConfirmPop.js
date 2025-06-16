import React from "react";
import cross from "../assets/cross.png";

export default function UpdateConfirmPop(props) {
  function empty() {
    props.setTrigger(false);
  }
  return props.trigger ? (
    <div className="popup">
      <div className="popup-content">
        <div className="popup-header">
          <div className="popup-heading">{props?.heading}</div>
          <button
            className="icon-btn"
            onClick={() => {
              //   props.setPopupDelete(false);
              empty();
            }}
          >
            <img src={cross} alt="cross icon" />
          </button>
        </div>
        <div>
          <div>
            <span>{props?.message}</span>
          </div>
          <div className="seller-btns">
            <button
              className="seller-cancel seller-btn"
              onClick={() => {
                empty();
              }}
            >
              Cancel
            </button>
            <button
              className="seller-save seller-btn"
              onClick={(e) => props.handle(e)}
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : (
    ""
  );
}
