import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
// import { useTable } from "react-table";
import "../styles/addforms.css";
import cross from "../assets/cross.png";
import Newresources from "./Newresources";
import { COLUMNS_RESOURCES } from "../utils/Col.js";
import imageicon from "../assets/Imageicon.png";
import { useTable } from "react-table";
import { useLocation, useNavigate } from "react-router-dom";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import Select from "react-select";

import plusicon from "../assets/plus.png";
import Resources from "./Resources";

import { toast, ToastContainer } from "react-toastify";
import { add, format, parse } from "date-fns";
import backicon from "../assets/back.png";
import { Fade } from "react-bootstrap";
import DeletePop from "./DeletePop";
import { useOutletContext } from "react-router-dom";
import Rating from "react-rating-stars-component";
import TimePicker from "react-time-picker";
import UpdateConfirmPop from "./UpdateConfirmPop.js";
import { url } from "../utils/urls.js";

export default function Addseller() {
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
  const location = useLocation();
  const [disable, setDisable] = useState(false);
  const [presviosData, setPreviousData] = useState(
    location.state ? location.state?.data : ""
  );
  let allBinded = [
    ...(presviosData?.store?.categories || []),
    ...(presviosData?.store?.childCategories || []),
  ];
  const [defCategBind, setDefCatgBind] = useState(
    allBinded?.map((e) => {
      return { label: e.des, value: e.des };
    })
  );

  // console.log(presviosData);
  const [seller, setSeller] = useState({
    tenant_id: presviosData?.suid + "",
    suid: presviosData?.suid + "",
    first_name: presviosData?.first_name ? presviosData.first_name : "",
    last_name: presviosData?.last_name ? presviosData.last_name : "",
    store_name: presviosData?.store?.store_name
      ? presviosData.store.store_name
      : "",
    email: presviosData?.email ? presviosData.email : "",
    selling_type: presviosData?.store?.selling_type
      ? presviosData.store.selling_type
      : "",
    service_list: presviosData?.store?.service_list
      ? presviosData.store.service_list
      : [],
    store_open: presviosData?.store?.store_open
      ? presviosData.store.store_open
      : "",
    store_close: presviosData?.store?.store_close
      ? presviosData.store.store_close
      : "",
    phone_number: presviosData?.phone_number ? presviosData.phone_number : "",
    // store_url: presviosData?.store?.store_url
    //   ? presviosData.store.store_url
    //   : "",
    description: presviosData?.store?.description
      ? presviosData.store.description
      : "",
    address: presviosData?.store?.address ? presviosData.store?.address : "",
    delivery_time: presviosData?.store?.delivery_time
      ? presviosData.store?.delivery_time
      : "",
    media: presviosData?.store?.media ? presviosData.store?.media : "",
    cover_media: presviosData?.store?.cover_media
      ? presviosData.store?.cover_media
      : "",
    isFlatDelivery: presviosData?.store?.isFlatDelivery
      ? presviosData.store?.isFlatDelivery
      : false,
    minCartValue: presviosData?.store?.minCartValue
      ? presviosData.store?.minCartValue
      : 0.0,
    flatDeliveryRate: presviosData?.store?.flatDeliveryRate
      ? presviosData.store?.flatDeliveryRate
      : 0.0,
    deliveryRadius: presviosData?.store?.deliveryRadius
      ? presviosData.store?.deliveryRadius
      : 0.0,
    pickup_number: presviosData?.store?.pickup_number
      ? presviosData.store?.pickup_number
      : "",
    pickup_id: presviosData?.store?.pickup_id
      ? presviosData.store?.pickup_id
      : "",
    pickup_rate: presviosData?.store?.pickup_rate
      ? presviosData.store?.pickup_rate
      : 0.0,
    dropoff_rate: presviosData?.store?.dropoff_rate
      ? presviosData.store?.dropoff_rate
      : 0.0,
    pickup_rate_AND_dropoff_rate: presviosData?.store
      ?.pickup_rate_AND_dropoff_rate
      ? presviosData.store?.pickup_rate_AND_dropoff_rate
      : 0.0,
    commission_rate: presviosData?.commission_rate
      ? presviosData.commission_rate
      : 0.0,
    shipmentFee: presviosData?.shipmentFee ? presviosData.shipmentFee : 0.0,
    place_id: null,
  });
  const [defaultSerList, setDefaulist] = useState(
    presviosData
      ? presviosData.store?.service_list?.map((e) => {
          return { label: e, value: e };
        })
      : ""
  );
  const refreshFunc = useOutletContext();
  const DeliveryArr = [
    { label: "Flat", value: true },
    { label: "Dynamic", value: false },
  ];

  const handleSelect = async (value) => {
    setValue(value);
    // console.log(value);
    let addr = { ...seller };
    addr.place_id = value.value.place_id;
    addr.address = value.label;
    setSeller(addr);
    console.log(seller);
  };

  const [value, setValue] = useState(
    presviosData?.store?.address
      ? { label: presviosData.store.address, value: {} }
      : undefined
  );
  // console.log(presviosData);
  const seller_types = [
    { label: "Product", value: "product" },
    { label: "Service", value: "service" },
    { label: "Both", value: "both" },
  ];
  const [seller_cat, setSeller_cat] = useState([]);
  const [popup, setPopup] = useState(false);
  const [popupDelete, setPopupDelete] = useState(false);
  const [updatePopup, setUpdatePopup] = useState(false);
  const [sellerResources, setSellerResources] = useState([]);
  const [defOpen, setDefOpen] = useState("");
  const [defClose, setDefClose] = useState("");
  const [states, setStates] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const handleView = () => {
    const updatedStates = [...states];
    const falsyIndex = updatedStates.findIndex((state) => !state);
    if (falsyIndex !== -1) {
      updatedStates[falsyIndex] = true;
      setStates(updatedStates);
    }
  };
  const fetchdata = async () => {
    try {
      const response = await axios.get(
        `${url}/v1/seller/resources/get?seller_id=${presviosData.suid}`,
        { headers: { authtoken: authToken, sessionid: session_id } }
      );
      if (response) {
        // console.log(response.data.data);
        setSellerResources(response.data.data);
      }
    } catch (err) {
      console.error(err);
    }
    try {
      const rescat = await axios.get(`${url}/v1/department/get/all`, {
        headers: { authtoken: authToken, sessionid: session_id },
      });
      if (rescat) {
        const filtered = rescat.data.data.filter((i) => i.type !== "product");
        const mapCat = filtered
          .map((i) => {
            return i.des ? { label: i.des, value: i.des } : "";
          })
          .filter((item) => item !== "");
        setSeller_cat(mapCat);
      }
    } catch (error) {
      console.log(error);
    }

    try {
      const response = await axios.get(`${url}/v1/admin/get/sellers`, {
        headers: { authtoken: authToken, sessionid: session_id },
      });
      if (response) {
        // console.log(response.data.data);
        const data = response.data?.data?.find(
          (item) => item.suid === presviosData.suid
        );
        console.log(data);
        setPreviousData(data);
      }
    } catch (err) {
      console.error(err);
    }
  };
  const defValues = () => {
    // console.log(presviosData?.store?.store_open);
    try {
      if (presviosData?.store?.store_open) {
        const parsedTime = parse(
          presviosData.store.store_open,
          "hh:mm:ss a",
          new Date()
        );
        // console.log(parsedTime, "open");
        const formattedTime = format(parsedTime, "HH:mm");
        // console.log(formattedTime);
        setDefOpen(formattedTime);
      }
      if (presviosData?.store?.store_close) {
        const parsedTime = parse(
          presviosData.store.store_close,
          "hh:mm:ss a",
          new Date()
        );
        const formattedTime = format(parsedTime, "HH:mm");
        setDefClose(formattedTime);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const checkRadiusAndUpdateIndex = (slabData) => {
    let hasRadiusValue = false;
    Object.keys(slabData).forEach((slabKey, index) => {
      if (index >= 0 && index <= 5 && slabData[slabKey].radius !== "") {
        hasRadiusValue = true;
        setStates((prevStates) => {
          const newStates = [...prevStates];
          newStates[index] = true;
          return newStates;
        });
      }
    });

    if (!hasRadiusValue) {
      setStates((prevStates) => {
        const newStates = [...prevStates];
        newStates[0] = true;
        return newStates;
      });
    }
  };
  // console.log(states);

  const data = useMemo(() => sellerResources, [sellerResources]);

  const columns = useMemo(() => COLUMNS_RESOURCES, []);
  const tableinstance = useTable({
    columns,
    data,
  });
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    page,
  } = tableinstance;

  const [slab_A, setSlab_A] = useState({
    radius: presviosData?.store?.slabsForDelivery?.slab_A?.radius
      ? presviosData.store.slabsForDelivery?.slab_A?.radius
      : "",
    rate: presviosData?.store?.slabsForDelivery?.slab_A?.rate
      ? presviosData.store.slabsForDelivery?.slab_A?.rate
      : 0.0,
  });
  const [slab_B, setSlab_B] = useState({
    radius: presviosData?.store?.slabsForDelivery?.slab_B?.radius
      ? presviosData.store.slabsForDelivery?.slab_B?.radius
      : "",
    rate: presviosData?.store?.slabsForDelivery?.slab_B?.rate
      ? presviosData.store.slabsForDelivery?.slab_B?.rate
      : 0.0,
  });
  const [slab_C, setSlab_C] = useState({
    radius: presviosData?.store?.slabsForDelivery?.slab_C?.radius
      ? presviosData.store.slabsForDelivery?.slab_C?.radius
      : "",
    rate: presviosData?.store?.slabsForDelivery?.slab_C?.rate
      ? presviosData.store.slabsForDelivery?.slab_C?.rate
      : 0.0,
  });
  const [slab_D, setSlab_D] = useState({
    radius: presviosData?.store?.slabsForDelivery?.slab_D?.radius
      ? presviosData.store.slabsForDelivery?.slab_D?.radius
      : "",
    rate: presviosData?.store?.slabsForDelivery?.slab_D?.rate
      ? presviosData.store.slabsForDelivery?.slab_D?.rate
      : 0.0,
  });
  const [slab_E, setSlab_E] = useState({
    radius: presviosData?.store?.slabsForDelivery?.slab_E?.radius
      ? presviosData.store.slabsForDelivery?.slab_E?.radius
      : "",
    rate: presviosData?.store?.slabsForDelivery?.slab_E?.rate
      ? presviosData.store.slabsForDelivery?.slab_E?.rate
      : 0.0,
  });
  const [slab_F, setSlab_F] = useState({
    radius: presviosData?.store?.slabsForDelivery?.slab_F?.radius
      ? presviosData.store.slabsForDelivery?.slab_F?.radius
      : "",
    rate: presviosData?.store?.slabsForDelivery?.slab_F?.rate
      ? presviosData.store.slabsForDelivery?.slab_F?.rate
      : 0.0,
  });
  const [slabs, setSlabs] = useState({
    slab_A: slab_A,
    slab_B: slab_B,
    slab_C: slab_C,
    slab_D: slab_D,
    slab_E: slab_E,
    slab_F: slab_F,
  });
  // useEffect(() => {
  //   checkRadiusAndUpdateIndex(slabs);
  // }, [slabs]);
  // console.log(slabs);

  // console.log(format(new Date(seller.store_open), "hh:mm"));
  // console.log(seller.selling_type, seller.service_list);
  const field = {
    autocompleteContainer: {
      backgroundColor: "yellow",
      fontFamily: "Inter",
      fontSize: 14,
      height: 52,
      borderRadius: 8,
      padding: 16,
    },
  };

  const [picture, setPicture] = useState(undefined);
  const [video, setVideo] = useState(undefined);
  const [sourceFile, setSourceFile] = useState(undefined);
  function handlePicture(event) {
    event.preventDefault();
    const file = event.target.files[0];
    setPicture(null); // Clear the picture if it was previously set
    setVideo(null); // Clear the video if it was previously set
    // Check if the selected file is a video
    console.log(event);
    if (file.type.includes("video")) {
      setVideo(file);
      setSourceFile(file);
    } else if (file.type.includes("image")) {
      setPicture(file);
      setSourceFile(file);
    }
  }
  // console.log(video);
  const handleSellerChange = (e, key) => {
    let data = seller;
    // console.log(e?.value);
    setSeller({
      ...data,
      [key?.name || e?.target?.name || key]:
        e?.value || e?.target?.files?.[0] || e?.target?.value || "",
    });
  };
  const handleSlabChange = (e, key, data, setValue) => {
    console.log(key);
    const updatedValue = {
      ...data,
      [key?.name || e?.target?.name || key]: Number(
        e?.value || e?.target?.files?.[0] || e?.target?.value || ""
      ),
    };
    setValue(updatedValue);
    console.log(updatedValue);
    setSlabs({
      ...slabs,
      [key]: updatedValue,
    });
  };
  const deleteSlab = (slabKey, setSlab) => {
    const updatedSlabs = { ...slabs };
    updatedSlabs[slabKey] = { radius: "", rate: 0 };
    // console.log(updatedSlabs + "these are updated slabs");
    setSlabs(updatedSlabs);

    const updatedStates = [...states];
    const index = Object.keys(slabs).indexOf(slabKey);
    // console.log(index + "this index");
    updatedStates[index] = false;
    // console.log(updatedStates + "updated states");
    setStates(updatedStates);
    setSlab({
      radius: "",
      rate: 0,
    });
  };
  // console.log(slabs);ss
  // console.log(currentIndex);

  const handleArrayEvent = (e, key) => {
    //   console.log(e, key);
    setSeller({
      ...seller,
      [key?.name || e?.target?.name || key]: e.map((item) => item.value),
    });
  };

  const handletime = (e, key) => {
    const time = e?.target?.value;
    const parsedTime = parse(time, "HH:mm", new Date());
    const formattedTime = format(parsedTime, "hh:mm:ss a");
    setSeller({
      ...seller,
      [key?.name || e?.target?.name || key]: formattedTime,
    });
  };

  const [resource, setResource] = useState(undefined);

  async function CategoryUnbined() {
    let items = new Set(defCategBind.map((item) => item.label));
    let toBinditems = allBinded.filter((item) => !items.has(item.des));
    let formData = {
      type: toBinditems?.[0]?.store_tag ? "store_tag" : "store_sub_tag",
      keys: toBinditems?.[0]?.store_tag
        ? toBinditems?.[0]?.store_tag
        : toBinditems?.[0]?.store_sub_tag,
    };
    console.log(formData);
    try {
      let disUrl = `${url}/v1/admin/store/unbind`;

      const response = await axios.post(`${disUrl}`, formData, {
        headers: { authtoken: authToken, sessionid: session_id },
      });
      console.log(response);
      toast.dismiss();
      toast("Category Removed", {
        type: "success",
      });
    } catch (error) {
      toast.dismiss();
      toast(error.response?.data?.error || "Category Removing Failed", {
        type: "error",
      });
      console.error(error);
    }
  }

  async function handleSubmit(event) {
    toast("request loading please wait", {
      progress: true,
    });
    setDisable(true);
    // console.log(presviosData);
    event.preventDefault();

    try {
      Object.keys(seller).map((i) => {
        switch (i) {
          case "pickup_rate":
            seller[i] = seller[i] || 0.0;
            break;
          case "dropoff_rate":
            seller[i] = seller[i] || 0.0;
            break;
          case "pickup_rate_AND_dropoff_rate":
            seller[i] = seller[i] || 0.0;
            break;
          case "commission_rate":
            seller[i] = seller[i] || 0.0;
            break;
          case "shipmentFee":
            seller[i] = seller[i] || 0.0;
            break;
          case "minCartValue":
            seller[i] = seller[i] || 0.0;
            break;
          case "flatDeliveryRate":
            seller[i] = seller[i] || 0.0;
            break;
          case "deliveryRadius":
            seller[i] = seller[i] || 0.0;
            break;
          case "isFlatDelivery":
            seller[i] = seller[i] || false;
            break;
        }
      });

      const filteredSlabs = Object.fromEntries(
        Object.entries(slabs).filter(
          ([key, value]) => value.radius !== "" || value.rate !== 0
        )
      );
      seller["slabsForDelivery"] = filteredSlabs;

      if (picture || video) {
        try {
          const mediaData = new FormData();
          if (picture) {
            mediaData.append("media", picture);
          } else if (video) {
            mediaData.append("media", video);
          }
          const mediaType = picture ? "media" : "cover_media"; // Optional: To distinguish between picture and video
          const response = await axios.post(
            `${url}/v1/store/media/upload`,
            mediaData,
            {
              headers: {
                authtoken: authToken,
                sessionid: session_id,
                "Content-Type": "multipart/form-data",
              },
            }
          );
          seller[mediaType] = "sellers/" + response.data.fileKey;
        } catch (error) {
          toast.dismiss();
          toast("Media not Uploaded", {
            type: "error",
          });
          console.log(error.response.data);
        }
      }
      if (!presviosData.store?.sid) {
        try {
          let obj = seller;
          obj["suid"] = obj.tenant_id;
          obj["commission_rate"] = obj.commission_rate;
          obj["shipmentFee"] = obj.shipmentFee;
          const resupdate = await axios.post(`${url}/v1/seller/update`, obj, {
            headers: { authtoken: authToken, sessionid: session_id },
          });
          // console.log(resupdate);
          const formData = seller;
          // console.log(formData);
          const response = await axios.post(
            `${url}/v1/store/create`,
            formData,
            { headers: { authtoken: authToken, sessionid: session_id } }
          );
          if (response) {
            toast.dismiss();
            toast("Store Created Successfully", {
              type: "success",
            });
          }
          setDisable(false);
          if (response.data.data) {
            let data = presviosData;
            data["store"] = response.data.data;
            setPreviousData(data);
            console.log(data);
            refreshFunc();
          }
        } catch (error) {
          toast.dismiss();
          console.error(error);
          toast("Store Creation failed", {
            type: "error",
          });
          setDisable(false);
        }
      } else {
        try {
          let obj = seller;
          obj["suid"] = obj.tenant_id;
          obj["commission_rate"] = obj.commission_rate;
          obj["shipmentFee"] = obj.shipmentFee;
          obj["sid"] = presviosData.store.sid;
          const resupdate = await axios.post(`${url}/v1/seller/update`, obj, {
            headers: { authtoken: authToken, sessionid: session_id },
          });
          const formData = seller;
          console.log(formData);
          const response = await axios.post(
            `${url}/v1/store/update?sid=${presviosData.store.sid}`,
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
            toast("Store Updated Successfully", {
              type: "success",
            });
            setDisable(false);
            CategoryUnbined();
          }
        } catch (error) {
          toast.dismiss();
          toast(error.response?.data?.error || "request failed", {
            type: "error",
          });
          setDisable();
          console.error(error);
        }
      }
      // console.log(data);
      setUpdatePopup(false);
    } catch (error) {
      console.error(error);
    }
  }
  // console.log(seller);
  const handleApprov = async () => {
    if (presviosData.store) {
      try {
        let obj = {};
        obj["suid"] = seller.tenant_id;
        presviosData.status === "unverified"
          ? (obj["status"] = "verified")
          : (obj["status"] = "unverified");
        // obj["status"] = "verified";
        let response = await axios.post(`${url}/v1/seller/update`, obj, {
          headers: { authtoken: authToken, sessionid: session_id },
        });
        if (response) {
          // console.log("Success");
          toast.dismiss();
          toast("Request Completed Successfully", {
            type: "success",
          });
          nav("/sellers");
        }
      } catch (err) {
        console.log(err);
      }
      try {
        const obj = seller;
        presviosData.status === "unverified"
          ? (obj["status"] = "verified")
          : (obj["status"] = "unverified");
        // obj["status"] = "verified";
        const response = await axios.post(
          `${url}/v1/store/update?sid=${presviosData.store.sid}`,
          obj,
          {
            header: {
              authtoken: authToken,
              sessionid: session_id,
              "Content-Type": "application/json",
            },
          }
        );
        if (response) {
          toast.dismiss();
          toast("request completed Successfully", {
            type: "success",
          });
          nav("/sellers");
        }
      } catch (error) {
        toast.dismiss();
        toast(error.response?.data?.error || "request failed", {
          type: "error",
        });
        console.error(error);
      }
    } else {
      toast("User Does not have any store", {
        type: "error",
      });
    }
  };

  useEffect(() => {
    if (presviosData?.store?.sid) {
      fetchdata();
      defValues();
      checkRadiusAndUpdateIndex(slabs);
    }
  }, []);

  useEffect(() => {
    setSeller({
      tenant_id: presviosData?.suid + "",
      suid: presviosData?.suid + "",
      first_name: presviosData?.first_name ? presviosData.first_name : "",
      last_name: presviosData?.last_name ? presviosData.last_name : "",
      store_name: presviosData?.store?.store_name
        ? presviosData.store.store_name
        : "",
      email: presviosData?.email ? presviosData.email : "",
      selling_type: presviosData?.store?.selling_type
        ? presviosData.store.selling_type
        : "",
      service_list: presviosData?.store?.service_list
        ? presviosData.store.service_list
        : [],
      store_open: presviosData?.store?.store_open
        ? presviosData.store.store_open
        : "",
      store_close: presviosData?.store?.store_close
        ? presviosData.store.store_close
        : "",
      phone_number: presviosData?.phone_number ? presviosData.phone_number : "",
      // store_url: presviosData?.store?.store_url
      //   ? presviosData.store.store_url
      //   : "",
      description: presviosData?.store?.description
        ? presviosData.store.description
        : "",
      address: presviosData?.store?.address ? presviosData.store?.address : "",
      delivery_time: presviosData?.store?.delivery_time
        ? presviosData.store?.delivery_time
        : "",
      media: presviosData?.store?.media ? presviosData.store?.media : "",
      cover_media: presviosData?.store?.cover_media
        ? presviosData.store?.cover_media
        : "",
      isFlatDelivery: presviosData?.store?.isFlatDelivery
        ? presviosData.store?.isFlatDelivery
        : false,
      minCartValue: presviosData?.store?.minCartValue
        ? presviosData.store?.minCartValue
        : 0.0,
      flatDeliveryRate: presviosData?.store?.flatDeliveryRate
        ? presviosData.store?.flatDeliveryRate
        : 0.0,
      deliveryRadius: presviosData?.store?.deliveryRadius
        ? presviosData.store?.deliveryRadius
        : 0.0,
      pickup_number: presviosData?.store?.pickup_number
        ? presviosData.store?.pickup_number
        : "",
      pickup_rate: presviosData?.store?.pickup_rate
        ? presviosData.store?.pickup_rate
        : 0.0,
      dropoff_rate: presviosData?.store?.dropoff_rate
        ? presviosData.store?.dropoff_rate
        : 0.0,
      pickup_rate_AND_dropoff_rate: presviosData?.store
        ?.pickup_rate_AND_dropoff_rate
        ? presviosData.store?.pickup_rate_AND_dropoff_rate
        : 0.0,
      commission_rate: presviosData?.commission_rate
        ? presviosData.commission_rate
        : 0.0,
      shipmentFee: presviosData?.shipmentFee ? presviosData.shipmentFee : 0.0,
      place_id: null,
    });
  }, [presviosData]);

  const customStyles = {
    suggestion: { backgroundColor: "#f9f9f9", height: 52 },
  };

  const customColor = (baseStyles) => ({
    ...baseStyles,
    backgroundColor: "rgba(239, 241, 249, 0.6)",
    minHeight: "52px",
    minWidth: "225px",
  });

  return (
    <div className="content">
      <div className="form-header">
        <div className="back">
          <button className="back-btn" onClick={() => nav("/sellers")}>
            <img src={backicon} alt="back" className="back-icon" />
          </button>
        </div>
        <span className="form-heading">
          {seller.store_name || "Store Name"}
        </span>
        <div className="storebtns">
          <div>
            <DeletePop
              popupDelete={popupDelete}
              setPopupDelete={setPopupDelete}
              data={presviosData}
              refreshFunc={refreshFunc}
            />
            <button
              className="submit-btn addp"
              onClick={() => setPopupDelete(true)}
            >
              Delete
            </button>
          </div>
          <div>
            <button className="submit-btn addp" onClick={handleApprov}>
              {presviosData?.status === "unverified" ? "Approve" : "Unapprove"}
            </button>
          </div>
          <div>
            <UpdateConfirmPop
              trigger={updatePopup}
              setTrigger={setUpdatePopup}
              handle={handleSubmit}
              heading={"Update"}
              message={`Are you sure want to update ${seller?.store_name} ?`}
            />
            <button
              onClick={() => setUpdatePopup(true)}
              // onClick={CategoryUnbined}
              className="submit-btn addp"
            >
              Update
            </button>
          </div>
        </div>
      </div>
      {presviosData?.store ? (
        <div className="form-header" stars style={{ paddingLeft: "35px" }}>
          <Rating
            count={5} // the number of
            value={presviosData?.store?.averageRatings} // the rating value
            size={30} // the size of the star
            edit={false} // disable user interaction
            isHalf={true}
            emptyIcon={<i className="far fa-star"></i>}
            halfIcon={<i className="fa fa-star-half-alt"></i>}
            fullIcon={<i className="fa fa-star"></i>}
          />
          <span className="form-heading">
            {presviosData?.store?.averageRatings}/5
          </span>
        </div>
      ) : (
        ""
      )}
      <div className="adding-form">
        <div className="form-body">
          <div className="form-content">
            <div className="content-right">
              <div className="form-row">
                <input
                  required
                  type="text"
                  name="first_name"
                  id="first_name"
                  value={seller.first_name}
                  onChange={handleSellerChange}
                  placeholder="First Name"
                  className="field"
                />
                <input
                  required
                  type="text"
                  name="last_name"
                  id="last_name"
                  value={seller.last_name}
                  onChange={handleSellerChange}
                  placeholder="Last Name"
                  className="field"
                />
              </div>
              <div>
                <input
                  required
                  type="text"
                  placeholder="Store Name"
                  name="store_name"
                  id="store_name"
                  value={seller.store_name}
                  onChange={handleSellerChange}
                  className="field"
                />
              </div>

              <div>
                <input
                  required
                  type="Email"
                  name="email"
                  id="eamil"
                  value={seller.email}
                  onChange={handleSellerChange}
                  placeholder="Email Address"
                  className="field"
                />
              </div>
              <div>
                <input
                  required
                  type="tel"
                  name="phone_number"
                  id="phone_number"
                  value={seller.phone_number}
                  onChange={handleSellerChange}
                  placeholder="Phone Number"
                  className="field"
                />
              </div>
              {/* <div>
                <input
                  required
                  type="number"
                  name="shipmentFee"
                  id="shipmentFee"
                  value={seller.shipmentFee || ""}
                  onChange={handleSellerChange}
                  placeholder="Shipment Fee"
                  className="field"
                />
              </div> */}
              <div className="form-row">
                <Select
                  styles={{
                    control: customColor,
                  }}
                  options={seller_types}
                  defaultValue={
                    seller.selling_type
                      ? {
                          label:
                            seller.selling_type.charAt(0).toUpperCase() +
                            seller.selling_type.slice(1),
                          value: seller.selling_type,
                        }
                      : ""
                  }
                  placeholder={" Selling Type"}
                  className="select-in"
                  id="selling_type"
                  name="selling_type"
                  onChange={handleSellerChange}
                  required
                />
              </div>
              {seller.selling_type === "service" ||
              seller.selling_type === "both" ? (
                <div className="form-row">
                  <Select
                    styles={{
                      control: customColor,
                    }}
                    isMulti
                    defaultValue={defaultSerList}
                    options={seller_cat}
                    placeholder={"Selling Category"}
                    className="select-in"
                    id="service_list"
                    name="service_list"
                    onChange={handleArrayEvent}
                    required
                  />
                </div>
              ) : (
                ""
              )}
              {/* {defCategBind ? (
                <div className="form-row">
                  <Select
                    key={defCategBind}
                    styles={{
                      control: customColor,
                    }}
                    isMulti
                    defaultValue={defCategBind}
                    className="select-in"
                    id="bind_cat"
                    name="bind_cat"
                    placeholder={"Select to Unbind"}
                    onChange={(e) => {
                      const updatedDefaultValues = defCategBind.filter((i) =>
                        e.some((n) => n.label === i.label)
                      );
                      // console.log(allBinded);
                      setDefCatgBind(updatedDefaultValues);
                    }}
                    required
                  />
                </div>
              ) : (
                ""
              )} */}
            </div>

            <div className="content-left">
              <div>
                <textarea
                  type="text"
                  name="description"
                  id="description"
                  value={seller.description}
                  onChange={handleSellerChange}
                  placeholder="Store short Description"
                  className="field description"
                />
              </div>
              <div>
                <span className="form-headings">Address</span>
              </div>
              <div>
                <GooglePlacesAutocomplete
                  selectProps={{
                    value,
                    onChange: handleSelect,
                    placeholder: value ? value : "Address",
                  }}
                  name="address"
                  id="address"
                  apiKey="AIzaSyC-28dhX46EXos0B_fx9cuUWEpWZEMIQCc"
                />
              </div>
              <div>
                <span className="form-headings">Opening & Closing time</span>
              </div>
              <div className="form-row">
                {/* <TimePicker
                  onChange={""}
                  value={""}
                  className="field"
                  disableClock="true"
                /> */}
                <input
                  type="time"
                  name="store_open"
                  id="store_open"
                  step="60"
                  defaultValue={defOpen}
                  // pattern="hh:mm:ss a"
                  placeholder="Store Open"
                  onChange={handletime}
                  className="field"
                />
                <input
                  type="time"
                  name="store_close"
                  id="store_close"
                  step="60"
                  defaultValue={defClose}
                  onChange={handletime}
                  placeholder="Store Close"
                  className="field"
                />
              </div>
              {/* <div>
                <span className="form-headings">
                  Delivery time & Pickup Number
                </span>
              </div>
              <div className="form-row">
                <input
                  required
                  type="text"
                  placeholder="Delivery time"
                  name="delivery_time"
                  id="delivery_time"
                  value={seller.delivery_time}
                  onChange={handleSellerChange}
                  className="field"
                />
                <input
                  type="number"
                  placeholder="pickup number"
                  name="pickup_number"
                  id="pickup_number"
                  value={seller.pickup_number}
                  onChange={handleSellerChange}
                  className="field"
                />
              </div>
              <div>
                <input
                  required
                  type="text"
                  placeholder="Pickup ID"
                  name="pickup_id"
                  id="pickup_id"
                  value={seller.pickup_id}
                  onChange={handleSellerChange}
                  className="field"
                />
              </div> */}
            </div>
          </div>
          <div className="form-image">
            <div className="image-sec">
              <div className="image-holder">
                <img
                  src={
                    picture
                      ? URL.createObjectURL(picture)
                      : seller.media
                      ? seller.media.substring(0, 4) === "http"
                        ? seller.media
                        : "https://petsetgostorage.blob.core.windows.net/petsetgo-u2/sellers/" +
                          seller.media
                      : imageicon
                  }
                  alt="image"
                  className="image"
                />
              </div>
              <div className="imagehead">
                <label htmlFor="img_id" style={{ cursor: "pointer" }}>
                  Upload image
                </label>
                <input
                  type="file"
                  name="img_id"
                  id="img_id"
                  onChange={handlePicture}
                  className="file"
                />
              </div>
              <span className="imagepg">
                Upload a cover image for your store.
                <br />
                File Format jpeg, png Recommened Size 600x600 (1:1)
              </span>
            </div>
            {/* <span>Addtional Images</span> */}
            {/* <div className="image-sec">
              <div className="image-holder">
                <div className="video-container">
                  {video ? (
                    <video
                      autoPlay
                      muted
                      className="image"
                      src={URL.createObjectURL(video)}
                      type="video/mp4"
                    />
                  ) : seller.cover_media ? (
                    <video
                      autoPlay
                      muted
                      className="image"
                      src={
                        seller.cover_media.substring(0, 4) === "http"
                          ? seller.cover_media
                          : "https://petsetgostorage.blob.core.windows.net/petsetgo-u2/" +
                            seller.cover_media
                      }
                      type="video/mp4"
                    />
                  ) : (
                    <img src={imageicon} alt="Image Icon" className="image" />
                  )}
                </div>
              </div>
              <div className="imagehead">
                <label htmlFor="cover_media" style={{ cursor: "pointer" }}>
                  Upload video
                </label>
                <input
                  type="file"
                  name="cover_media"
                  id="cover_media"
                  onChange={handlePicture}
                  className="file"
                />
              </div>
              <span className="imagepg">
                Upload a cover video for your store.
              </span>
            </div> */}
          </div>
        </div>
        {/* Pickup Flate Rate */}
        {/* <div className="form-footer">
          <div className="seller-footer">
            <div className="foot-left">
              <div className="linked">
                <span className="form-headings">Minimum Cart Value (AED)</span>
                <div>
                  <input
                    type="number"
                    name="minCartValue"
                    id="minCartValue"
                    value={seller.minCartValue || ""}
                    onChange={handleSellerChange}
                    placeholder="e.g. 90"
                    className="field  link-field"
                  />
                </div>
              </div>
              <div className="linked">
                <span className="form-headings">Delivery Radius (KM)</span>
                <div>
                  <input
                    type="number"
                    name="deliveryRadius"
                    id="deliveryRadius"
                    value={seller.deliveryRadius || ""}
                    onChange={handleSellerChange}
                    placeholder="e.g 15"
                    className="field  link-field"
                  />
                </div>
              </div>
            </div>
            <div className="foot-right">
              <div className="linked">
                <span className="form-headings">Delivery Charges Type</span>
                <div>
                  <Select
                    styles={{
                      control: customColor,
                    }}
                    options={DeliveryArr}
                    defaultValue={
                      seller.isFlatDelivery
                        ? {
                            label: "Flat",
                            value: seller.isFlatDelivery,
                          }
                        : {
                            label: "Dynamic",
                            value: seller.isFlatDelivery,
                          }
                    }
                    id="isFlatDelivery"
                    name="isFlatDelivery"
                    onChange={handleSellerChange}
                    placeholder={"Select type"}
                    className="select-in  link-field"
                  />
                </div>
              </div>
              {seller.isFlatDelivery ? (
                <div className="linked">
                  <span className="form-headings">
                    Flat Delivery Charges (AED)
                  </span>
                  <div>
                    <input
                      type="number"
                      name="flatDeliveryRate"
                      id="flatDeliveryRate"
                      placeholder="e.g. 10"
                      value={seller.flatDeliveryRate || ""}
                      onChange={handleSellerChange}
                      className="field  link-field"
                    />
                  </div>
                </div>
              ) : (
                <></>
              )}
            </div>
          
          </div>
        </div> */}
        {!seller.isFlatDelivery ? (
          // <div className="form-footer">
          //   <div className="chargesdiv">
          //     <span className="form-headings">Dynamic Charges</span>
          //     <div></div>
          //     <div></div>
          //     <button className="icon-btn" onClick={handleView}>
          //       <img src={plusicon} alt="plus" />
          //     </button>
          //     <div></div>
          //     <span className="form-headings" style={{ textAlign: "center" }}>
          //       Radius (KM)
          //     </span>
          //     <span className="form-headings" style={{ textAlign: "center" }}>
          //       Charges (AED)
          //     </span>
          //     <div></div>
          //     {/* <span className="form-headings" style={{ alignSelf: "center" }}>
          //       Slab A
          //     </span>
          //     <div>
          //       <input
          //         type="number"
          //         name="radius"
          //         value={slab_A.radius || ""}
          //         onChange={(e) => {
          //           handleSlabChange(e, "slab_A", slab_A, setSlab_A);
          //         }}
          //         placeholder="e.g. 10"
          //         className="field"
          //       />
          //     </div>
          //     <div>
          //       <input
          //         type="number"
          //         name="rate"
          //         value={slab_A.rate || ""}
          //         onChange={(e) => {
          //           handleSlabChange(e, "slab_A", slab_A, setSlab_A);
          //         }}
          //         placeholder="e.g. 20"
          //         className="field"
          //       />
          //     </div>
          //     <div></div> */}
          //     {states[0] || slab_A?.radius ? (
          //       <>
          //         <span
          //           className="form-headings"
          //           style={{ alignSelf: "center" }}
          //         >
          //           Slab A
          //         </span>
          //         <div>
          //           <input
          //             type="number"
          //             name="radius"
          //             value={slab_A.radius || ""}
          //             onChange={(e) => {
          //               handleSlabChange(e, "slab_A", slab_A, setSlab_A);
          //             }}
          //             placeholder="e.g. 15"
          //             className="field"
          //           />
          //         </div>
          //         <div>
          //           <input
          //             type="number"
          //             name="rate"
          //             value={slab_A.rate || ""}
          //             onChange={(e) => {
          //               handleSlabChange(e, "slab_A", slab_A, setSlab_A);
          //             }}
          //             placeholder="e.g. 30"
          //             className="field"
          //           />
          //         </div>
          //         <div>
          //           <button
          //             className="icon-btn"
          //             onClick={() => deleteSlab("slab_A", setSlab_A)}
          //           >
          //             <img src={cross} alt="plus" />
          //           </button>
          //         </div>
          //       </>
          //     ) : (
          //       ""
          //     )}
          //     {states[1] || slab_B?.radius ? (
          //       <>
          //         <span
          //           className="form-headings"
          //           style={{ alignSelf: "center" }}
          //         >
          //           Slab B
          //         </span>
          //         <div>
          //           <input
          //             type="number"
          //             name="radius"
          //             value={slab_B.radius || ""}
          //             onChange={(e) => {
          //               handleSlabChange(e, "slab_B", slab_B, setSlab_B);
          //             }}
          //             placeholder="e.g. 15"
          //             className="field"
          //           />
          //         </div>
          //         <div>
          //           <input
          //             type="number"
          //             name="rate"
          //             value={slab_B.rate || ""}
          //             onChange={(e) => {
          //               handleSlabChange(e, "slab_B", slab_B, setSlab_B);
          //             }}
          //             placeholder="e.g. 30"
          //             className="field"
          //           />
          //         </div>
          //         <div>
          //           <button
          //             className="icon-btn"
          //             onClick={() => deleteSlab("slab_B", setSlab_B)}
          //           >
          //             <img src={cross} alt="plus" />
          //           </button>
          //         </div>
          //       </>
          //     ) : (
          //       ""
          //     )}
          //     {states[2] || slab_C?.radius ? (
          //       <>
          //         <span
          //           className="form-headings"
          //           style={{ alignSelf: "center" }}
          //         >
          //           Slab C
          //         </span>
          //         <div>
          //           <input
          //             type="number"
          //             name="radius"
          //             value={slab_C.radius || ""}
          //             onChange={(e) => {
          //               handleSlabChange(e, "slab_C", slab_C, setSlab_C);
          //             }}
          //             placeholder="e.g. 10"
          //             className="field"
          //           />
          //         </div>
          //         <div>
          //           <input
          //             type="number"
          //             name="rate"
          //             value={slab_C.rate || ""}
          //             onChange={(e) => {
          //               handleSlabChange(e, "slab_C", slab_C, setSlab_C);
          //             }}
          //             placeholder="e.g. 20"
          //             className="field"
          //           />
          //         </div>
          //         <div>
          //           <button
          //             className="icon-btn"
          //             onClick={() => deleteSlab("slab_C", setSlab_C)}
          //           >
          //             <img src={cross} alt="plus" />
          //           </button>
          //         </div>
          //       </>
          //     ) : (
          //       ""
          //     )}
          //     {states[3] || slab_D?.radius ? (
          //       <>
          //         <span
          //           className="form-headings"
          //           style={{ alignSelf: "center" }}
          //         >
          //           Slab D
          //         </span>
          //         <div>
          //           <input
          //             type="number"
          //             name="radius"
          //             value={slab_D.radius || ""}
          //             onChange={(e) => {
          //               handleSlabChange(e, "slab_D", slab_D, setSlab_D);
          //             }}
          //             placeholder="e.g. 10"
          //             className="field"
          //           />
          //         </div>
          //         <div>
          //           <input
          //             type="number"
          //             name="rate"
          //             value={slab_D.rate || ""}
          //             onChange={(e) => {
          //               handleSlabChange(e, "slab_D", slab_D, setSlab_D);
          //             }}
          //             placeholder="e.g. 20"
          //             className="field"
          //           />
          //         </div>
          //         <div>
          //           <button
          //             className="icon-btn"
          //             onClick={() => deleteSlab("slab_D", setSlab_D)}
          //           >
          //             <img src={cross} alt="plus" />
          //           </button>
          //         </div>
          //       </>
          //     ) : (
          //       ""
          //     )}
          //     {states[4] || slab_E.radius ? (
          //       <>
          //         <span
          //           className="form-headings"
          //           style={{ alignSelf: "center" }}
          //         >
          //           Slab E
          //         </span>
          //         <div>
          //           <input
          //             type="number"
          //             name="radius"
          //             value={slab_E.radius || ""}
          //             onChange={(e) => {
          //               handleSlabChange(e, "slab_E", slab_E, setSlab_E);
          //             }}
          //             placeholder="e.g. 10"
          //             className="field"
          //           />
          //         </div>
          //         <div>
          //           <input
          //             type="number"
          //             name="rate"
          //             value={slab_E.rate || ""}
          //             onChange={(e) => {
          //               handleSlabChange(e, "slab_E", slab_E, setSlab_E);
          //             }}
          //             placeholder="e.g. 20"
          //             className="field"
          //           />
          //         </div>
          //         <div>
          //           <button
          //             className="icon-btn"
          //             onClick={() => deleteSlab("slab_E", setSlab_E)}
          //           >
          //             <img src={cross} alt="plus" />
          //           </button>
          //         </div>
          //       </>
          //     ) : (
          //       ""
          //     )}
          //     {states[5] || slab_F?.radius ? (
          //       <>
          //         <span
          //           className="form-headings"
          //           style={{ alignSelf: "center" }}
          //         >
          //           Slab F
          //         </span>
          //         <div>
          //           <input
          //             type="number"
          //             name="radius"
          //             value={slab_F.radius || ""}
          //             onChange={(e) => {
          //               handleSlabChange(e, "slab_F", slab_F, setSlab_F);
          //             }}
          //             placeholder="e.g. 10"
          //             className="field"
          //           />
          //         </div>
          //         <div>
          //           <input
          //             type="number"
          //             name="rate"
          //             value={slab_F.rate || ""}
          //             onChange={(e) => {
          //               handleSlabChange(e, "slab_F", slab_F, setSlab_F);
          //             }}
          //             placeholder="e.g. 20"
          //             className="field"
          //           />
          //         </div>
          //         <div>
          //           <button
          //             className="icon-btn"
          //             onClick={() => deleteSlab("slab_F", setSlab_F)}
          //           >
          //             <img src={cross} alt="plus" />
          //           </button>
          //         </div>
          //       </>
          //     ) : (
          //       ""
          //     )}
          //   </div>
          // </div>
          <></>
        ) : (
          ""
        )}
      </div>
      {/* <div className="sellerresources">
        <div className="sellerresheader">
          <div className="sellerResheading">Resources</div>
          <button className="icon-btn" onClick={() => setPopup(true)}>
            <img src={plusicon} alt="plus" />
          </button>
          <Newresources
            data={presviosData}
            load={fetchdata}
            resource={resource}
            setResource={setResource}
            trigger={popup}
            setTrigger={setPopup}
          />
        </div>
        <div className="table">
          {sellerResources.length ? (
            <table {...getTableProps()}>
              <thead>
                {headerGroups?.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th {...column.getHeaderProps()}>
                        {column.render("Header")}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {rows?.map((row) => {
                  prepareRow(row);
                  return (
                    <tr
                      {...row.getRowProps()}
                      onClick={(r) => {
                        setResource(
                          sellerResources.find(
                            (it) => it.resourceID == row.values.resourceID
                          )
                        );
                        setPopup(true);
                      }}
                      className="tr"
                      style={{ cursor: "pointer" }}
                    >
                      {row?.cells.map((cell) => {
                        return (
                          <td {...cell.getCellProps()}>
                            {cell.render("Cell")}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="table-pg">
              <span className="tpg">
                Create Resources by clicking on the plus button above
              </span>
            </div>
          )}
        </div>
      </div> */}
      <ToastContainer />
    </div>
  );
}
