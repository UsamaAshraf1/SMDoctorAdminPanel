import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { usePagination, useRowSelect, useSortBy, useTable } from "react-table";
import { NavLink, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { COUPONSC } from "../utils/Col.js";
import Couponpop from "./Couponpop.js";
import CouponUpdate from "./CouponUpdate.js";
import Deletecoupon from "./Deletecoupon.js";
import { url } from "../utils/urls.js";

export default function Coupons(props) {
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
  const [coupons, setCoupons] = useState([]);
  const [popup, setPopup] = useState(false);
  const [deletePopup, setdeletePopup] = useState(false);
  const [updatepopup, setupdatePopup] = useState(false);
  const [couponsCodes, setCouponsCodes] = useState([]);
  const [apiData, setApiData] = useState([]);
  const [preData, setPreData] = useState("");
  const [storeid, setStoreid] = useState(props.storeId);

  const fetchdata = async () => {
    toast("Coupons loading please wait", {
      progress: true,
    });
    try {
      const response = await axios.get(`${url}/v1/discount/get`, {
        headers: { authtoken: authToken, sessionid: session_id },
      });
      toast.dismiss();
      if (response) {
        const resdata = [...response.data.data].sort((p1, p2) =>
          p1.updatedAt < p2.updatedAt ? 1 : p1.updatedAt > p2.updatedAt ? -1 : 0
        );
        // console.log(resdata);
        setCoupons(resdata);
        setApiData(resdata);
        setPageSize(20);
      }
    } catch (error) {
      toast.dismiss();
      console.log(error);
      setCoupons([]);
      setApiData([]);
    }
  };

  async function deleteCoup(e) {
    e.preventDefault();
    toast.dismiss();
    if (selectedFlatRows.length) {
      const arrayofcouponcodes = selectedFlatRows.map(
        (e) => e.original.couponsCode
      );
      // console.log(arrayofcouponcodes);
      setCouponsCodes(arrayofcouponcodes);
      setdeletePopup(true);
    } else {
      toast("Select Coupon first", {
        type: "info",
      });
    }
  }

  useEffect(() => {
    props.setName("Coupons");
    fetchdata();
  }, []);

  const data = useMemo(() => coupons, [coupons]);
  const columns = useMemo(() => COUPONSC, []);
  const tableinstance = useTable(
    { columns, data },
    useSortBy,
    usePagination,
    useRowSelect
  );
  const {
    getTableProps,
    getTableBodyProps,
    selectedFlatRows,
    headerGroups,
    page,
    nextPage,
    previousPage,
    gotoPage,
    pageOptions,
    setPageSize,
    state,
    pageCount,
    prepareRow,
  } = tableinstance;
  const { pageIndex } = state;

  return (
    <div className="page">
      <div className="content">
        <Couponpop
          trigger={popup}
          setTrigger={setPopup}
          fetchdata={fetchdata}
        />
        <CouponUpdate
          trigger={updatepopup}
          setTrigger={setupdatePopup}
          preData={preData}
          fetchdata={fetchdata}
        />
        <Deletecoupon
          trigger={deletePopup}
          setTrigger={setdeletePopup}
          couponsCodes={couponsCodes}
          setCouponsCodes={setCouponsCodes}
          fetchdata={fetchdata}
        />
        <div className="add-link">
          <div className="tab">
            <button
              className="cat-popup page-big-headings"
              onClick={() => {
                setPopup(true);
              }}
            >
              Create Discount Coupon
            </button>
            <span className="med-font">
              Create a coupon for store wide discounts
            </span>
          </div>
          <div className="bulk-upload tab">
            <span
              className="page-big-headings"
              style={{ cursor: "pointer" }}
              onClick={(e) => deleteCoup(e)}
            >
              Delete Coupon
            </span>
            <span className="med-font">Select Coupon to Delete</span>
          </div>
        </div>

        <div className="services-data">
          <div className="services">
            <div>
              <span className="bigger-font">Discount Coupons</span>
            </div>
            <div className="search-div"></div>
          </div>
          {data.length ? (
            <div className="table">
              <table {...getTableProps()}>
                <thead>
                  {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <th
                          {...column.getHeaderProps(
                            column.getSortByToggleProps()
                          )}
                        >
                          {column.render("Header")}
                          {column.isSorted
                            ? column.isSortedDesc
                              ? "🔽"
                              : "🔼"
                            : ""}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                  {page.map((row) => {
                    prepareRow(row);
                    return (
                      <tr
                        {...row.getRowProps()}
                        onClick={(r) => {
                          setupdatePopup(true);
                          const data = coupons.find((i) => {
                            return row.original.couponsCode === i.couponsCode;
                          });
                          setPreData(data);
                        }}
                        className="tr"
                        style={{ cursor: "pointer" }}
                      >
                        {row.cells.map((cell) => {
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
              <div className="pagination-btns">
                <button
                  onClick={() => gotoPage(0)}
                  className={pageIndex > 0 ? "ablepagibtn" : "pagination-btn"}
                >
                  {"<<"}
                </button>
                <button
                  onClick={() => previousPage()}
                  className={pageIndex > 0 ? "ablepagibtn" : "pagination-btn"}
                >
                  Prev{" "}
                </button>
                <span className="pagination-btn">
                  {pageIndex + 1} of {pageOptions.length}
                </span>
                <button
                  onClick={() => nextPage()}
                  className={
                    pageIndex + 1 < pageCount ? "ablepagibtn" : "pagination-btn"
                  }
                >
                  Next
                </button>
                <button
                  onClick={() => gotoPage(pageCount - 1)}
                  className={
                    pageIndex + 1 < pageCount ? "ablepagibtn" : "pagination-btn"
                  }
                >
                  {">>"}
                </button>
              </div>
            </div>
          ) : (
            <div className="table-pg">
              <span className="tpg">No Coupons available</span>
            </div>
          )}
        </div>
      </div>
      <ToastContainer></ToastContainer>
    </div>
  );
}
