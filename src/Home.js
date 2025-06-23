import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Select from "react-select";
import "./styles/navbar.css";
import bellicon from "./assets/bell.png";
import avatar from "./assets/avatar.png";
import woodmark from "./assets/Logo.svg";
import logo from "./assets/Logo.svg";
import union from "./assets/union.png";
import Bag from "./assets/Bag.png";
import sellers from "./assets/sellers.png";
import service from "./assets/service.png";
import catog from "./assets/catog.png";
import slots from "./assets/slots.png";
import customer from "./assets/customer.png";
import calendar from "./assets/calendar.png";
import Folder from "./assets/Folder.png";
import headphone from "./assets/headphone.png";
import transic from "./assets/transic.png";
import Couponsicon from "./assets/coupons.png";
import dashboard from "./assets/dashboard.png";
import logouticon from "./assets/Logout.png";
import contactIcon from "./assets/contact.png";
import departmentIcon from "./assets/department.png";
import doctorIcon from "./assets/doctor.png";
import packages from "./assets/packages.png"
import reloc from "./assets/reloc.png";
import { set } from "date-fns";
import { Calendar } from "react-calendar";
import { url } from "./utils/urls";

export default function Home(props) {
  const [trigger, setTrigger] = useState(false);
  let navigator = useNavigate();
  const [store, setStore] = useState([]);
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

  const fetchdata = async () => {
    const response = await axios
      .get(`${url}/v1/admin/get/sellers`, {
        headers: { authtoken: authToken, sessionid: session_id },
      })
      .catch((err) => console.log(err));
    const resdata = response.data.data;
    // console.log(resdata);
    // console.log(resdata[0].suid);
    props.setStoreId(resdata[0]?.store?.sid);
    props.setSellerId(resdata[0]?.suid);
    setStore(resdata);
  };
  useEffect(() => {
    fetchdata();
  }, []);
  const storesArray = store?.map((item) => item.store?.store_name);
  const stores = storesArray.filter((val) => val !== undefined);
  // console.log(stores);
  stores.sort();
  const options = stores.map((e, index) => (
    <option key={index} value={e}>
      {e}
    </option>
  ));
  // console.log(store);
  const handleStore = (e) => {
    e.preventDefault();
    const dropvalue = e.target.value;
    const storeData = store.find((item) => item.store.store_name === dropvalue);
    // console.log(storeData);
    const id = storeData.store.sid;
    // console.log(id);
    props.setSellerId(storeData.suid);
    props.setStoreId(id);
  };
  // console.log(stores);
  return (
    <div
    // onClick={() => {
    //   if (trigger) {
    //     setTrigger(false);
    //   }
    // }}
    >
      <div className="topbar">
        <div className="top-menu">
          <div>
            <span className="page-heading">{props.name}</span>
          </div>
          <div className="profile">
            {/* <div className="prof-btns">
              <div>
                <select
                  className="store-name"
                  onChange={handleStore}
                  style={{ width: 280 }}
                >
                  {options}
                </select>
              </div>
            </div> */}
            {/* <div className="icon circle">
              <img src={bellicon} alt="icon" className="bell-icon" />
            </div>
            <div className="avatar circle">
              <img src={avatar} alt="pfimage" className="avatar-img" />
            </div> */}
          </div>
        </div>
      </div>
      <div className="sidebar">
        <div className="woodmark-navbar">
          <img src={logo} alt="logoimage-navbar" className="logo-navbar" />
        </div>
        <div className="navigation">
          <ul className="nav-list">
            {props.role === "admin" ? (
              <>
                {" "}
                <li
                  className={
                    props.name === "Dashboard" ||
                    props.name === "Carousels" ||
                    props.name === "All Orders"
                      ? "focused"
                      : ""
                  }
                >
                  <NavLink to="/" className="big-font">
                    <div className="nav-icon">
                      <img src={dashboard} alt="union-icon" className="icon" />
                    </div>
                    <span>Dashboard</span>
                  </NavLink>
                </li>
                <li className={props.name === "Appointmants" ? "focused" : ""}>
                  <NavLink to="/orders" className="big-font bar-link">
                    <div className="nav-icon">
                      <img src={Bag} alt="union-icon" className="icon" />
                    </div>
                    <span>Appointmants</span>
                  </NavLink>
                </li>
                {/* <li
                  className={
                    props.name === "Customers" ||
                    props.name === "Pet Profiles" ||
                    props.name === "Pet Profile"
                      ? "focused"
                      : ""
                  }
                >
                  <NavLink to="customers" className="big-font">
                    <div className="nav-icon">
                      <img src={customer} alt="union-icon" className="icon" />
                    </div>
                    <span>Customers</span>
                  </NavLink>
                </li> */}
                {/* <li className={props.name === "Products" ? "focused" : ""}>
                  <NavLink to="/products" className="big-font bar-link">
                    <div className="nav-icon">
                      <img src={Folder} alt="union-icon" className="icon" />
                    </div>
                    <span>Products</span>
                  </NavLink>
                </li> */}
                {/* <li className={props.name === "Services" ? "focused" : ""}>
                  <NavLink to="/services" className="big-font">
                    <div className="nav-icon">
                      <img src={service} alt="union-icon" className="icon" />
                    </div>
                    <span>Services</span>
                  </NavLink>
                </li> */}
                {/* <li className={props.name === "Department" ? "focused" : ""}>
                  <NavLink to="/Department" className="big-font">
                    <div className="nav-icon">
                      <img
                        src={departmentIcon}
                        alt="union-icon"
                        className="icon"
                      />
                    </div>
                    <span>Department</span>
                  </NavLink>
                </li> */}
                <li className={props.name === "Profile" ? "focused" : ""}>
                  <NavLink to="/doctors_detail" className="big-font">
                    <div className="nav-icon">
                      <img src={doctorIcon} alt="union-icon" className="icon" />
                    </div>
                    <span>Profile</span>
                  </NavLink>
                </li>
                {/* <li className={props.name === "service_package" ? "focused" : ""}>
                  <NavLink to="/service_package" className="big-font">
                    <div className="nav-icon">
                      <img src={packages} alt="union-icon" className="icon" />
                    </div>
                    <span>Service Packages</span>
                  </NavLink>
                </li> */}
                {/* <li className={props.name === "Sellers" ? "focused" : ""}>
                  <NavLink to="/sellers" className="big-font">
                    <div className="nav-icon">
                      <img src={sellers} alt="union-icon" className="icon" />
                    </div>
                    <span>Seller and Store</span>
                  </NavLink>
                </li> */}
                <li className={props.name === "Doctor Slots" ? "focused" : ""}>
                  <NavLink to="store-slots" className="big-font bar-link">
                    <div className="nav-icon">
                      <img src={slots} alt="union-icon" className="icon" />
                    </div>
                    <span>Doctor Slots</span>
                  </NavLink>
                </li>
                <li className={props.name === "Slots" ? "focused" : ""}>
                  <NavLink to="/slots" className="big-font bar-link">
                    <div className="nav-icon">
                      <img src={slots} alt="union-icon" className="icon" />
                    </div>
                    <span>Calender</span>
                  </NavLink>
                </li>
                {/* <li
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    trigger ? setTrigger(false) : setTrigger(true);
                  }}
                  className={
                    props.name === "Day Boarding"
                      ? "focused nav-item"
                      : props.name === "Resources"
                      ? "focused nav-item"
                      : props.name === "Slots"
                      ? "focused nav-item"
                      : "nav-item"
                  }
                >
                  <div className="nav-icon">
                    <img src={calendar} alt="union-icon" className="icon" />
                  </div>
                  <div className="">
                    <span className="">Calendar</span>
                    {trigger ? (
                      <ul className="" style={{ listStyleType: "none" }}>
                        <li className="bar-link">
                          <NavLink
                            to="/dayboarding"
                            className="big-font bar-link"
                          >
                            <div className="nav-icon">
                              <img
                                src={calendar}
                                alt="union-icon"
                                className="icon"
                              />
                            </div>
                            <span>Day Boarding</span>
                          </NavLink>
                        </li>
                        <li className="bar-link">
                          <NavLink
                            to="/resources"
                            className="big-font bar-link"
                          >
                            <div className="nav-icon">
                              <img
                                src={calendar}
                                alt="union-icon"
                                className="icon"
                              />
                            </div>
                            <span>Resources</span>
                          </NavLink>
                        </li>
                        <li className="bar-link">
                          <NavLink to="/slots" className="big-font bar-link">
                            <div className="nav-icon">
                              <img
                                src={calendar}
                                alt="union-icon"
                                className="icon"
                              />
                            </div>
                            <span>Slots</span>
                          </NavLink>
                        </li>
                      </ul>
                    ) : (
                      ""
                    )}
                  </div>
                </li> */}
                {/* <li className={props.name === "Transactions" ? "focused" : ""}>
                  <NavLink to="transactions" className="big-font bar-link">
                    <div className="nav-icon">
                      <img src={transic} alt="union-icon" className="icon" />
                    </div>
                    <span>Transactions</span>
                  </NavLink>
                </li>
                <li className={props.name === "Coupons" ? "focused" : ""}>
                  <NavLink to="coupons" className="big-font bar-link">
                    <div className="nav-icon">
                      <img
                        src={Couponsicon}
                        alt="union-icon"
                        className="icon"
                      />
                    </div>
                    <span>Discount Coupons</span>
                  </NavLink>
                </li> */}
                {/* <li className={props.name === "Contact" ? "focused" : ""}>
                  <NavLink to="Contact" className="big-font bar-link">
                    <div className="nav-icon">
                      <img
                        src={contactIcon}
                        alt="union-icon"
                        className="icon"
                      />
                    </div>
                    <span>Inquiry</span>
                  </NavLink>
                </li> */}
              </>
            ) : (
              <li
                className={
                  props.name === "Dashboard" ||
                  props.name === "Carousels" ||
                  props.name === "All Orders"
                    ? "focused"
                    : ""
                }
              >
                <NavLink to="/" className="big-font">
                  <div className="nav-icon">
                    <img src={dashboard} alt="union-icon" className="icon" />
                  </div>
                  <span>Dashboard</span>
                </NavLink>
              </li>
            )}
          </ul>
        </div>
        <div className="logout-div">
          <ul className="nav-list" style={{ gap: "5px" }}>
            {props.role === "admin" ? (
              <>
                {" "}
                {/* <li
                  className={
                    props.name === "Ask Admin"
                      ? "bar-link focused"
                      : "bar-link adminask"
                  }
                >
                  <NavLink to="relocations" className="big-font bar-link">
                    <div className="nav-icon">
                      <img src={reloc} alt="union-icon" className="icon" />
                    </div>
                    <span>Pet Relocation</span>
                  </NavLink>
                </li>
                <li
                  className={
                    props.name === "Ask Admin"
                      ? "bar-link focused"
                      : "bar-link adminask"
                  }
                >
                  <NavLink to="ask-admin" className="big-font bar-link">
                    <div className="nav-icon">
                      <img src={headphone} alt="union-icon" className="icon" />
                    </div>
                    <span>Ask the Admin</span>
                  </NavLink>
                </li> */}
              </>
            ) : (
              ""
            )}
            <li
              className="nav-item logout"
              onClick={() => {
                props.setLogin(false);
                localStorage.removeItem("login");
                navigator("/");
              }}
            >
              <div className="nav-icon">
                <img src={logouticon} alt="union-icon" className="icon" />
              </div>
              <span>Logout</span>
            </li>
          </ul>
          {/* <button
            className="logout-button"
            onClick={() => {
              props.setLogin(false);
              localStorage.removeItem("login");
              navigator("/");
            }}
          >
            <img src={logouticon} alt="" />
            Logout
          </button> */}
        </div>
      </div>
      <Outlet context={fetchdata}></Outlet>
    </div>
  );
}
