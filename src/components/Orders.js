import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { usePagination, useTable, useSortBy } from "react-table";
import Select from "react-select";
import { Navigate, NavLink, useNavigate } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import { COLUMNS_ORDERS } from "../utils/Col.js";
import SellerAdd from "./Newseller";
import "../styles/table.css";
import { ToastContainer, toast } from "react-toastify";
import { url } from "../utils/urls.js";

export default function Orders(props) {
  const userData = localStorage.getItem("user");
  const doctorData = JSON.parse(userData);
  const doctorId = doctorData?.data?.id;
  // console.log(props);
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
  const [storeid, setStoreid] = useState(props.storeId);
  const [orders, setOrders] = useState([]);
  const [apiData, setApiData] = useState([]);
  const [string, setString] = useState("");
  const [expState, setExpState] = useState(false);
  const [exportDates, setExportDates] = useState({
    from: null,
    to: null,
  });
  // console.log(orders);
  const nav = useNavigate();
  useEffect(() => {
    if (props.storeId) {
      setStoreid(props.storeId);
    }
  });

  const downloadCSV = async () => {
    if (exportDates.from && exportDates.to) {
      toast("Request loading please wait", {
        progress: true,
      });
      try {
        const response = await axios.get(
          `${url}/v1/admin/exports/order?store_id=${storeid}&from=${exportDates.from}&to=${exportDates.to}`,
          { headers: { authtoken: authToken, sessionid: session_id } }
        );
        toast.dismiss();
        console.log(response);
        const url = URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "products.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        toast.dismiss();
        toast("request failed", {
          type: "error",
        });
        console.log(error);
      }
    } else {
      toast("enter date", {
        type: "info",
      });
    }
  };

  const fetchdata = async () => {
    toast("Orders loading please wait", {
      progress: true,
    });
    try {
      const response = await axios.get(
        `${url}/v1/order/doctor/get?doctor_id=${doctorId}`,
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
    fetchdata();
    props.setName("Appointmants");
    setString("");
  }, [storeid]);

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
  const columns = useMemo(() => COLUMNS_ORDERS, []);
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
              {/* <span
                className="bigger-font"
                onClick={(r) => {
                  nav("order");
                }}
              >
                Customer Order’s Summary
              </span> */}
            </div>
            {!expState ? (
              <div className="search-div">
                <input
                  type="search"
                  className="search-product"
                  id="string"
                  name="string"
                  value={string}
                  onChange={handleString}
                  placeholder="Search"
                />

                <button
                  className="search-btn"
                  onClick={(e) => search(string, e)}
                >
                  Search
                </button>
                <button
                  className="search-btn"
                  onClick={(e) => setExpState(!expState)}
                >
                  Export
                </button>
              </div>
            ) : (
              <div className="search-div">
                <input
                  type="date"
                  className="search-product"
                  id="from"
                  name="from"
                  value={exportDates.from}
                  onChange={(e) =>
                    setExportDates({
                      ...exportDates,
                      from: e.target.value,
                    })
                  }
                  // placeholder="Search"
                />
                <input
                  type="date"
                  className="search-product"
                  id="to"
                  name="to"
                  value={exportDates.to}
                  onChange={(e) =>
                    setExportDates({ ...exportDates, to: e.target.value })
                  }
                  // placeholder="Search"
                />
                <button className="search-btn" onClick={downloadCSV}>
                  Submit
                </button>
                <button
                  className="search-btn"
                  onClick={(e) => setExpState(!expState)}
                >
                  Search
                </button>
              </div>
            )}
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
              <span className="tpg">No Orders Availiable in this Store</span>
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
