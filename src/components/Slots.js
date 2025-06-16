import React, { useEffect, useState } from "react";
import "../styles/calander.css";
import axios from "axios";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  addMonths,
  subMonths,
} from "date-fns";
// import Slotspop from "./Slotspop";
import Slotspop from "./Slotspop.js";
import { url } from "../utils/urls.js";

export default function Slots(props) {
  const userData = localStorage.getItem("user");
  const doctorData = JSON.parse(userData);
  const doctorId = doctorData?.data?.id;
  const [authToken, setAuthToken] = useState(
    localStorage.getItem("authToken") || ""
  );
  const [session_id, setSession_id] = useState(
    localStorage.getItem("session_id") || ""
  );
  const [storeid, setStoreid] = useState("");
  const [data, setData] = useState([]);
  const [popup, setPopup] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null); // Store selected slot
  const [currentDate, setCurrentDate] = useState(new Date(2025, 4, 1)); // Default to May 2025

  const fetchdata = async (year, month) => {
    try {
      const response = await axios.get(
        `${url}/v1/order/doctor/monthly?doctor_id=${doctorId}&year=${year}&month=${month}`,
        {
          headers: { authtoken: authToken, sessionid: session_id },
        }
      );
      const resdata = response.data?.data || [];
      setData(resdata);
      console.log(resdata);
    } catch (err) {
      console.log("Error fetching data:", err);
    }
  };

  useEffect(() => {
    if (props.storeId) {
      setStoreid(props.storeId);
    }
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // API month is 1-based
    fetchdata(year, month);
    props.setName("Slots");
  }, [props.storeId, currentDate]);

  // Group slots by date
  const groupedByDate = data.reduce((acc, item) => {
    const slotDate = item.slots[0]?.date;
    if (slotDate) {
      if (!acc[slotDate]) {
        acc[slotDate] = [];
      }
      acc[slotDate].push(item);
    }
    return acc;
  }, {});

  // Generate calendar days for the current month
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const firstDayOfWeek = getDay(monthStart);

  // Create calendar grid with padding for days before the 1st
  const calendarDays = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarDays.push(null);
  }
  daysInMonth.forEach((day) => calendarDays.push(day));

  // Group days into weeks (arrays of 7)
  const weeks = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }

  // Navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

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

  // Handle slot click to show modal
  const handleSlotClick = (slot) => {
    setSelectedSlot(slot);
    setPopup(true);
  };

  return (
    <div className="content">
      <div className="calendar">
        <div className="calendar-header">
          <button onClick={handlePrevMonth}>Previous</button>
          <h2>{format(currentDate, "MMMM yyyy")}</h2>
          <button onClick={handleNextMonth}>Next</button>
        </div>
        <div className="calendar-grid">
          {/* Weekday headers */}
          <div className="weekday-header">Sun</div>
          <div className="weekday-header">Mon</div>
          <div className="weekday-header">Tue</div>
          <div className="weekday-header">Wed</div>
          <div className="weekday-header">Thu</div>
          <div className="weekday-header">Fri</div>
          <div className="weekday-header">Sat</div>

          {/* Calendar days */}
          {weeks.map((week, weekIndex) =>
            week.map((day, dayIndex) => (
              <div
                key={`${weekIndex}-${dayIndex}`}
                className={`calendar-day ${
                  day && groupedByDate[format(day, "yyyy-MM-dd")]
                    ? "booked"
                    : ""
                }`}
              >
                {day ? (
                  <>
                    <div className="day-number">{format(day, "d")}</div>
                    {groupedByDate[format(day, "yyyy-MM-dd")]
                      ?.sort((a, b) =>
                        a.slots[0].time.localeCompare(b.slots[0].time)
                      )
                      .map((item, idx) => (
                        <div
                          key={idx}
                          className="slot"
                          onClick={() => handleSlotClick(item)}
                        >
                          <div>
                            {(() => {
                              const [hours, minutes] =
                                item.slots[0].time.split(":");
                              const hour = parseInt(hours, 10);
                              const period = hour >= 12 ? "PM" : "AM";
                              const adjustedHour = hour % 12 || 12;
                              return `${adjustedHour}:${minutes} ${period} (${item.patient_name})`;
                            })()}
                          </div>
                          <div className={getStatusClass(item.order_status)}>
                            {item.order_status}
                          </div>
                        </div>
                      ))}
                  </>
                ) : null}
              </div>
            ))
          )}
        </div>
        <Slotspop trigger={popup} setTrigger={setPopup} slot={selectedSlot} />
      </div>
    </div>
  );
}
