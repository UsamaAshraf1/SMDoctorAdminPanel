import React, { useState } from "react";
import cross from "../assets/cross.png";
import Select from "react-select";
import { toast } from "react-toastify";
import axios from "axios";
import { url } from "../utils/urls.js";
import { useEffect } from "react";

export default function Couponpop(props) {
  const types = [
    { label: "Percentage", value: "percentage" },
    { label: "Fixed", value: "fixed" },
  ];
  const levels = [
    { label: "Single Store", value: "Single Store" },
    { label: "All Stores", value: "All Stores" },
  ];
  const [stores, setStores] = useState([]);
  const [coupon, setCoupon] = useState({
    couponsCode: "",
    type: "",
    level: "",
    limit: 0,
    rate: "",
    startDateTime: "",
    endDateTime: "",
    discountCap: 0,
    store_id: null,
  });

  console.log(coupon?.store_id);
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
  const empty = () => {
    setCoupon({
      couponsCode: "",
      type: "",
      level: "",
      limit: 0,
      rate: "",
      startDateTime: "",
      endDateTime: "",
      discountCap: 0,
      store_id: null,
    });
  };
  const handleCouponChange = (e, key) => {
    setCoupon({
      ...coupon,
      [key?.name || e?.target?.name || key]:
        e?.value || e?.target?.files?.[0] || e?.target?.value || "",
    });
  };
  async function handleSubmit(event) {
    event.preventDefault();
    const formData = coupon;
    console.log(formData);
    try {
      toast("please wait", {
        progress: true,
      });
      const response = await axios.post(
        `${url}/v1/admin/create/coupons`,
        formData,
        {
          headers: {
            authtoken: authToken,
            sessionid: session_id,
            "Content-Type": "application/json",
          },
        }
      );
      if (response) {
        toast.dismiss();
        toast("Request Send", { type: "success" });
        empty();
        props.setTrigger(false);
        props.fetchdata();
      }
    } catch (error) {
      toast.dismiss();
      toast(error.response.data.error, { type: "error" });
      console.error(error);
    }
  }

  const fetchdata = async () => {
    const response = await axios
      .get(`${url}/v1/department/get/all`, {
        headers: { authtoken: authToken, sessionid: session_id },
      })
      .catch((err) => console.log(err));
    if (response) {
      const resdata = response.data.data;
      console.log(resdata);
      const storesArray = resdata?.map((item) => {
        return { label: item.store?.store_name, value: item.store?.sid };
      });
      setStores(storesArray);
    }
  };

  useEffect(() => {
    fetchdata();
  }, []);

  const customColor = (baseStyles) => ({
    ...baseStyles,
    backgroundColor: "rgba(239, 241, 249, 0.6)",
    minHeight: "42px",
  });
  return props.trigger ? (
    <div className="popup">
      <div className="popup-content">
        <div className="popup-header">
          <div className="popup-heading">Create Discount Coupon</div>
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

        <form onSubmit={handleSubmit} className="pop-inputs">
          <div className="linkedpop">
            <span className="form-headings half">Coupon Code</span>
            <input
              required
              type="text"
              name="couponsCode"
              id="couponsCode"
              placeholder="e.g PSG01"
              onChange={handleCouponChange}
              value={coupon.couponsCode}
              className="popfield"
            />
          </div>
          <div className="linkedpop">
            <div className="form-row">
              <span className="form-headings half">Type</span>
              <span className="form-headings half">Rate</span>
            </div>
            <div className="form-row">
              <Select
                styles={{
                  control: customColor,
                }}
                options={types}
                type="text"
                name="type"
                id="type"
                // value={coupon.type}
                onChange={handleCouponChange}
                // placeholder="e.g PSG100A"
                className="popSelect"
              />
              <input
                type="text"
                name="rate"
                id="rate"
                placeholder="e.g 1%"
                onChange={handleCouponChange}
                value={coupon.rate}
                className="popfield"
              />
            </div>
          </div>
          <div className="linkedpop">
            <div className="form-row">
              <span className="form-headings half">Level</span>
              <span className="form-headings half">Per User Limit</span>
            </div>
            <div className="form-row">
              <Select
                styles={{
                  control: customColor,
                }}
                options={levels}
                type="text"
                name="level"
                id="level"
                // value={coupon.level}
                onChange={handleCouponChange}
                // placeholder="e.g PSG100A"
                className="popSelect"
              />
              <input
                type="text"
                name="limit"
                id="limit"
                placeholder="e.g 10"
                onChange={handleCouponChange}
                value={coupon.limit || ""}
                className="popfield"
              />
            </div>
          </div>
          <div className="linkedpop">
            <div className="form-row">
              <span className="form-headings half">Start Date</span>
              <span className="form-headings half">End Date</span>
            </div>
            <div className="form-row">
              <input
                required
                type="date"
                name="startDateTime"
                id="startDateTime"
                placeholder=""
                onChange={handleCouponChange}
                value={coupon.startDateTime}
                className="popfield"
              />
              <input
                required
                type="date"
                name="endDateTime"
                id="endDateTime"
                placeholder=""
                onChange={handleCouponChange}
                value={coupon.endDateTime}
                className="popfield"
              />
            </div>
          </div>
          <div className="linkedpop">
            <span className="form-headings">Select Store</span>
            <Select
              styles={{
                control: customColor,
              }}
              // isMulti
              options={stores}
              type="text"
              name="store_id"
              id="store_id"
              onChange={handleCouponChange}
              // placeholder="e.g PSG100A"
              className="popSelect"
            />
          </div>
          <div className="linkedpop">
            <span className="form-headings ">Discount Cap</span>
            <input
              type="text"
              name="discountCap"
              id="discountCap"
              placeholder="e.g 100AED"
              onChange={handleCouponChange}
              value={coupon.discountCap || ""}
              className="popfield"
            />
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
              type="submit"
              style={{ height: "40px", padding: "10px" }}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  ) : (
    ""
  );
}
