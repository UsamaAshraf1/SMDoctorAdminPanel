import React, { useEffect, useState } from "react";
import cross from "../assets/cross.png";
import Select from "react-select";
import { toast } from "react-toastify";
import axios from "axios";
import { format } from "date-fns";
import { url } from "../utils/urls.js";

export default function CouponUpdate(props) {
  console.log(props.preData);
  const types = [
    { label: "Percentage", value: "percentage" },
    { label: "Fixed", value: "fixed" },
  ];
  const levels = [
    { label: "Single Store", value: "single store" },
    { label: "All Stores", value: "all stores" },
  ];
  const [stores, setStores] = useState([]);
  const [defaultStore, setDefaultStore] = useState({
    label: "",
    value: null,
  });
  // console.log(defaultStore);
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
  // console.log(coupon);
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
  const handleCouponChange = (e, key) => {
    setCoupon({
      ...coupon,
      [key?.name || e?.target?.name || key]:
        e?.value || e?.target?.files?.[0] || e?.target?.value || "",
    });
  };
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
    setDefaultStore({
      label: "",
      value: null,
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
      .get(`${url}/v1/admin/get/sellers`, {
        headers: { authtoken: authToken, sessionid: session_id },
      })
      .catch((err) => console.log(err));
    if (response.data.data) {
      const resdata = response.data.data;
      const id = props?.preData?.store_id;
      const store = resdata.find((item) => id === item.store.sid);
      if (store) {
        setDefaultStore({
          label: store.store.store_name,
          value: store.store.sid,
        });
      }
      const storesArray = resdata?.map((item) => {
        return { label: item.store?.store_name, value: item.store?.sid };
      });
      setStores(storesArray);
    }
  };

  useEffect(() => {
    setCoupon({
      couponsCode: props?.preData?.couponsCode ? props.preData.couponsCode : "",
      type: props?.preData?.type ? props.preData.type : "",
      level: props?.preData?.level ? props.preData.level : "",
      limit: props?.preData?.limit ? props.preData.limit : 0,
      rate: props?.preData?.rate ? props.preData.rate : "",
      startDateTime: props?.preData?.startDateTime
        ? format(new Date(props.preData.startDateTime), "yyyy-MM-dd")
        : "",
      endDateTime: props?.preData?.endDateTime
        ? format(new Date(props.preData.endDateTime), "yyyy-MM-dd")
        : "",
      discountCap: props?.preData?.discountCap ? props.preData.discountCap : 0,
      store_id: props?.preData?.store_id ? props.preData.store_id : null,
    });
    fetchdata();
  }, [props]);

  const customColor = (baseStyles) => ({
    ...baseStyles,
    backgroundColor: "rgba(239, 241, 249, 0.6)",
    minHeight: "42px",
  });
  return props.trigger ? (
    <div className="popup">
      <div className="popup-content">
        <div className="popup-header">
          <div className="popup-heading">Update Discount Coupon</div>
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
                defaultValue={
                  props.preData?.type
                    ? {
                        label: props.preData?.type,
                        value: props.preData.type,
                      }
                    : ""
                }
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
                defaultValue={
                  props.preData?.level
                    ? {
                        label: props.preData?.level,
                        value: props.preData.level,
                      }
                    : ""
                }
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
                type="date"
                name="startDateTime"
                id="startDateTime"
                placeholder=""
                onChange={handleCouponChange}
                value={coupon.startDateTime}
                className="popfield"
              />
              <input
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
              key={defaultStore.value}
              defaultValue={defaultStore}
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
              // onClick={handleSubmit}
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
