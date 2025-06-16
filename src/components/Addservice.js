import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/addforms.css";
import CreatableSelect from "react-select";
import Select from "react-select";
import imageicon from "../assets/Imageicon.png";
import { useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Productcategory from "./Productcategory";
import { useNavigate } from "react-router-dom";
import backicon from "../assets/back.png";
import { format } from "date-fns";
import { url } from "../utils/urls.js";

const ServiceOptions = [
  {
    value: "categ 1",
    label: "categ 1",
  },
  {
    value: "categ 2",
    label: "categ2",
  },
];

const tax = [
  {
    label: "abc",
    value: "abc",
  },
  {
    label: "efg",
    value: "efg",
  },
  {
    label: "hij",
    value: "hij",
  },
];

const tax_class = [
  {
    label: "abc",
    value: "abc",
  },
  {
    label: "efg",
    value: "efg",
  },
  {
    label: "hij",
    value: "hij",
  },
];
export default function Addservice(props) {
  const navigate = useNavigate();
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
  const [popup, setPopup] = useState(false);
  // console.log(props.storeId);
  useEffect(() => {
    setstore_id(props.storeId);
    props.setName("Services");
  }, [props.storeId]);
  const [store_id, setstore_id] = useState("");
  const location = useLocation();
  const [linked_services, setLinkedServices] = useState("");
  const [previousData, setPreviousData] = useState(
    location.state ? location.state?.data : ""
  );
  // console.log(previousData);
  const [tax_classs, setTax_class] = useState(
    previousData?.txtclass
      ? {
          value: previousData.txtclass,
          label: previousData.txtclass,
        }
      : ""
  );
  const [taxx, setTaxx] = useState(
    previousData?.txt
      ? {
          value: previousData.txt,
          label: previousData.txt,
        }
      : ""
  );
  const [category, setCategory] = useState(
    previousData?.categories
      ? {
          value: previousData.categories,
          label: previousData.categories,
        }
      : ""
  );
  const [servicetype, setservicetype] = useState(
    previousData?.service_type
      ? {
          value: previousData.service_type,
          label: previousData.service_type,
        }
      : ""
  );
  const [categories, setCategories] = useState({
    mainCategory: [],
    childCategory: [],
    childSubCategory: [],
  });
  const [discounts, setDiscounts] = useState({
    type: previousData?.discounts?.[0]?.type
      ? previousData?.discounts?.[0]?.type
      : "",
    title: previousData?.discounts?.[0]?.discounttitle
      ? previousData?.discounts?.[0]?.discounttitle
      : "",
    rate: previousData?.discounts?.[0]?.rate
      ? previousData?.discounts?.[0]?.rate
      : "",
    store_id: previousData?.discounts?.[0]?.store_id
      ? previousData?.discounts?.[0]?.store_id
      : previousData?.store_id
      ? previousData?.store_id
      : "",
    startDateTime: previousData?.discounts?.[0]?.startDateTime
      ? previousData?.discounts?.[0]?.startDateTime
      : "",
    endDateTime: previousData?.discounts?.[0]?.endDateTime
      ? previousData?.discounts?.[0]?.endDateTime
      : "",
    level: "service",
    ...(previousData?.discounts?.[0]?.discount_id
      ? { discount_id: previousData?.discounts?.[0]?.discount_id }
      : {}),
    service_id: "",
  });
  const discountTypes = [
    { label: "fixed", value: "fixed" },
    { label: "percentage", value: "percentage" },
  ];
  const [services, setServices] = useState([]);
  const [types, setTypes] = useState([
    {
      value: "service",
      label: "Service",
    },
    // {
    //   value: "Boarding",
    //   label: "Boarding",
    // },
    // {
    //   value: "Day Care",
    //   label: "Day Care",
    // },
    // {
    //   value: "Emergency Video Call",
    //   label: "Emergency Video Call",
    // },
    // {
    //   value: "Appoint Video Call",
    //   label: "Appoint Video Call",
    // },
  ]);
  // console.log(types);
  const fetchdata = async () => {
    const response = await axios
      .get(`${url}/v1/service/get?store_id=${props.storeId}`, {
        headers: { authtoken: authToken, sessionid: session_id },
      })
      .catch((err) => console.log(err));
    const resdata = response.data.data;
    // console.log(resdata);
    // console.log(props.storeId);
    setServices(resdata);
    // setTypes(resdata);
  };

  useEffect(() => {
    fetchdata();
  }, [props.storeId]);
  const servicesarray = services.map((e) => e.service_title);
  const servicesoptions = servicesarray.map((e) => {
    return { value: e, label: e };
  });

  const [picture, setPicture] = useState("");
  const [data, setService] = useState({
    store_id: previousData?.store_id
      ? previousData.store_id
      : props?.storeId
      ? props.storeId
      : "",
    service_type: previousData?.service_type ? previousData.service_type : "",
    serviceID: previousData?.serviceID ? previousData.serviceID : "",
    categories: previousData?.categories ? previousData.categories : "",
    service_title: previousData?.service_title
      ? previousData.service_title
      : "",
    service_price: previousData?.service_price
      ? previousData.service_price
      : "",
    service_desc: previousData?.service_desc ? previousData.service_desc : "",
    media: previousData?.media ? previousData.media : "",
    txt: previousData?.txt ? previousData.txt : "",
    txtclass: previousData?.txtclass ? previousData.txtclass : "",
  });
  const [cat, setCat] = useState(
    data?.categories ? data.categories.split(",").filter(Boolean) : []
  );

  function handlePicture(event) {
    event.preventDefault();
    setPicture(event.target.files[0]);
  }

  const handleServiceChange = (e, key) => {
    setService({
      ...data,
      [key?.name || e?.target?.name || key]:
        e?.value || e?.target?.files?.[0] || e?.target?.value || "",
    });
  };

  const handleDisocunt = (e, key) => {
    setDiscounts({
      ...discounts,
      [key?.name || e?.target?.name || key]:
        e?.value || e?.target?.files?.[0] || e?.target?.value || "",
    });
  };

  const handleArrayEvent = (e, key) => {
    //   console.log(e, key);
    setLinkedServices(e.map((item) => item));
  };

  // async function linkedSubmit(pid) {
  //   try {
  //     // const formData = linked_product?.map((item) => {
  //     //   return {
  //     //     storeID: store_id,
  //     //     parentId: pid,
  //     //     siblingId: item.value,
  //     //   };
  //     // });
  //     const formData = "";
  //     console.log(formData);
  //     const response = await axios.post(
  //       `${url}/v1/store/product/link",
  //       formData
  //     );
  //     console.log(response);
  //     toast.dismiss();
  //     toast("link Products Added", {
  //       type: "success",
  //     });
  //   } catch (error) {
  //     toast.dismiss();
  //     toast(error.response?.data?.error || "link Products Not Added", {
  //       type: "error",
  //     });
  //     console.error(error);
  //   }
  // }
  // async function discountSubmit(pid) {
  //   try {
  //     discounts.service_id = pid;
  //     const formData = discounts;

  //     let disUrl = discounts.discount_id
  //       ? `${url}/v1/discount/update`
  //       : `${url}/v1/admin/create/discount`;

  //     const response = await axios.post(`${disUrl}`, formData, {
  //       headers: { authtoken: authToken, sessionid: session_id },
  //     });
  //     console.log(response);
  //     toast.dismiss();
  //     toast("discount Added", {
  //       type: "success",
  //     });
  //   } catch (error) {
  //     toast.dismiss();
  //     toast(error.response?.data?.error || "discount Not Added", {
  //       type: "error",
  //     });
  //     console.error(error);
  //   }
  // }
  async function formSubmit(formData) {
    if (previousData.service_id) {
      try {
        formData.data["service_id"] = previousData.service_id;
        const response = await axios.post(`${url}/v1/service/add`, formData, {
          headers: { authtoken: authToken, sessionid: session_id },
        });
        console.log(data);
        // if (data.service_price - discounts.rate > 1) {
        //   discountSubmit(response.data.data.service_id);
        // }
        toast.dismiss();
        toast("Service Created", {
          type: "success",
        });
        // console.log(response);
        setPreviousData(response.data.data);
      } catch (error) {
        toast.dismiss();
        toast(error.response?.data?.error || "request failed", {
          type: "error",
        });
        console.error(error.response);
      }
    } else {
      try {
        const response = await axios.post(`${url}/v1/service/add`, formData, {
          headers: { authtoken: authToken, sessionid: session_id },
        });
        console.log(response.data.data);
        // if (data.service_price - discounts.rate > 1) {
        //   discountSubmit(formData.service_id);
        // }
        toast.dismiss();
        toast("Service Created", {
          type: "success",
        });
        setPreviousData(response.data.data);
        // console.log(response);
      } catch (error) {
        toast.dismiss();
        toast(error.response?.data?.error || "request failed", {
          type: "error",
        });
        console.error(error.response);
      }
    }
  }
  async function handleSubmit(event) {
    toast("request loading please wait", {
      progress: true,
    });
    event.preventDefault();
    try {
      if (picture) {
        const pictureData = new FormData();
        pictureData.append("media", picture);
        await axios
          .post(`${url}/v1/store/media/upload`, pictureData, {
            headers: {
              authtoken: authToken,
              sessionid: session_id,
              "Content-Type": "multipart/form-data",
            },
          })
          .then(function (response) {
            console.log(response);
            data.media = "sellers/" + response.data.fileKey;
            console.log(data);
            const formData = {
              data,
              mainCategory: categories.mainCategory,
              childCateogry: categories.childCategory,
              childSubCategory: categories.childSubCategory,
            };
            console.log(formData);
            formSubmit(formData);
          })
          .catch(function (error) {
            toast.dismiss();
            toast(error.response.data || "request failed picture", {
              type: "error",
            });
            console.log(error);
          });
      } else {
        const formData = {
          data,
          mainCategory: categories.mainCategory,
          childCateogry: categories.childCategory,
          childSubCategory: categories.childSubCategory,
        };
        formSubmit(formData);
      }
    } catch (error) {
      toast("request failed", {
        type: "error",
      });
      console.error(error);
    }
  }
  // custo style for select field
  const customColor = (baseStyles) => ({
    ...baseStyles,
    backgroundColor: "rgba(239, 241, 249, 0.6)",
    minHeight: "52px",
  });
  return (
    <div className="content">
      <Productcategory
        trigger={popup}
        setCategories={setCategories}
        categories={categories}
        setCat={setCat}
        setTrigger={setPopup}
      />
      <form onSubmit={handleSubmit} className="adding-form">
        <div className="form-header">
          <div className="back">
            <button className="back-btn" onClick={() => navigate("/services")}>
              <img src={backicon} alt="back" className="back-icon" />
            </button>
          </div>
          <span className="form-heading">
            {previousData.service_title || "Add Service"}
          </span>
          <button type="submit" className="submit-btn addp">
            Save
          </button>
        </div>
        <div className="form-body">
          <div className="form-content">
            <div className="content-right">
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {cat?.map((item, index) => {
                  return (
                    <span className="badge mrs mts" key={index}>
                      {item || "Add Category"}
                    </span>
                  );
                })}
                <span
                  className="badge mrs mts pointer"
                  onClick={() => setPopup(true)}
                >
                  Add Category
                </span>
              </div>
              <div className="form-row">
                <Select
                  styles={{
                    control: customColor,
                  }}
                  defaultValue={servicetype}
                  options={types}
                  placeholder={"Service Type"}
                  className="select-in"
                  id="service_type"
                  name="service_type"
                  onChange={handleServiceChange}
                  required
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Service Title"
                  className="field"
                  name="service_title"
                  id="service_title"
                  value={data.service_title}
                  onChange={handleServiceChange}
                  required
                />
              </div>
              {/* <div>
                <input
                  type="text"
                  placeholder="Service ID"
                  className="field"
                  name="serviceID"
                  id="serviceID"
                  value={data.serviceID}
                  onChange={handleServiceChange}
                  required
                />
              </div> */}
              <div>
                {/* {data.service_price ? (
                  <span className="form-headings">price</span>
                ) : (
                  ""
                )} */}
                <input
                  type="number"
                  name="service_price"
                  id="service_price"
                  placeholder="Price(USD)"
                  value={data.service_price}
                  onChange={handleServiceChange}
                  className="field"
                />
              </div>

              {/* <div>
                <input
                  type="text"
                  name="dimensions"
                  id="dimensions"
                  placeholder="Dimensions"
                  value={data.dimensions}
                  onChange={handleServiceChange}
                  className="field"
                />
              </div> */}
            </div>
            <div className="content-left">
              <div>
                <textarea
                  type="text"
                  name="service_desc"
                  id="service_desc"
                  placeholder="service short Description"
                  value={data.service_desc}
                  onChange={handleServiceChange}
                  className="field description"
                />
              </div>
              {/* <div>
                <span className="form-headings">Discount</span>
              </div>
              <div>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={discounts.title}
                  onChange={handleDisocunt}
                  placeholder="Discount Title"
                  className="field"
                />
              </div>
              <div className="form-row">
                <Select
                  styles={{
                    control: customColor,
                  }}
                  defaultValue={
                    discounts.type
                      ? {
                          label: discounts.type,
                          value: discounts.type,
                        }
                      : ""
                  }
                  options={discountTypes}
                  placeholder={"Discount Type"}
                  className="select-in"
                  id="type"
                  name="type"
                  onChange={handleDisocunt}
                />
              </div>
              <div>
                <input
                  type="number"
                  name="rate"
                  id="rate"
                  value={discounts.rate}
                  onChange={handleDisocunt}
                  placeholder="Discount Rate"
                  className="field"
                />
              </div>
              <div className="form-row">
                <div className="dis-date">
                  <span className="dis-label">Discount Start Date</span>
                  <input
                    type="date"
                    name="startDateTime"
                    id="startDateTime"
                    defaultValue={
                      discounts?.startDateTime
                        ? format(
                            new Date(discounts?.startDateTime),
                            "yyyy-MM-dd"
                          )
                        : ""
                    }
                    // value={discounts.startDateTime}
                    onChange={handleDisocunt}
                    placeholder="Discount Start Date"
                    className="field"
                  />
                </div>

                <div className="dis-date">
                  <span className="dis-label">Discount End Date</span>
                  <input
                    type="date"
                    name="endDateTime"
                    id="endDateTime"
                    defaultValue={
                      discounts?.endDateTime
                        ? format(new Date(discounts?.endDateTime), "yyyy-MM-dd")
                        : ""
                    }
                    // value={discounts.endDateTime}
                    onChange={handleDisocunt}
                    // placeholder="Discount End Date"
                    className="field"
                  />
                </div>
              </div> */}
            </div>
          </div>
          <div className="form-image">
            <div className="image-sec">
              <div className="imageicon">
                {/* <img src={imageicon} alt="image" /> */}
                <img
                  src={
                    picture
                      ? URL.createObjectURL(picture)
                      : data.media
                      ? data?.media.substring(0, 4) === "http"
                        ? data.media
                        : "https://petsetgostorage.blob.core.windows.net/petsetgo-u2/" +
                          data.media
                      : imageicon
                  }
                  alt="image"
                  className="image"
                />
              </div>
              <div className="imagehead">
                <label htmlFor="img_id" style={{ cursor: "pointer" }}>
                  Upload image and videos
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
          </div>
        </div>
        {/* <div className="form-footer">
          <div className="linked">
         
            <div className="linked">
              <span className="form-headings">Tax Information</span>
              <div className="form-row tax-fields">
                <Select
                  styles={{
                    control: customColor,
                  }}
                  defaultValue={taxx}
                  options={tax}
                  className=" tax-field"
                  name="txt"
                  id="txt"
                  placeholder={"Tax"}
                  onChange={handleServiceChange}
                  // onChange={handleTax}
                />
                <Select
                  styles={{
                    control: customColor,
                  }}
                  defaultValue={tax_classs}
                  options={tax_class}
                  placeholder={"Tax Class"}
                  className=" tax-field"
                  name="txtclass"
                  id="txtclass"
                  onChange={handleServiceChange}
                />
              </div>
            </div>
          </div>
        </div> */}
      </form>
      <ToastContainer />
    </div>
  );
}
