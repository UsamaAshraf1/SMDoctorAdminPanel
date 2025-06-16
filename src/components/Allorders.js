import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { usePagination, useTable, useSortBy } from "react-table";
import Select from "react-select";
import { Navigate, NavLink, useNavigate } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import { ALL_ORDERS } from "../utils/Col.js";
import SellerAdd from "./Newseller";
import "../styles/table.css";
import { ToastContainer, toast } from "react-toastify";
import { url } from "../utils/urls.js";

export default function Allorders(props) {
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
  //   const [storeid, setStoreid] = useState(props.storeId);
  const [orders, setOrders] = useState([]);
  const [apiData, setApiData] = useState([]);
  const [string, setString] = useState("");
  const [pageNumber, setpageNumber] = useState(1);
  // console.log(orders);
  const nav = useNavigate();
  //   useEffect(() => {
  //     if (props.storeId) {
  //       setStoreid(props.storeId);
  //     }
  //   });
  const fetchdata = async (page) => {
    toast("Orders loading please wait", {
      progress: true,
    });
    try {
      const response = await axios.get(
        `${url}/v1/order/latest/get?pageNumber=${page}`,
        {
          headers: { authtoken: authToken, sessionid: session_id },
        }
      );
      // .catch((err) => {
      //   toast.dismiss();
      //   console.log(err);
      //   setOrders([]);
      //   setApiData([]);
      // });
      console.log(response.data.data);
      const resdata = [...response.data.data].sort((p1, p2) =>
        p1.createdAt < p2.createdAt ? 1 : p1.createdAt > p2.createdAt ? -1 : 0
      );
      toast.dismiss();
      // console.log(resdata);
      setOrders(resdata);
      setApiData(resdata);
      setPageSize(20);
    } catch (error) {
      toast.dismiss();
      console.log(error);
      setOrders([]);
      setApiData([]);
      toast(error.response?.data?.error || "request failed", {
        type: "error",
      });
    }
  };

  useEffect(() => {
    fetchdata(pageNumber);
    props.setName("All Orders");
    setString("");
  }, []);

  const handleString = (e) => {
    // console.log(e.target.value);
    setString(e.target.value);
    if (e.target.value === "") {
      setOrders(apiData);
    }
  };

  function search(string, e) {
    e.preventDefault();
    console.log(string);
    console.log(typeof string);
    if (string) {
      const filtered = orders?.filter((item) => {
        // console.log(item.orderID.toLowerCase());
        return item?.orderID?.toLowerCase().includes(string.toLowerCase());
      });
      setOrders(filtered);
      console.log(filtered);
      // setString("");
    }
  }

  // console.log(orders);
  const data = useMemo(() => orders, [orders]);
  const columns = useMemo(() => ALL_ORDERS, []);
  const tableinstance = useTable({ columns, data }, useSortBy, usePagination);
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    previousPage,
    gotoPage,
    pageOptions,
    state,
    pageCount,
    setPageSize,
    prepareRow,
  } = tableinstance;
  const { pageIndex } = state;

  return (
    <div className="page">
      <div className="content ordersc">
        {/* <div className="add-link">
          <div className="seller">
            <button
              className="cat-popup page-big-headings"
              onClick={() => setPopup(true)}
            >
              Add new Seller
            </button>
            <SellerAdd trigger={popup} setTrigger={setPopup} />
            <NavLink className="product-link" to="/sellers/add-seller">
              <span className="page-big-headings">Add New Seller</span>
            </NavLink>
            <span className="med-font">Onboard a new Seller</span>
          </div>
        </div> */}
        <div className="sellers-data">
          <div className="sellers">
            <div>
              <span
                className="bigger-font"
                // onClick={(r) => {
                //   nav("order");
                // }}
              >
                Whole Order’s Summary
              </span>
            </div>
            <div className="search-div">
              <input
                type="search"
                className="search-category"
                placeholder="Search"
                id="string"
                name="string"
                value={string}
                onChange={handleString}
              />
              <div>
                <button
                  className="search-btn"
                  onClick={(e) => search(string, e)}
                >
                  Search
                </button>
              </div>
            </div>
          </div>
          {orders.length ? (
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
                          nav("order", {
                            state: {
                              data: orders.find(
                                (item) => item.orderID === row.values.orderID
                              ),
                            },
                          });
                        }}
                        className="tr"
                        style={{ cursor: "pointer" }}
                      >
                        {row.cells.map((cell) => {
                          return (
                            <td {...cell.getCellProps()}>
                              {/* {cell.render("Cell")} */}
                              {/^\d+\.\d+$/.test(cell.value)
                                ? Number(cell.value).toFixed(2)
                                : cell.render("Cell")}
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
                  onClick={() => {
                    // gotoPage(0);
                    fetchdata(1);
                    setpageNumber(1);
                  }}
                  className={pageNumber >= 2 ? "ablepagibtn" : "pagination-btn"}
                >
                  {"<<"}
                </button>
                <button
                  onClick={() => {
                    // previousPage();
                    if (pageNumber >= 2) {
                      setpageNumber(pageNumber - 1);
                      fetchdata(pageNumber - 1);
                      console.log(pageNumber);
                    }
                  }}
                  className={pageNumber >= 2 ? "ablepagibtn" : "pagination-btn"}
                >
                  Prev{" "}
                </button>
                <span className="pagination-btn">{pageNumber}</span>
                <button
                  onClick={() => {
                    // nextPage();
                    setpageNumber(pageNumber + 1);
                    fetchdata(pageNumber + 1);
                    console.log(pageNumber);
                  }}
                  className={
                    pageIndex + 1 < pageCount ? "ablepagibtn" : "pagination-btn"
                  }
                >
                  Next
                </button>
                <button
                  onClick={() => {
                    // gotoPage(pageCount - 1);
                    setpageNumber(pageNumber + 2);
                    fetchdata(pageNumber + 2);
                    console.log(pageNumber);
                  }}
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
              <span className="tpg">No Orders Availiable to show</span>
              {pageNumber !== 1 ? (
                <div className="pagination-btns">
                  <button
                    onClick={() => {
                      // gotoPage(0);
                      fetchdata(1);
                      setpageNumber(1);
                    }}
                    className={
                      pageNumber >= 2 ? "ablepagibtn" : "pagination-btn"
                    }
                  >
                    {"back to page 1"}
                  </button>
                </div>
              ) : (
                ""
              )}
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
