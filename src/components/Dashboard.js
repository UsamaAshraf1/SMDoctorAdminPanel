import React, { useState } from "react";
import "./../styles/dashboard.css";
import graph from "./../assets/Graph.png";
import bagdash from "./../assets/bagdash.png";
import folderdash from "./../assets/folderdash.png";
import orderdash from "./../assets/orderdash.png";
import { useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { url } from "../utils/urls.js";
// import Pushpop from "./Pushpop";
// axios.defaults.withCredentials = true;

export default function Dashboard(props) {
  const userData = localStorage.getItem("user");
  const doctorData = JSON.parse(userData);
  const doctorId = doctorData?.data?.id;
  console.log(props);
  const nav = useNavigate();
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
  const [recentOrd, setRecentOrd] = useState([]);
  const [popup, setPopup] = useState(false);
  // console.log("authToken :" + authToken);

  const fetchdata = async () => {
    toast("loading please wait", {
      progress: true,
    });
    // const headids = JSON.stringify({
    //   headers: { authtoken: authToken, session_id: session_id },
    // });
    const response = await axios.get(
      `${url}/v1/order/doctor/get?doctor_id=${doctorId}`,

      {
        headers: { authtoken: authToken, sessionid: session_id },
      }
    );
    console.log(response);
    if (response) {
      toast.dismiss();
      // toast(error.response?.data?.error || "Request failed", {
      //   type: "error",
      // });
      console.log("ddd", response?.data);
      setRecentOrd(response?.data?.data);
    }
  };
  const handlelocalStorage = () => {
    const token = localStorage.getItem("authToken");
    const sess_id = localStorage.getItem("session_id");
    setAuthToken(token);
    setSession_id(sess_id);
  };
  // console.log(recentOrd);
  useEffect(() => {
    // handlelocalStorage();
    fetchdata();
    // if (authToken && session_id) {
    //   fetchdata();
    // }
    props.setName("Dashboard");
  }, [authToken && session_id]);

  const notifScreen = (
    <div className="content dashboard-content">
      <div className="top">
        <div className="add-link">
          <div className="tab" style={{ backgroundColor: "rgb(33, 163, 76)" }}>
            <button
              className="cat-popup page-big-headings"
              style={{ backgroundColor: "rgb(33, 163, 76)" }}
              onClick={() => {
                // setPopup(true);
                nav("/notifications");
              }}
            >
              Push Notifications
            </button>
            <span className="med-font">Send Push Notifications to users</span>
          </div>
        </div>
      </div>
    </div>
  );

  return props.role === "admin" ? (
    <div className="content dashboard-content">
      {/* <Pushpop trigger={popup} setTrigger={setPopup} /> */}
      <div className="top">
        {/* <div className="add-link">
          <div className="tab" style={{ backgroundColor: "grey" }}>
            <button
              className="cat-popup page-big-headings"
              style={{ backgroundColor: "grey", color: "white" }}
              onClick={() => {
                nav("/carousels");
                // console.log("hello");
              }}
            >
              Manage Carousels
            </button>
            <span className="med-font" style={{ color: "white" }}>
              Manage mobile main screen carousels
            </span>
          </div>
        </div>
        <div className="add-link">
          <div className="tab" style={{ backgroundColor: "grey" }}>
            <button
              className="cat-popup page-big-headings"
              style={{ backgroundColor: "grey", color: "white" }}
              onClick={() => {
                // setPopup(true);
                nav("/notifications");
              }}
            >
              Push Notifications
            </button>
            <span className="med-font" style={{ color: "white" }}>
              Send Push Notifications to users
            </span>
          </div>
        </div> */}
        {/* <div className="add-link">
          <div className="tab" style={{ backgroundColor: "rgba(61, 162, 218, .9)" }}>
            <button
              className="cat-popup page-big-headings"
              style={{ backgroundColor: "rgba(61, 162, 218, .9)", color: "white" }}
              onClick={() => {
                nav("/allorders");
                // console.log("hello");
              }}
            >
              All Store Orders
            </button>
            <span className="med-font" style={{ color: "white" }}>
              Orders from All Stores
            </span>
          </div>
        </div> */}
      </div>
      {/* <div className="top">
        <div className="top-left-card">
          <div className="c-left-top">
            <div className="child">
              <img src={graph}></img>
            </div>
            <div className="child">
              <select name="" id="" className="dashselect">
                <option value="1">This Week</option>
              </select>
            </div>
          </div>
          <div className="c-left-bottm">
            <div className="child child-b">
              <span className="s-heading">Sales</span>
              <span className="s-values">AED 0.00</span>
            </div>
            <div className="child child-b">
              <span className="s-heading">Orders</span>
              <span className="s-values">0</span>
            </div>
          </div>
        </div>
        <div className="top-right-card">
          <div className="c-left-top">
            <div className="child">
              <img src={bagdash}></img>
            </div>
            <div className="child">
              <select name="" id="" className="dashselect">
                <option value="1">This Week</option>
              </select>
            </div>
          </div>
          <div className="c-left-bottm">
            <div className="child child-b">
              <span className="s-heading">All Orders</span>
              <span className="s-values">0</span>
            </div>
            <div className="child child-b">
              <span className="s-heading">Pending</span>
              <span className="s-values">0</span>
            </div>
            <div className="child child-b">
              <span className="s-heading">Completed</span>
              <span className="s-values">0</span>
            </div>
          </div>
        </div>
      </div> */}
      <div className="down">
        {/* <div className="down-left-card">
          <div className="c-left-top">
            <div className="child">
              <img src={folderdash}></img>
            </div>
          </div>
          <div className="c-left-bottm">
            <div className="child child-b">
              <span className="s-heading">All Products</span>
              <span className="s-values">0</span>
            </div>
            <div className="child child-b">
              <span className="s-heading">Active</span>
              <span className="s-values">0</span>
            </div>
          </div>
        </div> */}
        {recentOrd.length ? (
          <div className="down-orders">
            <span className="s-values">Recent Orders</span>
            {recentOrd?.map((item, index) => (
              <div className="recent-order" key={index}>
                <div className="recent-order-child">
                  <span className="s-heading">
                    {item?.orderID ? item?.orderID : ""}
                  </span>
                  <span className="s-heading" style={{ color: "#A6A8B1" }}>
                    {item?.createdAt
                      ? format(new Date(item?.createdAt), "dd MMM yyyy h:mm a")
                      : ""}
                  </span>
                </div>

                <div className="recent-order-child">
                  <span className="s-values">Price</span>
                  <span className="s-values">Payment Status</span>
                </div>

                <div className="recent-order-child">
                  <span className="s-values">
                    {item?.total_price ? item?.total_price.toFixed(2) : ""}
                  </span>
                  {item.order_status ? (
                    <div
                      style={{
                        backgroundColor:
                          item.order_status === "Completed"
                            ? " #D1FAE5"
                            : item.order_status === "Cancel Request"
                            ? "#FEE2E2"
                            : item.order_status === "Pending"
                            ? "#FFD580"
                            : item.order_status === "Reschedule"
                            ? "#ADD8E6"
                            : item.order_status === "Out For Delivery"
                            ? "#D1F2EB"
                            : item.order_status === "Replacement"
                            ? "#E5E8E8"
                            : item.order_status === "Cancelled"
                            ? "#FEE2E2"
                            : "#FEF3C7",
                        borderRadius: 10,
                        padding: 6,
                        paddingLeft: 20,
                        paddingRight: 20,
                        textAlign: "center",
                        color:
                          item.order_status === "Completed"
                            ? " #065F46"
                            : item.order_status === "Cancel Request"
                            ? "#991B1B"
                            : item.order_status === "Pending"
                            ? "Orange"
                            : item.order_status === "Reschedule"
                            ? "blue"
                            : item.order_status === "Out For Delivery"
                            ? "#1ABC9C"
                            : item.order_status === "Replacement"
                            ? "#99A3A4"
                            : item.order_status === "Cancelled"
                            ? "#991B1B"
                            : "#92400E",
                      }}
                    >
                      {item.order_status === "Completed" ? (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <div
                            style={{
                              height: 6,
                              width: 6,
                              backgroundColor: "#065F46",
                              borderRadius: 50,
                            }}
                          />
                          <span>Completed</span>
                        </div>
                      ) : item.order_status === "Cancel Request" ? (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <div
                            style={{
                              height: 6,
                              width: 6,
                              backgroundColor: "#991B1B",
                              borderRadius: 50,
                            }}
                          />
                          <span>Cancel Request</span>
                        </div>
                      ) : item.order_status === "Pending" ? (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <div
                            style={{
                              height: 6,
                              width: 6,
                              backgroundColor: "Orange",
                              borderRadius: 50,
                            }}
                          />
                          <span>Pending</span>
                        </div>
                      ) : item.order_status === "Reschedule" ? (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <div
                            style={{
                              height: 6,
                              width: 6,
                              backgroundColor: "blue",
                              borderRadius: 50,
                            }}
                          />
                          <span>Reschedule</span>
                        </div>
                      ) : item.order_status === "Out For Delivery" ? (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <div
                            style={{
                              height: 6,
                              width: 6,
                              backgroundColor: "#1ABC9C",
                              borderRadius: 50,
                            }}
                          />
                          <span>Out For Delivery</span>
                        </div>
                      ) : item.order_status === "Replacement" ? (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <div
                            style={{
                              height: 6,
                              width: 6,
                              backgroundColor: "#99A3A4",
                              borderRadius: 50,
                            }}
                          />
                          <span>Replacement</span>
                        </div>
                      ) : item.order_status === "Processing" ? (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <div
                            style={{
                              height: 6,
                              width: 6,
                              backgroundColor: "#92400E",
                              borderRadius: 50,
                            }}
                          />
                          <span>Processing</span>
                        </div>
                      ) : item.order_status === "Cancelled" ? (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <div
                            style={{
                              height: 6,
                              width: 6,
                              backgroundColor: "#991B1B",
                              borderRadius: 50,
                            }}
                          />
                          <span>Cancelled</span>
                        </div>
                      ) : (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <div
                            style={{
                              height: 6,
                              width: 6,
                              backgroundColor: "#92400E",
                              borderRadius: 50,
                            }}
                          />
                          <span>In progress</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                <div className="recent-order-child">
                  <span className="s-heading">
                    {item.cart?.store?.store_name
                      ? item.cart?.store?.store_name
                      : ""}
                  </span>
                  <span className="s-heading">
                    {item.cart?.customer?.first_name
                      ? item.cart.customer.first_name
                      : ""}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="down-right-card">
            <div className="c-left-top">
              <div className="child">
                <span className="s-values">Recent Orders</span>
              </div>
            </div>
            <div className="c-down-bottm">
              <div className="recent">
                <div>
                  <img src={orderdash}></img>
                </div>
                <span className="s-values">No Orders Yet</span>
              </div>
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  ) : (
    notifScreen
  );
}
