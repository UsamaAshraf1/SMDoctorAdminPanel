import React, { useState } from "react";
import cross from "../assets/cross.png";
import Select from "react-select";
import axios from "axios";
import { useEffect } from "react";
import { url } from "../utils/urls.js";

export default function Productcategory(props) {
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
  const [categories, setProduct] = useState(props.categories);
  // console.log(categories);
  const [categ, setCateg] = useState([]);
  const [childOP, setChildOP] = useState([]);
  const [chipData, setchipData] = useState({
    mainCategory: [],
    childCategory: [],
    childSubCategory: [],
  });
  const [subOP, setsubOP] = useState([]);

  function flattenArray(arr) {
    let flatArray = [];
    arr.map((obj) => {
      // console.log(obj);
      if (obj.childCategories.length > 0) {
        obj.childCategories.map((item) => {
          flatArray.push(item);
        });
      }
    });
    return flatArray;
  }
  function flateArray(arr) {
    let flatArray = [];
    arr.map((obj) => {
      // console.log(obj);
      if (obj.childCategories.length > 0) {
        obj.childCategories.map((item) => {
          if (item.sub_categories.length > 0) {
            item.sub_categories.map((e) => {
              flatArray.push(e);
            });
          }
        });
      }
    });
    return flatArray;
  }
  const fetchdata = async () => {
    const rescat = await axios
      .get(`${url}/v1/department/get/all`, {
        headers: { authtoken: authToken, sessionid: session_id },
      })
      .catch((err) => console.log(err));
    if (rescat) {
      setCateg(rescat.data.data || "");

      const simpleArray = flattenArray(rescat.data.data);
      const childoptions = simpleArray.map((e) => {
        return {
          label: e.des,
          value: e.child_cid,
        };
      });

      const subArray = flateArray(rescat.data.data);
      const suboptions = subArray.map((e) => {
        return {
          label: e.des,
          value: e.sub_cid,
        };
      });
      setChildOP(childoptions);
      setsubOP(suboptions);
    }
  };
  useEffect(() => {
    fetchdata();
  }, []);
  // console.log(product);
  const handleArrayEvent = (e, key) => {
    setProduct({
      ...categories,
      [key]: e.map((e) => {
        if (key === "mainCategory") {
          return {
            categoryCid: e.value,
          };
        } else if (key === "childSubCategory") {
          return {
            subCategorySubCid: e.value,
          };
        } else {
          return {
            childCategoryChildCid: e.value,
          };
        }
      }),
    });
    // console.log(e);
    setchipData({
      ...chipData,
      [key]: e.map((e) => {
        if (key === "mainCategory") {
          return {
            label: e.label,
          };
        } else if (key === "childSubCategory") {
          return {
            label: e.label,
          };
        } else {
          return {
            label: e.label,
          };
        }
      }),
    });
  };

  const parentOP = categ.map((item) => {
    return {
      label: item.des,
      value: item.cid,
    };
  });

  function chips() {
    const main = chipData?.mainCategory?.map((e) => e.label);
    const child = chipData?.childCategory?.map((e) => e.label);
    const sub = chipData?.childSubCategory?.map((e) => e.label);
    // console.log(sub);
    props.setCat([...main, ...child, ...sub]);
  }

  return props.trigger ? (
    <div className="popup">
      <div className="popup-content">
        <div className="popup-header">
          <div className="popup-heading">Select Category</div>
          <button
            className="icon-btn"
            onClick={() => {
              props.setTrigger(false);
              setProduct(props.categories);
            }}
          >
            <img src={cross} alt="cross icon" />
          </button>
        </div>
        <Select
          options={parentOP}
          isMulti
          placeholder="Parent Category"
          onChange={(e) => handleArrayEvent(e, "mainCategory")}
        />
        <Select
          options={childOP}
          isMulti
          placeholder="Child Category"
          onChange={(e) => handleArrayEvent(e, "childCategory")}
        />
        {/* <Select
          options={subOP}
          isMulti
          placeholder="Sub Category"
          onChange={(e) => handleArrayEvent(e, "childSubCategory")}
        /> */}
        <div className="seller-btns">
          <button
            className="seller-cancel seller-btn"
            onClick={() => {
              props.setTrigger(false);
              setProduct(props.categories);
            }}
          >
            Cancel
          </button>
          <button
            className="seller-save seller-btn"
            onClick={() => {
              props.setTrigger(false);
              props.setCategories(categories);
              chips();
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  ) : (
    ""
  );
}
