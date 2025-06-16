import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/addforms.css";
import CreatableSelect from "react-select";
import imageicon from "../assets/Imageicon.png";
import cross from "../assets/cross.png";
import { toast, ToastContainer } from "react-toastify";
import Select from "react-select";
import { url } from "../utils/urls";

export default function AddDoctor(props) {
  // console.log(props.categories);
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
  const [defaultParent, setdefaulParent] = useState("");
  const [defaultchild, setdefaulChild] = useState("");
  // console.log(props.previosData);
  const types = [
    // {
    //   label: "Product",
    //   value: "product",
    // },
    {
      label: "Service",
      value: "service",
    },
  ];
  useEffect(() => {
    setPreviosData(props?.previosData);
    setMedia(props?.previosData?.media ? props.previosData?.media : "");

    if (props?.previosData?.des) {
      setDes(props.previosData.des);
      setName(props.previosData.name);
    } else {
      setDes("");
      setName("");
    }
    setType(props?.previosData?.type ? props.previosData?.type : "");
  }, [props.trigger === true]);
  const [parentOP, setParentOP] = useState("");
  const [previosData, setPreviosData] = useState("");
  const [des, setDes] = useState("");
  const [name, setName] = useState("");
  const [parentCategory, setParentCategory] = useState(undefined);
  const [childCategory, setChildCategory] = useState(undefined);
  const [type, setType] = useState(undefined);
  const [categories, setCategories] = useState([]);
  const [subCat, setSubCat] = useState([]);
  const [picture, setPicture] = useState("");
  let [media, setMedia] = useState("");
  // console.log(type);
  function empty() {
    setDes("");
    setName("");
    setParentCategory("");
    setType("");
    setChildCategory("");
    setPicture("");
    setMedia("");
    setPreviosData("");
    setdefaulParent("");
    props.setTrigger(false);
  }

  const getCategory = async function (props) {
    const categoryRes = await axios.get(`${url}/v1/department/get/all`, {
      headers: { authtoken: authToken, sessionid: session_id },
    });
    // console.log(categoryRes.data.data);
    setCategories(categoryRes.data.data);
    const categoriesArray = categoryRes.data.data.map((e) => {
      return {
        label: e.des,
        value: e.cid,
      };
    });
    setParentOP(categoriesArray);
  };
  useEffect(() => {
    getCategory();
  }, []);

  const handleCategory = function (e) {
    const value = e.value;
    console.log(value);
    setParentCategory(value);
    console.log(categories);
    const subchildCat = categories.find((obj) => obj.cid === value);
    console.log(subchildCat);
    const subchildCatArray = subchildCat.childCategories.map((e) => {
      return {
        label: e.des,
        value: e.child_cid,
      };
    });
    setSubCat(subchildCatArray);
  };

  function handlePicture(event) {
    event.preventDefault();
    setPicture(event.target.files[0]);
  }

  // updating Categories /////
  /////////////////////////////////////////////////////////////

  async function handleUpdate(e) {
    e.preventDefault();
    toast("category updating please wait", {
      progress: true,
    });
    try {
      if (picture) {
        const pictureData = new FormData();
        pictureData.append("media", picture);
        const picResponse = await axios.post(
          `${url}/v1/store/media/upload`,
          pictureData,
          {
            headers: {
              authtoken: authToken,
              sessionid: session_id,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        // console.log(picResponse);
        media = "sellers/" + picResponse.data.fileKey;
        console.log(media);
        if (!previosData.sub_cid && !previosData.child_cid) {
          try {
            const formData = {
              // type: type,
              des: des,
              name: name,
              media: media,
              cid: props.previosData.id,
            };
            console.log(formData);
            const response = await axios.post(
              `${url}/v1/category/update`,
              formData,
              { headers: { authtoken: authToken, sessionid: session_id } }
            );
            console.log(response);
            toast.dismiss();
            toast("Parent category updated", { type: "success" });
            empty();
          } catch (error) {
            toast(error.response?.data?.error || "request failed", {
              type: "error",
            });
            console.log(error);
          }
        } else if (!props.previosData.sub_cid) {
          try {
            const formData = {
              parentCategory: props.previosData.parentCategory,
              des: des,
              media: media,
              type: type,
              child_cid: props.previosData.child_cid,
            };
            console.log(formData);
            const response = await axios.post(
              `${url}/v1/category/sub/update`,
              formData,
              { headers: { authtoken: authToken, sessionid: session_id } }
            );
            console.log(response);
            toast.dismiss();
            toast("Child category updated", { type: "success" });
          } catch (error) {
            toast(error.response?.data?.error || "request failed", {
              type: "error",
            });
            console.log(error);
          }
        } else {
          try {
            const formData = {
              child_cid: props.previosData.child_cid,
              sub_cid: props.previosData.sub_cid,
              des: des,
              media: media,
              type: type,
            };
            console.log(formData);
            const response = await axios.post(
              `${url}/v1/category/sub/child/update`,
              formData,
              { headers: { authtoken: authToken, sessionid: session_id } }
            );
            toast.dismiss();
            toast("Sub category updated", { type: "success" });
            console.log(response);
          } catch (error) {
            toast(error.response?.data?.error || "request failed", {
              type: "error",
            });
            console.log(error);
          }
        }
      } else {
        // /////////////////////////////////////////
        // updating without updating picture///////
        if (!previosData.sub_cid && !previosData.child_cid) {
          try {
            const formData = {
              // type: type,
              des: des,
              name: name,
              media: media,
              id: props.previosData.id,
            };
            console.log(formData);
            const response = await axios.post(
              `${url}/v1/department/update`,
              formData,
              { headers: { authtoken: authToken, sessionid: session_id } }
            );
            console.log(response);
            toast.dismiss();
            toast("Parent category updated", { type: "success" });
            props.setTrigger(false);
          } catch (error) {
            toast(error.response?.data?.error || "request failed", {
              type: "error",
            });
            console.log(error);
          }
        } else if (!props.previosData.sub_cid) {
          try {
            const formData = {
              parentCategory: props.previosData.parentCategory,
              des: des,
              media: media,
              type: type,
              child_cid: props.previosData.child_cid,
            };
            console.log(formData);
            const response = await axios.post(
              `${url}/v1/category/sub/update`,
              formData,
              { headers: { authtoken: authToken, sessionid: session_id } }
            );
            console.log(response);
            toast.dismiss();
            toast("Child category updated", { type: "success" });
          } catch (error) {
            toast(error.response?.data?.error || "request failed", {
              type: "error",
            });
            console.log(error);
          }
        } else {
          try {
            const formData = {
              child_cid: props.previosData.child_cid,
              sub_cid: props.previosData.sub_cid,
              des: des,
              media: media,
              type: type,
            };
            console.log(formData);
            const response = await axios.post(
              `${url}/v1/category/sub/child/update`,
              formData,
              { headers: { authtoken: authToken, sessionid: session_id } }
            );
            toast.dismiss();
            toast("Sub category updated", { type: "success" });
            console.log(response);
          } catch (error) {
            toast(error.response?.data?.error || "request failed", {
              type: "error",
            });
            console.log(error);
          }
        }
      }
    } catch (error) {
      toast(error.response?.data?.message || "request failed", {
        type: "error",
      });
      console.error(error);
    }
  }

  // creating categories ////
  ////////////////////////////////////////////////////////////////

  async function handleSubmit(event) {
    event.preventDefault();
    toast("request loading please wait", {
      progress: true,
    });
    try {
      if (picture) {
        const pictureData = new FormData();
        pictureData.append("media", picture);
        const picResponse = await axios.post(
          `${url}/v1/store/media/upload`,
          pictureData,
          {
            headers: {
              authtoken: authToken,
              sessionid: session_id,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log(picResponse);
        media = picResponse.data.key;
        // if (!parentCategory && !childCategory) {
        //   try {
        //     const formData = {
        //       type,
        //       des,
        //       media,
        //     };
        //     console.log(formData);
        //     const response = await axios.post(
        //       `${url}/v1/category/create`,
        //       formData,
        //       { headers: { authtoken: authToken, sessionid: session_id } }
        //     );
        //     console.log(response);
        //     toast.dismiss();
        //     toast("Parent category added", { type: "success" });
        //   } catch (error) {
        //     toast(error.response?.data?.message || "request failed", {
        //       type: "error",
        //     });
        //     console.log(error);
        //   }
        // } else
        if (!childCategory) {
          try {
            const formData = {
              parentCategory: parentCategory,
              des,

              media,
            };
            console.log(formData);
            const response = await axios.post(
              `${url}/v1/category/sub/create`,
              formData,
              { headers: { authtoken: authToken, sessionid: session_id } }
            );
            console.log(response);
            toast.dismiss();
            toast("Child category added", { type: "success" });
          } catch (error) {
            toast(error.response?.data?.message || "request failed", {
              type: "error",
            });
            console.log(error);
          }
        } else {
          try {
            const formData = {
              child_cid: childCategory,
              des,
              media,
            };
            console.log(formData);
            const response = await axios.post(
              `${url}/v1/category/sub/child/create`,
              formData,
              { headers: { authtoken: authToken, sessionid: session_id } }
            );
            toast.dismiss();
            toast("Sub category added", { type: "success" });
            console.log(response);
          } catch (error) {
            toast(error.response?.data?.message || "request failed", {
              type: "error",
            });
            console.log(error);
          }
        }
      } else if (!parentCategory && !childCategory) {
        try {
          const formData = {
            // type,
            des,
            name,
            shortDes: des,
            media,
          };
          console.log(formData);
          const response = await axios.post(
            `${url}/v1/department/create`,
            formData,
            { headers: { authtoken: authToken, sessionid: session_id } }
          );
          console.log(response);
          toast.dismiss();
          toast("Parent category added", { type: "success" });
          props.setTrigger(false);
        } catch (error) {
          toast(error.response?.data?.message || "request failed", {
            type: "error",
          });
          console.log(error);
        }
      } else {
        toast("Choose a picture", { type: "error" });
      }
    } catch (error) {
      toast(error.response?.data?.message || "request failed", {
        type: "error",
      });
      console.error(error);
    }
  }

  const customColor = (baseStyles) => ({
    ...baseStyles,
    background: "rgba(239, 241, 249, 0.6)",
    minHeight: "52px",
  });
  return props.trigger ? (
    <div className="add-category popup">
      <div className="popup-content">
        <div className="popup-header">
          <div className="category-heading popup-heading">Add Doctor</div>
          <button
            className="icon-btn"
            style={{ cursor: "Pointer" }}
            onClick={() => {
              empty();
            }}
          >
            <img src={cross} alt="cross icon" />
          </button>
        </div>
        <form onSubmit={props.previosData ? handleUpdate : handleSubmit}>
          <div className="category-form">
            <div className="cat-fields">
              <div>
                <input
                  required
                  name="name"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name"
                  className="field "
                />
              </div>
              <div>
                <input
                  required
                  name="des"
                  id="des"
                  value={des}
                  onChange={(e) => setDes(e.target.value)}
                  placeholder="Description"
                  className="field "
                />
              </div>
              {/* <div className="res-field">
                <Select
                  styles={{
                    control: customColor,
                  }}
                  options={parentOP}
                  defaultValue={
                    props?.relatedPcategory ? props.relatedPcategory : ""
                  }
                  placeholder="Parent Category"
                  onChange={handleCategory}
                />
              </div>
              <div className="res-field">
                <Select
                  styles={{
                    control: customColor,
                  }}
                  options={subCat}
                  placeholder="Child Category"
                  onChange={(e) => setChildCategory(e.value)}
                />
              </div> */}
              {/* <div className="res-field">
                
                <Select
                  styles={{
                    control: customColor,
                  }}
                  options={types}
                  placeholder="Type"
                  defaultValue={
                    props?.previosData?.type === "product"
                      ? { label: "Product", value: "product" }
                      : props?.previosData?.type === "service"
                      ? { label: "Service", value: "service" }
                      : ""
                  }
                  onChange={(e) => setType(e.value)}
                />
              </div> */}
            </div>
            <div className="category-images">
              <div className="small-image">
                <div className="image-sec-small">
                  <div className="imageicon">
                    {/* <img src={imageicon} alt="image" /> */}
                    <img
                      src={
                        picture
                          ? URL.createObjectURL(picture)
                          : media
                          ? media?.substring(0, 4) === "http"
                            ? media
                            : "https://petsetgostorage.blob.core.windows.net/petsetgo-u2/" +
                              media
                          : imageicon
                      }
                      alt="image"
                      className="image"
                    />
                  </div>
                  <div className="imagehead">
                    <label htmlFor="img_id" style={{ cursor: "pointer" }}>
                      Upload images
                    </label>
                    <input
                      type="file"
                      name="img_id"
                      id="img_id"
                      onChange={handlePicture}
                      className="file"
                    />
                  </div>
                </div>
                <div className="empty-image"></div>
              </div>
            </div>
            <div className="form-btns">
              <button
                className="cancel-btn"
                style={{ cursor: "Pointer" }}
                onClick={() => {
                  empty();
                }}
              >
                Cancel
              </button>
              <button
                className="save-btn"
                type="submit"
                style={{ cursor: "pointer" }}
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  ) : (
    ""
  );
}
