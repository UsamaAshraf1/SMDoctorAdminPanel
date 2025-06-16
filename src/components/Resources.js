import React from "react";
import Calendar from "react-calendar";
import "../styles/calander.css";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import Select from "react-select";
import { format } from "date-fns";
import { set } from "date-fns/esm";
import Slotspop from "./Slotspop";
import { url } from "../utils/urls.js";

export default function Dayboarding(props) {
  const [popup, setPopup] = useState(false);
  // console.log(props.sellerId);
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
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [sellerid, setSellerid] = useState();
  // console.log(sellerid);
  const [data, setData] = useState([]);
  const [resource, setResource] = useState([]);
  const [resId, setResId] = useState("");
  const [storeid, setStoreid] = useState("");
  useEffect(() => {
    if (props.storeId) {
      setStoreid(props.storeId);
    }
    fetchResource();
    props.setName("Resources");
  }, [props.storeId]);

  const fetchResource = async () => {
    const response = await axios
      .get(`${url}/v1/seller/resources/get?seller_id=${props.sellerId}`, {
        headers: { authtoken: authToken, sessionid: session_id },
      })
      .catch((err) => {
        console.log(err);
        setResource([]);
        setData([]);
      });
    setData([]);
    const resdata = response.data.data;
    console.log(resdata);
    const resArray = resdata.map((item) => {
      if (item.role === "Normal Appointment") {
        return {
          label: item.name,
          value: item.resource_id,
        };
      }
    });
    const filtArray = resArray.filter((val) => val !== undefined);
    setResource(filtArray);
  };
  // const options = filtArray.map((e, index) => (
  //   <option key={index} value={e.value}>
  //     {e.label}
  //   </option>
  // ));
  const handleStore = (e) => {
    console.log(e.value);
    const dropvalue = e.value;
    setResId(dropvalue);
  };
  const fetchdata = async () => {
    const response = await axios
      .get(
        `${url}/v1/store/slots/videocall/calender?resource_id=${resId}&store_id=${storeid}`,
        {
          headers: { authtoken: authToken, sessionid: session_id },
        }
      )
      .catch((err) => {
        console.log(err);
        setData([]);
      });
    const resdata = response.data.days;
    console.log(resdata);
    setData(resdata);
  };
  // console.log(data);
  useEffect(() => {
    if (resId) {
      fetchdata();
    }
  }, [resId]);

  const renderDot = ({ date }) => {
    return dates.map((item, index) => {
      // console.log(item.startDate);
      if (format(new Date(date), "yyyy-MM-dd") == item.startDate) {
        // console.log(item);
        return (
          <div
            key={index}
            style={{
              height: 6,
              width: 6,
              backgroundColor: " green",
              borderRadius: "50%",
            }}
          />
        );
      }
    });
  };
  const handleClick = (value) => {
    setSelectedDate(value);
  };
  const relatedData = data[selectedDate.toString()] || {};

  return (
    <div className="content">
      <div className="resource-drop">
        {/* <select
          className="store-name"
          onChange={handleStore}
          style={{ width: 180 }}
          defaultValue="0"
        >
          <option disabled value="0">
            Select Resource
          </option>
          {options}
        </select> */}
        <Select
          placeholder="Select Resource"
          options={resource}
          onChange={handleStore}
        />
      </div>
      {/* <Calendar
        tileContent={renderDot}
        onChange={handleClick}
        value={selectedDate}
      />
      <div className="orders">
        <div className="order-date">
          <div>{format(new Date(selectedDate), "EEE")}</div>
          <div>{format(new Date(selectedDate), "dd")}</div>
        </div>
        <div className="order-details">
          {data.length ? (
            data?.map((item, index) => (
              <div className="order" key={index}>
                <span>
                  {item.customer_name} - {item.type} ({item.duration})
                </span>
              </div>
            ))
          ) : (
            <div className="order">
              <span>No resource orders</span>
            </div>
          )}
        </div> 
        </div> */}
      <div className="slots">
        {data.map((item, index) =>
          item.data ? (
            <div key={index} className="Slot-headers">
              <div>{item.date}</div>
              <div>{item.day}</div>
              {item.data?.slots?.map((item, index) => (
                <div
                  key={index}
                  className="slot"
                  onClick={(e) => console.log(item)}
                >
                  {item.start}
                </div>
              ))}
            </div>
          ) : (
            ""
          )
        )}
        <Slotspop trigger={popup} setTrigger={setPopup} />
      </div>
    </div>
  );
}
