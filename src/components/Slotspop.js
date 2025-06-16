import React from "react";
import { format } from "date-fns";
import "../styles/calander.css";

export default function Slotspop({ trigger, setTrigger, slot }) {
  // Return null if modal is not triggered or no slot is selected
  if (!trigger || !slot) return null;

  // Convert time to 12-hour AM/PM format
  const formatTime = (time) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    const period = hour >= 12 ? "PM" : "AM";
    const adjustedHour = hour % 12 || 12;
    return `${adjustedHour}:${minutes} ${period}`;
  };

  console.log(slot)
  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Slot Details</h3>
        <div className="modal-detail">
          <strong>Date:</strong>{" "}
          {format(new Date(slot.slots[0].date), "dd/MM/yyyy")}
        </div>
        <div className="modal-detail">
          <strong>Time:</strong> {formatTime(slot.slots[0].time)}
        </div>
        <div className="modal-detail">
          <strong>Patient Name:</strong> {slot.patient_name}
        </div>
        <div className="modal-detail">
          <strong>Status:</strong>{" "}
          <span className={getStatusClass(slot.order_status)}>
            {slot.order_status}
          </span>
        </div>
        <button className="modal-close" onClick={() => setTrigger(false)}>
          Close
        </button>
      </div>
    </div>
  );
}

// Function to get CSS class based on order_status
const getStatusClass = (status) => {
  switch (status) {
    case "Pending":
      return "status-pending";
    case "Confirmed":
      return "status-confirmed";
    case "Cancelled":
      return "status-cancelled";
    case "Completed":
      return "status-completed";
    default:
      return "status-default";
  }
};