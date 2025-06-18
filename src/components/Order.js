import React, { useEffect, useMemo, useState } from "react";
import Form from "react-bootstrap/Form";
import "../styles/order.css";
import "../styles/modal.css"; // New CSS file for modal styles
import personicon from "../assets/personicon.png";
import foldericon from "../assets/foldericon.png";
import { FormCheck } from "react-bootstrap";
import { COLUMNS_ORDER_BOOKING } from "../utils/Col";
import { usePagination, useTable, useSortBy } from "react-table";
import { useLocation } from "react-router-dom";
import { format, parse } from "date-fns";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import backicon from "../assets/back.png";
import { url } from "../utils/urls";
import axios from "axios";

const orderStatusList = [
  "Pending Payment",
  "Processing",
  "Out For Delivery",
  "Completed",
  "Failed",
  "Cancel Request",
];
const actions = orderStatusList.map((e, index) => (
  <option key={index}>{e}</option>
));
const action = (
  <select
    name=""
    id=""
    className="card-btn"
    style={{
      backgroundColor: "rgba(94, 99, 102, 0.08)",
      color: "#8B8D97",
    }}
    disabled
  >
    {actions}
  </select>
);

const RescheduleModal = ({ isOpen, onClose, data, setVlaue }) => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedSlot, setSelectedSlot] = useState("");
  const [DoctorSlots, setDoctorSlots] = useState([]);

  const getDoctorSlots = async () => {
    try {
      const response = await axios.get(
        `${url}/v1/doctor/get-slot-by-date?docId=${data?.cart?.doctor_id}&date=${selectedDate}`
      );
      setDoctorSlots(response?.data?.slots);
    } catch (error) {
      setDoctorSlots([]);
      console.error("Failed to Status update:", error);
    }
  };

  useEffect(() => {
    getDoctorSlots();
  }, [selectedDate]);

  console.log(DoctorSlots);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSlot) {
      toast.error("Please select a time slot");
      return;
    }
    try {
      const response = await axios.post(`${url}/v1/order/reschedule-slot`, {
        order_id: data?.order_id,
        delete_slot_id: data?.cart?.slotReservations[0]?.slot_reservation_id,
        doctor_id: data?.cart?.doctor_id,
        slotTiming: selectedSlot,
        slotDate: selectedDate,
        slotDay: DoctorSlots?.day,
      });
      toast.success("Reshedule Done");
      setVlaue("Reschedule");
      onClose();
    } catch (error) {
      console.error("Failed to reschedule:", error);
      toast.error("Failed to reschedule");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`modal-backdrop-new ${isOpen ? "modal-backdrop-new--open" : ""}`}
      onClick={onClose}
    >
      <div
        className={`modal-panel-new ${isOpen ? "modal-panel-new--open" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content-new">
          <div className="modal-header">
            <h2 className="modal-title">Reschedule Appointment</h2>
            <button onClick={onClose} className="modal-close">
              <svg
                className="modal-close-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="modal-field">
                <label className="chead">Select Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="ctext w-full border border-gray-300 rounded-md p-2 mt-1"
                  required
                />
              </div>

              <div className="modal-field" style={{ marginTop: "20px" }}>
                <label className="chead">Available Slots</label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {DoctorSlots?.slots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      className={`slot-button ctext ${
                        selectedSlot === slot[0] ? "slot-button--selected" : ""
                      }`}
                      onClick={() => setSelectedSlot(slot[0])}
                    >
                      {slot[0]}
                    </button>
                  ))}
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "end",
                  gap: "10px",
                  marginTop: "10px",
                }}
              >
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    padding: "10px 20px",
                    background: "gray",
                    borderRadius: "10px",
                    border: "none",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "10px 20px",
                    background: "#3498db",
                    borderRadius: "10px",
                    border: "none",
                  }}
                >
                  Reschedule
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default function Order() {
  const navigate = useNavigate();
  const location = useLocation();
  const [presviosData, setPreviousData] = useState(
    location.state ? location.state?.data : null
  );
  const [orderData, setOrderData] = useState(
    presviosData?.cart?.slotReservations?.length > 0
      ? presviosData?.cart?.slotReservations
      : presviosData?.cart?.ServiceReservations || []
  );
  const [orderStatus, setOrderStatus] = useState(presviosData?.order_status);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // Debug: Log presviosData to check its structure
  useEffect(() => {
    console.log("presviosData:", presviosData);
  }, [presviosData]);

  // Process orderData
  useEffect(() => {
    if (orderData) {
      orderData.forEach((item) => {
        item.total_single =
          item.price * item.quantity - (item.discount_price || 0);
        item.action = action;
      });
      setOrderData([...orderData]);
    }
  }, [orderData]);

  const data = useMemo(() => orderData, [orderData]);
  const columns = useMemo(() => COLUMNS_ORDER_BOOKING, []);
  const tableinstance = useTable({ columns, data }, useSortBy, usePagination);
  const { getTableProps, getTableBodyProps, headerGroups, page, prepareRow } =
    tableinstance;

  const toggleModal = () => {
    console.log("Toggling modal, current state:", isModalOpen);
    setIsModalOpen((prev) => !prev);
  };

  const formatBookingDate = (date) => {
    try {
      return date ? format(new Date(date), "dd MMM yyyy") : "N/A";
    } catch (error) {
      console.error("Error formatting booking date:", error);
      return "N/A";
    }
  };

  const formatBookingTime = (time) => {
    try {
      return time
        ? format(parse(time, "HH:mm:ss", new Date()), "h:mm a")
        : "N/A";
    } catch (error) {
      console.error("Error formatting booking time:", error);
      return "N/A";
    }
  };

  const updateOrderStatus = async () => {
    try {
      const response = await axios.post(`${url}/v1/order/update`, {
        order_id: presviosData?.order_id,
        status: orderStatus,
      });

      toast.success("Status updated");
    } catch (error) {
      console.error("Failed to Status update:", error);
      toast.error("Failed to Status update");
    }
  };

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setOrderStatus(newStatus);
    if (newStatus === "Reschedule") {
      setIsNewModalOpen(true);
    }
  };

  useEffect(() => {
    if (
      orderStatus !== presviosData?.order_status &&
      orderStatus !== "Reschedule"
    ) {
      updateOrderStatus();
    }
  }, [orderStatus]);

  const slotTimeString = orderData[0]?.slotTiming;
  const currentTime = new Date();
  const [hours, minutes, seconds] = slotTimeString.split(":").map(Number);
  const slotTime = new Date(currentTime);
  slotTime.setHours(hours, minutes, seconds, 0);

  return (
    <div>
      <div className="order-content">
        <div className="order-header">
          <div
            className="header-div"
            style={{ display: "flex", alignItems: "center", gap: "16px" }}
          >
            <button className="back-btn" onClick={() => navigate(-1)}>
              <img src={backicon} alt="back" className="back-icon" />
            </button>
            <div className="oheader">
              <span className="order-heading">Order Number</span>
              <span className="head-value">
                {presviosData?.orderID || "N/A"}
              </span>
            </div>
            <div className="oheader">
              <span className="order-heading">Order Date</span>
              <span className="head-value">
                {presviosData?.createdAt
                  ? format(
                      new Date(presviosData.createdAt),
                      "dd MMM yyyy h:mm a"
                    )
                  : "N/A"}
              </span>
            </div>
          </div>
          <div className="header-div">
            <div
              name=""
              id=""
              className="mark"
              style={{
                backgroundColor: "black",
                color: "white",
                paddingBottom: "10px",
              }}
            >
              <select
                value={orderStatus}
                onChange={handleStatusChange}
                style={{
                  backgroundColor: "black",
                  color: "white",
                  padding: "5px",
                  border: "none",
                  outline: "none",
                }}
                disabled={
                  orderStatus === "Completed" || orderStatus === "Cancelled"
                }
              >
                <option value="pending">Pending</option>
                {presviosData?.cart?.location === "At Home" && (
                  <>
                    <option value="Doctor Enroute">Doctor Enroute</option>
                    <option value="Doctor Arrived">Doctor Arrived</option>
                    <option value="Visit Started">Visit Started</option>
                  </>
                )}
                <option value="Reschedule">Reschedule</option>
                <option value="Completed">Completed</option>
                {currentTime < slotTime && (
                  <option value="Cancelled">Cancelled</option>
                )}
                <option value="No Show">No Show</option>
              </select>
            </div>
          </div>
        </div>
        <div className="order-body">
          <div className="cards">
            <div className="card">
              <div
                className="ctop"
                style={{ display: "flex", alignItems: "center", gap: "16px" }}
              >
                <div className="card-iconholder">
                  <img
                    src={personicon}
                    alt="personicon"
                    className="card-icon"
                  />
                </div>
                <div className="ccustomer">
                  <span className="chead modal-trigger" onClick={toggleModal}>
                    {presviosData?.customer?.first_name || "Unknown Customer"}
                  </span>
                </div>
              </div>

              {/* <div>
                Booking Date:{" "}
                {presviosData?.cart?.slotReservations[0]?.slotDate} <br/>
                Booking Time:{" "}
                {presviosData?.cart?.slotReservations[0]?.slotTiming}
              </div> */}
              <div className="modal-field">
                <span className="chead">Booking Date</span>
                <span className="ctext">
                  {formatBookingDate(
                    presviosData?.cart?.slotReservations?.[0]?.slotDate
                  )}
                </span>
                <span className="chead">Booking Time</span>
                <span className="ctext">
                  {formatBookingTime(
                    presviosData?.cart?.slotReservations?.[0]?.slotTiming
                  )}
                </span>
              </div>
            </div>
          </div>
          {/* <div className="order-table-div">
            <div className="tab-header">
              <span className="table-heading table-heading-bg">
                Booking Items{" "}
                <span style={{ fontWeight: 600 }}>
                  {orderData?.length || 0}
                </span>
              </span>
            </div>
            <table
              {...getTableProps()}
              className="order-table"
              style={{ width: "100%" }}
            >
              <thead>
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th
                        {...column.getHeaderProps(
                          column.getSortByToggleProps()
                        )}
                        className="order-table-head order-table-row ctext"
                      >
                        {column.render("Header")}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {page.map((row) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()} className="tr">
                      {row.cells.map((cell) => (
                        <td
                          {...cell.getCellProps()}
                          className="order-table-row chead"
                        >
                          {cell.render("Cell")}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div> */}
          <div
            className="content-footer"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <div
              className="footer-left"
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <div className="footer-card">
                <div
                  className="footer-ctop"
                  style={{ display: "flex", alignItems: "center", gap: "16px" }}
                >
                  <div className="card-iconholder">
                    <img
                      src={foldericon}
                      alt="foldericon"
                      className="card-icon"
                    />
                  </div>
                </div>
                <div className="cbottem">
                  <div className="btm-part">
                    <span className="chead">Payment Method</span>
                    <span className="ctext">
                      {presviosData?.paymentType || "N/A"}
                    </span>
                  </div>
                  <div className="btm-part">
                    <span className="chead">Refund</span>
                    <span className="ctext">
                      AED {presviosData?.refund_price?.toFixed(2) || "0.00"}
                    </span>
                  </div>
                  <div className="btm-part">
                    <span className="chead">Deduct Amount</span>
                    <span className="ctext">
                      AED {presviosData?.total_price?.toFixed(2) || "0.00"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="footer-card">
                <div className="order-trail">
                  <span className="chead">Order Trail</span>
                  {presviosData?.order_trails
                    ?.sort(
                      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
                    )
                    .map((item, index) => (
                      <span
                        className="ctext"
                        key={index}
                        style={{ display: "block" }}
                      >
                        {format(new Date(item.createdAt), "h:mm a ")}
                        {item.status}
                      </span>
                    )) || <span className="ctext">No trail available</span>}
                </div>
              </div>
            </div>
            <div className="footer-right">
              <div className="total-card">
                <div
                  className="order-total"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <span
                    className="total-row"
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span className="chead">Item Sub Total:</span>
                    <span className="ctext">
                      AED{" "}
                      {(
                        (presviosData?.sub_price || 0) +
                        (presviosData?.redeemablePoint || 0)
                      ).toFixed(2)}
                    </span>
                  </span>
                  <span
                    className="total-row"
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span className="chead">VAT:</span>
                    <span className="ctext">
                      AED {presviosData?.vat_price?.toFixed(2) || "0.00"}
                    </span>
                  </span>
                  {presviosData?.redeemablePoint ? (
                    <span
                      className="total-row"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span className="chead">Redeem Points:</span>
                      <span className="ctext">
                        {presviosData.redeemablePoint.toFixed(2)}
                      </span>
                    </span>
                  ) : null}
                  <span
                    className="total-row"
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span className="chead">Order Total:</span>
                    <span className="ctext">
                      AED {presviosData?.total_price?.toFixed(2) || "0.00"}
                    </span>
                  </span>
                  <span
                    className="total-row"
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span className="chead">Paid:</span>
                    <span className="ctext">
                      AED {presviosData?.total_price?.toFixed(2) || "0.00"}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Details Modal */}
      <div
        className={`modal-backdrop ${
          isModalOpen ? "modal-backdrop--open" : ""
        }`}
        onClick={toggleModal}
      >
        <div
          className={`modal-panel ${isModalOpen ? "modal-panel--open" : ""}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Customer Details</h2>
              <button onClick={toggleModal} className="modal-close">
                <svg
                  className="modal-close-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <div className="modal-field">
                <span className="chead">Full Name</span>
                <p className="ctext">
                  {presviosData?.customer?.first_name
                    ? `${presviosData.customer.first_name} ${
                        presviosData.customer.last_name || ""
                      }`.trim()
                    : "No Name"}
                </p>
              </div>
              <div className="modal-field">
                <span className="chead">Phone</span>
                <p className="ctext">
                  {presviosData?.customer?.phone || "No Phone"}
                </p>
              </div>
              <div className="modal-field">
                <span className="chead">Email</span>
                <p className="ctext">
                  {presviosData?.customer?.email || "No Email"}
                </p>
              </div>
              <div className="modal-field">
                <span className="chead">Address</span>
                <p className="ctext">
                  {presviosData?.customer?.address || "No Address"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <RescheduleModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        data={presviosData}
        setVlaue={setOrderStatus}
      />

      <ToastContainer />
    </div>
  );
}
