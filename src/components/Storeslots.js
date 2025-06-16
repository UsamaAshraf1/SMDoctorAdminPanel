import React from "react";
import { useEffect } from "react";
import "../styles/storeslots.css";
import Select from "react-select";
import { toast, ToastContainer } from "react-toastify";
import { format, parseISO, parse } from "date-fns";
import { useState } from "react";
import axios from "axios";
import { url } from "../utils/urls.js";

export default function Storeslots(props) {
  const userData = localStorage.getItem("user");
  const doctorData = JSON.parse(userData);
  const doctorId = doctorData?.data?.id;
  useEffect(() => {
    setStoreid(props.storeId);
    props.setName("Store Slots");
  }, [props.storeId]);
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
  const time = [
    { label: "1 AM", value: "01:00:00" },
    { label: "2 AM", value: "02:00:00" },
    { label: "3 AM", value: "03:00:00" },
    { label: "4 AM", value: "04:00:00" },
    { label: "5 AM", value: "05:00:00" },
    { label: "6 AM", value: "06:00:00" },
    { label: "7 AM", value: "07:00:00" },
    { label: "8 AM", value: "08:00:00" },
    { label: "9 AM", value: "09:00:00" },
    { label: "10 AM", value: "10:00:00" },
    { label: "11 AM", value: "11:00:00" },
    { label: "12 PM", value: "12:00:00" },
    { label: "1 PM", value: "13:00:00" },
    { label: "2 PM", value: "14:00:00" },
    { label: "3 PM", value: "15:00:00" },
    { label: "4 PM", value: "16:00:00" },
    { label: "5 PM", value: "17:00:00" },
    { label: "6 PM", value: "18:00:00" },
    { label: "7 PM", value: "19:00:00" },
    { label: "8 PM", value: "10:00:00" },
    { label: "9 PM", value: "21:00:00" },
    { label: "10 PM", value: "22:00:00" },
    { label: "11 PM", value: "23:00:00" },
    { label: "12 AM", value: "24:00:00" },
  ];
  const [storeid, setStoreid] = useState(null);
  const status = [
    { label: "Enable", value: true },
    { label: "Disable", value: false },
  ];

  const [monday, setMonday] = useState("");
  const [tuesday, setTuesday] = useState("");
  const [wednesday, setWednesday] = useState("");
  const [thursday, setThursday] = useState("");
  const [friday, setFriday] = useState("");
  const [saturday, setSaturday] = useState("");
  const [sunday, setSunday] = useState("");
  const [Doctors, setDoctors] = useState([]);

  const [monDefs, setMonDefs] = useState("");
  const [monDefe, setMonDefe] = useState("");
  const [tueDefs, settueDefs] = useState("");
  const [tueDefe, settueDefe] = useState("");
  const [wedDefs, setwedDefs] = useState("");
  const [wedDefe, setwedDefe] = useState("");
  const [thrDefs, setthrDefs] = useState("");
  const [thrDefe, setthrDefe] = useState("");
  const [friDefs, setfriDefs] = useState("");
  const [friDefe, setfriDefe] = useState("");
  const [satDefs, setsatDefs] = useState("");
  const [satDefe, setsatDefe] = useState("");
  const [sunDefs, setsunDefs] = useState("");
  const [sunDefe, setsunDefe] = useState("");

  const [selectedDoctorId, setSelectedDoctorId] = useState(doctorId);

  const fetchAllDoctors = async () => {
    toast("Fetching doctors, please wait", { progress: true });
    try {
      const authToken = localStorage.getItem("authToken") || "";
      const session_id = localStorage.getItem("session_id") || "";

      const response = await axios.get(`${url}/v1/doctor/get-all`, {
        headers: { authtoken: authToken, sessionid: session_id },
        params: { store_id: props.storeId }, // Include storeId if required
      });

      toast.dismiss();
      const resData = response?.data?.data;
      console.log("Doctors data:", resData);

      if (!Array.isArray(resData)) {
        console.error("Expected an array of doctors, received:", resData);
        toast.error("Invalid data format received");
        setDoctors([]); // Reset state to empty array
        return;
      }

      const doctorOptions = resData.map((doctor) => ({
        value: doctor.id,
        label: doctor.name,
      }));
      setDoctors(doctorOptions);
      // setDoctors(resData); // Update state with fetched doctors
      // toast.success("Doctors fetched successfully");
    } catch (error) {
      toast.dismiss();
      console.error("Fetch doctors error:", error);
      // toast.error(error.response?.data?.error || "Failed to fetch doctors");
      setDoctors([]); // Reset state on error
    }
  };

  useEffect(() => {
    fetchAllDoctors();
  }, []);
  console.log(Doctors);

  const handleDoctorChange = (selectedOption) => {
    const doctorId = selectedOption ? selectedOption.value : "";
    setSelectedDoctorId(doctorId);
    console.log("Selected doctor ID:", doctorId);
  };

  const handlemonday = (e, key) => {
    console.log(e);
    setMonday({
      ...monday,
      [key?.name]: e?.value,
    });
  };
  const handletuesday = (e, key) => {
    console.log(e);
    setTuesday({
      ...tuesday,
      [key?.name]: e?.value,
    });
  };
  const handlewednesday = (e, key) => {
    console.log(e);
    setWednesday({
      ...wednesday,
      [key?.name]: e?.value,
    });
  };
  const handlethursday = (e, key) => {
    console.log(e);
    setThursday({
      ...thursday,
      [key?.name]: e?.value,
    });
  };
  const handlefriday = (e, key) => {
    console.log(e);
    setFriday({
      ...friday,
      [key?.name]: e?.value,
    });
  };
  const handlesaturday = (e, key) => {
    console.log(e);
    setSaturday({
      ...saturday,
      [key?.name]: e?.value,
    });
  };
  const handlesunday = (e, key) => {
    console.log(e);
    setSunday({
      ...sunday,
      [key?.name]: e?.value,
    });
  };

  const handletime = (e, key, value, setValue) => {
    const time = e?.target?.value;
    // console.log(time);
    const parsedTime = parse(time, "HH:mm", new Date());
    const formattedTime = format(parsedTime, "HH:mm:ss");
    // console.log(formattedTime);
    setValue({
      ...value,
      [key?.name || e?.target?.name || key]: formattedTime,
    });
  };

  const [apiData, setApiData] = useState([]);
  console.log(monday);

  const fetchdata = async () => {
    toast("Store Slots loading, please wait", { progress: true });
    try {
      const response = await axios.get(
        `${url}/v1/doctor/get-by-doctor/slots?docId=${selectedDoctorId}`,
        { headers: { authtoken: authToken, sessionid: session_id } }
      );
      toast.dismiss();
      console.log("API response:", response.data.data);

      const resData = response?.data?.data;
      if (!Array.isArray(resData)) {
        console.error("resData is not an array:", resData);
        throw new Error("Invalid API response format");
      }

      // Find data for each day
      const daysData = {
        Monday: resData.find((item) => item.day === "Monday"),
        Tuesday: resData.find((item) => item.day === "Tuesday"),
        Wednesday: resData.find((item) => item.day === "Wednesday"),
        Thursday: resData.find((item) => item.day === "Thursday"),
        Friday: resData.find((item) => item.day === "Friday"),
        Saturday: resData.find((item) => item.day === "Saturday"),
        Sunday: resData.find((item) => item.day === "Sunday"),
      };

      console.log("Days data:", daysData);

      // Set state for each day
      const setDayState = (day, setState) => {
        const data = daysData[day];
        setState({
          day,
          booking_status: data?.booking_status ?? "",
          startTime: data?.startTime ?? "",
          endTime: data?.endTime ?? "",
          doctor_id: selectedDoctorId, // Consistent store_id
        });
      };

      setDayState("Monday", setMonday);
      setDayState("Tuesday", setTuesday);
      setDayState("Wednesday", setWednesday);
      setDayState("Thursday", setThursday);
      setDayState("Friday", setFriday);
      setDayState("Saturday", setSaturday);
      setDayState("Sunday", setSunday);

      // Format times for default values
      const defValues = (time, setValue) => {
        if (!time) {
          setValue("");
          return;
        }
        try {
          const parsedTime = parse(time, "HH:mm:ss", new Date());
          const formattedTime = format(parsedTime, "HH:mm");
          setValue(formattedTime);
        } catch (error) {
          console.error(`Error parsing time ${time}:`, error);
          setValue("");
        }
      };

      // Apply defValues for each day
      Object.entries(daysData).forEach(([day, data]) => {
        if (data) {
          switch (day) {
            case "Monday":
              defValues(data.startTime, setMonDefs);
              defValues(data.endTime, setMonDefe);
              break;
            case "Tuesday":
              defValues(data.startTime, settueDefs);
              defValues(data.endTime, settueDefe);
              break;
            case "Wednesday":
              defValues(data.startTime, setwedDefs);
              defValues(data.endTime, setwedDefe);
              break;
            case "Thursday":
              defValues(data.startTime, setthrDefs);
              defValues(data.endTime, setthrDefe);
              break;
            case "Friday":
              defValues(data.startTime, setfriDefs);
              defValues(data.endTime, setfriDefe);
              break;
            case "Saturday":
              defValues(data.startTime, setsatDefs);
              defValues(data.endTime, setsatDefe);
              break;
            case "Sunday":
              defValues(data.startTime, setsunDefs);
              defValues(data.endTime, setsunDefe);
              break;
            default:
              break;
          }
        }
      });

      setApiData(resData);
    } catch (error) {
      toast.dismiss();
      // toast.error(error.message || "Failed to load slots");
      console.error("Fetch error:", error);

      // Reset states on error
      const resetDay = (day, setState) => {
        setState({
          day,
          booking_status: "",
          startTime: "",
          endTime: "",
          doctor_id: selectedDoctorId,
        });
      };
      resetDay("Monday", setMonday);
      resetDay("Tuesday", setTuesday);
      resetDay("Wednesday", setWednesday);
      resetDay("Thursday", setThursday);
      resetDay("Friday", setFriday);
      resetDay("Saturday", setSaturday);
      resetDay("Sunday", setSunday);
      setApiData([]);
      setMonDefs("");
      setMonDefe("");
      settueDefs("");
      settueDefe("");
      setwedDefs("");
      setwedDefe("");
      setthrDefs("");
      setthrDefe("");
      setfriDefs("");
      setfriDefe("");
      setsatDefs("");
      setsatDefe("");
      setsunDefs("");
      setsunDefe("");
    }
  };
  console.log(apiData);

  // async function handleSubmit(event) {
  //   event.preventDefault();
  //   const formData = {
  //     slots: [monday, tuesday, wednesday, thursday, friday, saturday],
  //   };
  //   console.log(formData);
  //   try {
  //     toast("please wait", {
  //       progress: true,
  //     });
  //     const response = await axios.post(`${url}/v1/doctor/add/slot`, formData, {
  //       headers: {
  //         authtoken: authToken,
  //         sessionid: session_id,
  //         "Content-Type": "application/json",
  //       },
  //     });
  //     if (response) {
  //       toast.dismiss();
  //       toast("Request Send", { type: "success" });
  //       fetchdata();
  //     }
  //   } catch (error) {
  //     toast.dismiss();
  //     toast(error.response.data.error, { type: "error" });
  //     console.error(error);
  //   }
  // }
  async function handleSubmit(event) {
    event.preventDefault();

    const slots = [
      monday,
      tuesday,
      wednesday,
      thursday,
      friday,
      saturday,
      sunday,
    ];
    console.log("Slots to submit:", slots);

    toast("Submitting slots, please wait", { progress: true });

    let allSuccessful = true; // Track if all requests succeed

    // Loop through each slot and make individual API calls
    for (const slot of slots) {
      // Skip empty or invalid slots
      if (!slot.day || !slot.doctor_id) {
        console.warn(
          `Skipping invalid slot for ${slot.day || "unknown"}`,
          slot
        );
        allSuccessful = false;
        toast.error(`Invalid slot data for ${slot.day || "unknown"}`);
        continue;
      }

      try {
        const response = await axios.post(
          `${url}/v1/doctor/add/slot`,
          slot, // Send single slot object
          {
            headers: {
              authtoken: authToken,
              sessionid: session_id,
              "Content-Type": "application/json",
            },
          }
        );

        console.log(
          `Slot for ${slot.day} submitted successfully:`,
          response.data
        );
        // toast.success(`Slot for ${slot.day} added successfully`);
      } catch (error) {
        allSuccessful = false;
        const errorMessage =
          error.response?.data?.error || `Failed to add slot for ${slot.day}`;
        console.error(`Error submitting slot for ${slot.day}:`, error);
        // toast.error(errorMessage);
      }
    }

    toast.dismiss(); // Clear loading toast

    if (allSuccessful) {
      toast.success("All slots added successfully");
    } else {
      toast.error("Some slots failed to add");
    }

    // Refresh data after submission
    try {
      await fetchdata();
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast.error("Failed to refresh slot data");
    }
  }

  useEffect(() => {
    // if (storeid) {
    fetchdata();
    props.setName("Doctor Slots");
    // }
  }, [selectedDoctorId]);
  // console.log(monday);
  const customColor = (baseStyles) => ({
    ...baseStyles,
    height: "48px",
    fontFamily: "Poppins",
  });
  return (
    <>
      <div className="content">
        <label htmlFor="doctor-select">Select Doctor</label>
        <Select
          id="doctor-select"
          options={Doctors}
          value={
            Doctors.find((option) => option.value === selectedDoctorId) || null
          }
          onChange={handleDoctorChange}
          placeholder={"Select a doctor"}
          isClearable
          styles={{ control: customColor }}
          className="field"
          isDisabled="true"
        />
        <div className="center">
          <div className="days">
            <div className="slot-headers">
              <span className="dname">Day</span>
            </div>
            <div className="slot-headers">
              <span className="dname">Start Time</span>
            </div>
            <div className="slot-headers">
              <span className="dname">End Time</span>
            </div>
            <div className="slot-headers">
              <span className="dname">Status</span>
            </div>
          </div>
          <div className="days">
            <div className="day w">
              <span className="dname">Monday</span>
            </div>
            {/* <Select
            key={apiData[0]?.startTime + "s"}
            options={time}
            placeholder="Start Time"
            className="w"
            onChange={handlemonday}
            defaultValue={
              monday?.startTime
                ? {
                    label:
                      format(
                        parseISO(`2022-01-01T${?}`),
                        "h a"
                      ) || "ABC",
                    value: monday.startTime || "ABC",
                  }
                : ""
            }
            id="startTime"
            name="startTime"
            styles={{
              control: customColor,
            }}
          ></Select> */}
            <input
              type="time"
              name="startTime"
              id="startTime"
              step="60"
              defaultValue={monDefs}
              // pattern="hh:mm:ss a"
              placeholder="Store Open"
              onChange={(e, key) => {
                handletime(e, key, monday, setMonday);
              }}
              className="w"
            />
            {/* <Select
            options={time}
            key={apiData[0]?.endTime}
            placeholder="End Time"
            defaultValue={
              monday?.endTime
                ? {
                    label:
                      format(parseISO(`2022-01-01T${monday.endTime}`), "h a") ||
                      "ABC",
                    value: monday.endTime || "ABC",
                  }
                : ""
            }
            className="w"
            onChange={handlemonday}
            id="endTime"
            name="endTime"
            styles={{
              control: customColor,
            }}
          ></Select> */}
            <input
              type="time"
              name="endTime"
              id="endTime"
              step="60"
              defaultValue={monDefe}
              // pattern="hh:mm:ss a"
              placeholder="Store Open"
              onChange={(e, key) => {
                handletime(e, key, monday, setMonday);
              }}
              className="w"
            />
            <Select
              options={status}
              key={apiData[0]?.booking_status}
              placeholder="Status"
              defaultValue={
                monday?.booking_status === true
                  ? {
                      label: "Enable" || "ABC",
                      value: monday.booking_status || "ABC",
                    }
                  : monday?.booking_status === false
                  ? {
                      label: "Disable" || "ABC",
                      value: monday.booking_status || "ABC",
                    }
                  : ""
              }
              onChange={handlemonday}
              id="booking_status"
              name="booking_status"
              className="w"
              styles={{
                control: customColor,
              }}
            ></Select>
          </div>
          <div className="days">
            <div className="day w">
              <span className="dname">Tuesday</span>
            </div>
            {/* <Select
            key={apiData[1]?.startTime + "s"}
            options={time}
            placeholder="Start Time"
            className="w"
            onChange={handletuesday}
            defaultValue={
              tuesday?.startTime
                ? {
                    label:
                      format(
                        parseISO(`2022-01-01T${tuesday.startTime}`),
                        "h a"
                      ) || "ABC",
                    value: tuesday.startTime || "ABC",
                  }
                : ""
            }
            id="startTime"
            name="startTime"
            styles={{
              control: customColor,
            }}
          ></Select>
          <Select
            options={time}
            key={apiData[1]?.endTime}
            placeholder="End Time"
            defaultValue={
              tuesday?.endTime
                ? {
                    label:
                      format(
                        parseISO(`2022-01-01T${tuesday.endTime}`),
                        "h a"
                      ) || "ABC",
                    value: tuesday.endTime || "ABC",
                  }
                : ""
            }
            className="w"
            onChange={handletuesday}
            id="endTime"
            name="endTime"
            styles={{
              control: customColor,
            }}
          ></Select> */}
            <input
              type="time"
              name="startTime"
              id="startTime"
              step="60"
              defaultValue={tueDefs}
              // pattern="hh:mm:ss a"
              placeholder="Store Open"
              onChange={(e, key) => {
                handletime(e, key, tuesday, setTuesday);
              }}
              className="w"
            />
            <input
              type="time"
              name="endTime"
              id="endTime"
              step="60"
              defaultValue={tueDefe}
              // pattern="hh:mm:ss a"
              placeholder="Store Open"
              onChange={(e, key) => {
                handletime(e, key, tuesday, setTuesday);
              }}
              className="w"
            />
            <Select
              options={status}
              key={apiData[1]?.booking_status}
              placeholder="Status"
              defaultValue={
                tuesday?.booking_status === true
                  ? {
                      label: "Enable" || "ABC",
                      value: tuesday.booking_status || "ABC",
                    }
                  : tuesday?.booking_status === false
                  ? {
                      label: "Disable" || "ABC",
                      value: tuesday.booking_status || "ABC",
                    }
                  : ""
              }
              onChange={handletuesday}
              id="booking_status"
              name="booking_status"
              className="w"
              styles={{
                control: customColor,
              }}
            ></Select>
          </div>
          <div className="days">
            <div className="day w">
              <span className="dname">Wednesday</span>
            </div>
            {/* <Select
            key={apiData[2]?.startTime + "s"}
            options={time}
            placeholder="Start Time"
            className="w"
            onChange={handlewednesday}
            defaultValue={
              wednesday?.startTime
                ? {
                    label:
                      format(
                        parseISO(`2022-01-01T${wednesday.startTime}`),
                        "h a"
                      ) || "ABC",
                    value: wednesday.startTime || "ABC",
                  }
                : ""
            }
            id="startTime"
            name="startTime"
            styles={{
              control: customColor,
            }}
          ></Select>
          <Select
            options={time}
            key={apiData[2]?.endTime}
            placeholder="End Time"
            defaultValue={
              wednesday?.endTime
                ? {
                    label:
                      format(
                        parseISO(`2022-01-01T${wednesday.endTime}`),
                        "h a"
                      ) || "ABC",
                    value: wednesday.endTime || "ABC",
                  }
                : ""
            }
            className="w"
            onChange={handlewednesday}
            id="endTime"
            name="endTime"
            styles={{
              control: customColor,
            }}
          ></Select> */}
            <input
              type="time"
              name="startTime"
              id="startTime"
              step="60"
              defaultValue={wedDefs}
              // pattern="hh:mm:ss a"
              placeholder="Store Open"
              onChange={(e, key) => {
                handletime(e, key, wednesday, setWednesday);
              }}
              className="w"
            />
            <input
              type="time"
              name="endTime"
              id="endTime"
              step="60"
              defaultValue={wedDefe}
              // pattern="hh:mm:ss a"
              placeholder="Store Open"
              onChange={(e, key) => {
                handletime(e, key, wednesday, setWednesday);
              }}
              className="w"
            />
            <Select
              options={status}
              key={apiData[2]?.booking_status}
              placeholder="Status"
              defaultValue={
                wednesday?.booking_status === true
                  ? {
                      label: "Enable" || "ABC",
                      value: wednesday.booking_status || "ABC",
                    }
                  : wednesday?.booking_status === false
                  ? {
                      label: "Disable" || "ABC",
                      value: wednesday.booking_status || "ABC",
                    }
                  : ""
              }
              onChange={handlewednesday}
              id="booking_status"
              name="booking_status"
              className="w"
              styles={{
                control: customColor,
              }}
            ></Select>
          </div>

          <div className="days">
            <div className="day w">
              <span className="dname">Thursday</span>
            </div>
            {/* <Select
            key={apiData[3]?.startTime + "s"}
            options={time}
            placeholder="Start Time"
            className="w"
            onChange={handlethursday}
            defaultValue={
              thursday?.startTime
                ? {
                    label:
                      format(
                        parseISO(`2022-01-01T${thursday.startTime}`),
                        "h a"
                      ) || "ABC",
                    value: thursday.startTime || "ABC",
                  }
                : ""
            }
            id="startTime"
            name="startTime"
            styles={{
              control: customColor,
            }}
          ></Select>
          <Select
            options={time}
            key={apiData[3]?.endTime}
            placeholder="End Time"
            defaultValue={
              thursday?.endTime
                ? {
                    label:
                      format(
                        parseISO(`2022-01-01T${thursday.endTime}`),
                        "h a"
                      ) || "ABC",
                    value: thursday.endTime || "ABC",
                  }
                : ""
            }
            className="w"
            onChange={handlethursday}
            id="endTime"
            name="endTime"
            styles={{
              control: customColor,
            }}
          ></Select> */}
            <input
              type="time"
              name="startTime"
              id="startTime"
              step="60"
              defaultValue={thrDefs}
              // pattern="hh:mm:ss a"
              placeholder="Store Open"
              onChange={(e, key) => {
                handletime(e, key, thursday, setThursday);
              }}
              className="w"
            />
            <input
              type="time"
              name="endTime"
              id="endTime"
              step="60"
              defaultValue={thrDefe}
              // pattern="hh:mm:ss a"
              placeholder="Store Open"
              onChange={(e, key) => {
                handletime(e, key, thursday, setThursday);
              }}
              className="w"
            />
            <Select
              options={status}
              key={apiData[3]?.booking_status}
              placeholder="Status"
              defaultValue={
                thursday?.booking_status === true
                  ? {
                      label: "Enable" || "ABC",
                      value: thursday.booking_status || "ABC",
                    }
                  : thursday?.booking_status === false
                  ? {
                      label: "Disable" || "ABC",
                      value: thursday.booking_status || "ABC",
                    }
                  : ""
              }
              onChange={handlethursday}
              id="booking_status"
              name="booking_status"
              className="w"
              styles={{
                control: customColor,
              }}
            ></Select>
          </div>

          <div className="days">
            <div className="day w">
              <span className="dname">Friday</span>
            </div>
            {/* <Select
            key={apiData[4]?.startTime + "s"}
            options={time}
            placeholder="Start Time"
            className="w"
            onChange={handlefriday}
            defaultValue={
              friday?.startTime
                ? {
                    label:
                      format(
                        parseISO(`2022-01-01T${friday.startTime}`),
                        "h a"
                      ) || "ABC",
                    value: friday.startTime || "ABC",
                  }
                : ""
            }
            id="startTime"
            name="startTime"
            styles={{
              control: customColor,
            }}
          ></Select>
          <Select
            options={time}
            key={apiData[4]?.endTime}
            placeholder="End Time"
            defaultValue={
              friday?.endTime
                ? {
                    label:
                      format(parseISO(`2022-01-01T${friday.endTime}`), "h a") ||
                      "ABC",
                    value: friday.endTime || "ABC",
                  }
                : ""
            }
            className="w"
            onChange={handlefriday}
            id="endTime"
            name="endTime"
            styles={{
              control: customColor,
            }}
          ></Select> */}
            <input
              type="time"
              name="startTime"
              id="startTime"
              step="60"
              defaultValue={friDefs}
              // pattern="hh:mm:ss a"
              placeholder="Store Open"
              onChange={(e, key) => {
                handletime(e, key, friday, setFriday);
              }}
              className="w"
            />
            <input
              type="time"
              name="endTime"
              id="endTime"
              step="60"
              defaultValue={friDefe}
              // pattern="hh:mm:ss a"
              placeholder="Store Open"
              onChange={(e, key) => {
                handletime(e, key, friday, setFriday);
              }}
              className="w"
            />
            <Select
              options={status}
              key={apiData[4]?.booking_status}
              placeholder="Status"
              defaultValue={
                friday?.booking_status === true
                  ? {
                      label: "Enable" || "ABC",
                      value: friday.booking_status || "ABC",
                    }
                  : friday?.booking_status === false
                  ? {
                      label: "Disable" || "ABC",
                      value: friday.booking_status || "ABC",
                    }
                  : ""
              }
              onChange={handlefriday}
              id="booking_status"
              name="booking_status"
              className="w"
              styles={{
                control: customColor,
              }}
            ></Select>
          </div>

          <div className="days">
            <div className="day w">
              <span className="dname">Saturday</span>
            </div>
            {/* <Select
            key={apiData[5]?.startTime + "s"}
            options={time}
            placeholder="Start Time"
            className="w"
            onChange={handlesaturday}
            defaultValue={
              saturday?.startTime
                ? {
                    label:
                      format(
                        parseISO(`2022-01-01T${saturday.startTime}`),
                        "h a"
                      ) || "ABC",
                    value: saturday.startTime || "ABC",
                  }
                : ""
            }
            id="startTime"
            name="startTime"
            styles={{
              control: customColor,
            }}
          ></Select>
          <Select
            options={time}
            key={apiData[5]?.endTime}
            placeholder="End Time"
            defaultValue={
              saturday?.endTime
                ? {
                    label:
                      format(
                        parseISO(`2022-01-01T${saturday.endTime}`),
                        "h a"
                      ) || "ABC",
                    value: saturday.endTime || "ABC",
                  }
                : ""
            }
            className="w"
            onChange={handlesaturday}
            id="endTime"
            name="endTime"
            styles={{
              control: customColor,
            }}
          ></Select> */}
            <input
              type="time"
              name="startTime"
              id="startTime"
              step="60"
              defaultValue={satDefs}
              // pattern="hh:mm:ss a"
              placeholder="Store Open"
              onChange={(e, key) => {
                handletime(e, key, saturday, setSaturday);
              }}
              className="w"
            />
            <input
              type="time"
              name="endTime"
              id="endTime"
              step="60"
              defaultValue={satDefe}
              // pattern="hh:mm:ss a"
              placeholder="Store Open"
              onChange={(e, key) => {
                handletime(e, key, saturday, setSaturday);
              }}
              className="w"
            />
            <Select
              options={status}
              key={apiData[5]?.booking_status}
              placeholder="Status"
              defaultValue={
                saturday?.booking_status === true
                  ? {
                      label: "Enable" || "ABC",
                      value: saturday.booking_status || "ABC",
                    }
                  : saturday?.booking_status === false
                  ? {
                      label: "Disable" || "ABC",
                      value: saturday.booking_status || "ABC",
                    }
                  : ""
              }
              onChange={handlesaturday}
              id="booking_status"
              name="booking_status"
              className="w"
              styles={{
                control: customColor,
              }}
            ></Select>
          </div>

          <div className="days">
            <div className="day w">
              <span className="dname">Sunday</span>
            </div>
            {/* <Select
            key={apiData[6]?.startTime + "s"}
            options={time}
            placeholder="Start Time"
            className="w"
            onChange={handlesunday}
            defaultValue={
              sunday?.startTime
                ? {
                    label:
                      format(
                        parseISO(`2022-01-01T${sunday.startTime}`),
                        "h a"
                      ) || "ABC",
                    value: sunday.startTime || "ABC",
                  }
                : ""
            }
            id="startTime"
            name="startTime"
            styles={{
              control: customColor,
            }}
          ></Select>
          <Select
            options={time}
            key={apiData[6]?.endTime}
            placeholder="End Time"
            defaultValue={
              sunday?.endTime
                ? {
                    label:
                      format(parseISO(`2022-01-01T${sunday.endTime}`), "h a") ||
                      "ABC",
                    value: sunday.endTime || "ABC",
                  }
                : ""
            }
            className="w"
            onChange={handlesunday}
            id="endTime"
            name="endTime"
            styles={{
              control: customColor,
            }}
          ></Select> */}
            <input
              type="time"
              name="startTime"
              id="startTime"
              step="60"
              defaultValue={sunDefs}
              // pattern="hh:mm:ss a"
              placeholder="Store Open"
              onChange={(e, key) => {
                handletime(e, key, sunday, setSunday);
              }}
              className="w"
            />
            <input
              type="time"
              name="endTime"
              id="endTime"
              step="60"
              defaultValue={sunDefe}
              // pattern="hh:mm:ss a"
              placeholder="Store Open"
              onChange={(e, key) => {
                handletime(e, key, sunday, setSunday);
              }}
              className="w"
            />
            <Select
              options={status}
              key={apiData[6]?.booking_status}
              placeholder="Status"
              defaultValue={
                sunday?.booking_status === true
                  ? {
                      label: "Enable" || "ABC",
                      value: sunday.booking_status || "ABC",
                    }
                  : sunday?.booking_status === false
                  ? {
                      label: "Disable" || "ABC",
                      value: sunday.booking_status || "ABC",
                    }
                  : ""
              }
              onChange={handlesunday}
              id="booking_status"
              name="booking_status"
              className="w"
              styles={{
                control: customColor,
              }}
            ></Select>
          </div>
          <div className="days" style={{ marginTop: "25px" }}>
            <button className="w s-btn" style={{ backgroundColor: "#FFFFFF" }}>
              Cancel
            </button>
            <button className="w day s-btn" onClick={handleSubmit}>
              Update
            </button>
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  );
}
