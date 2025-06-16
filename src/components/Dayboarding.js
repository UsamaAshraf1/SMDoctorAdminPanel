import React from "react";
import Calendar from "react-calendar";
import "../styles/calander.css";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { format } from "date-fns";
import { url } from "../utils/urls.js";

export default function Dayboarding(props) {
  // console.log(props.storeId);
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [storeid, setStoreid] = useState("");
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
  useEffect(() => {
    if (props.storeId) {
      setStoreid(props.storeId);
    }
  }, [props.storeId]);
  // console.log(storeid);
  const [data, setData] = useState([]);
  const [relatedData, setRelatedData] = useState([]);
  const fetchdata = async () => {
    const response = await axios
      .get(
        `${url}/v1/order/dayboarding/get/calender?store_id=${props.storeId}`,
        {
          headers: { authtoken: authToken, sessionid: session_id },
        }
      )
      .catch((err) => console.log(err));
    // console.log(response);
    const resdata = response.data?.data?.orders;
    // console.log(resdata);
    setData(resdata);
    const bothdates = resdata.map((item) => {
      return {
        startDate: format(new Date(item.arrival), "yyyy-MM-dd"),
        endDate: format(new Date(item.checkout), "yyyy-MM-dd"),
      };
    });
    setDates(bothdates);
    console.log(resdata);
  };
  console.log(data);
  useEffect(() => {
    if (props.storeId) {
      setStoreid(props.storeId);
      fetchdata();
    }
    props.setName("Day Boarding");
  }, [storeid]);
  // console.log(dates);

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
    // console.log(data[0].arrival);
    const relatedData = data.filter(
      (item) =>
        format(new Date(value), "yyyy-MM-dd") ===
        format(new Date(item.arrival), "yyyy-MM-dd")
    );
    // console.log(selectedDate.toISOString());
    console.log(relatedData);
    setRelatedData(relatedData);
  };
  return (
    <div className="content">
      <Calendar
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
          {relatedData.length ? (
            relatedData?.map((item, index) => (
              <div className="order" key={index}>
                <span>
                  {item.customer_name} - {item.type} ({item.duration})
                </span>
              </div>
            ))
          ) : (
            <div className="order">
              <span>No Day Boarding orders for this Date</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
