import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { usePagination, useRowSelect, useSortBy, useTable } from "react-table";
import { NavLink, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

import { SERVICES_COLUMNS } from "../utils/Col.js";
import { Dropdown } from "react-bootstrap";
import "../styles/table.css";
import { url as apiUrl } from "../utils/urls.js";

export default function Services(props) {
  // console.log(props.storeId);
  useEffect(() => {
    if (props.storeId) {
      setStoreid(props.storeId);
    }
  });
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
  const nav = useNavigate();
  const [services, setService] = useState([]);
  const [apiData, setApiData] = useState([]);
  const [string, setString] = useState("");
  const [storeid, setStoreid] = useState(props.storeId);
  const fetchdata = async () => {
    toast("Services loading please wait", {
      progress: true,
    });
    try {
      if (storeid) {
        const response = await axios.get(
          `${apiUrl}/v1/service/get?store_id=${storeid}`,
          { headers: { authtoken: authToken, sessionid: session_id } }
        );
        toast.dismiss();
        if (response) {
          const resdata = [...response.data.data].sort((p1, p2) =>
            p1.serviceID < p2.serviceID
              ? 1
              : p1.serviceID > p2.serviceID
              ? -1
              : 0
          );
          // console.log(resdata);
          setService(resdata);
          setApiData(resdata);
          setPageSize(20);
        }
      }
    } catch (error) {
      toast.dismiss();
      toast(error.response?.data?.message || "request failed", {
        type: "error",
      });
      console.log(error);
      setService([]);
      setApiData([]);
    }
  };

  const downloadCSV = async () => {
    toast("Request loading please wait", {
      progress: true,
    });
    try {
      const response = await axios.get(
        `${apiUrl}/v1/admin/exports/services?store_id=${props.storeId}`,
        { headers: { authtoken: authToken, sessionid: session_id } }
      );
      toast.dismiss();
      console.log(response);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "services.csv");
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
  };

  async function deleteProd(e) {
    e.preventDefault();
    // console.log(e);
    // console.log(selectedFlatRows[0].original);
    if (selectedFlatRows.length) {
      const arrayOfSerId = selectedFlatRows.map((e) => e.original.service_id);
      try {
        toast(arrayOfSerId.length + " item is getting deleted , please wait!", {
          progress: true,
        });
        const data = { data: arrayOfSerId };
        const response = await axios.post(`${apiUrl}/v1/service/delete`, data, {
          header: "Content-Type: application/json",
        });
        if (response) {
          console.log(response);
          toast.dismiss();
          toast("Request Successfull", {
            type: "success",
          });
          fetchdata();
        }
      } catch (error) {
        console.error(error);
        toast.dismiss();
        toast("request Failed", {
          type: "error",
        });
      }
    } else {
      toast("Select any Service first", {
        type: "info",
      });
    }
  }

  useEffect(() => {
    fetchdata();
    props.setName("Services");
    setString("");
  }, [props.storeId]);

  const handleString = (e) => {
    // console.log(e.target.value);
    setString(e.target.value);
    if (e.target.value === "") {
      setService(apiData);
    }
  };

  function search(string, e) {
    e.preventDefault();
    console.log(string);
    if (string) {
      const filtered = services?.filter((item) => {
        console.log(item);
        return item.service_title?.toLowerCase().includes(string.toLowerCase());
      });
      setService(filtered);
      // setString("");
    }
  }

  const data = useMemo(() => services, [services]);
  const columns = useMemo(() => SERVICES_COLUMNS, []);
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
        <div className="add-link">
          {/* <div className="service">
            <NavLink className="service-link" to="/services/add-service">
              <span className="page-big-headings">Add New Services</span>
            </NavLink>
            <span className="med-font">
              Add new services for customers and manage slots
            </span>
          </div> */}
          <div className="tab">
            <NavLink className="product-link" to="/services/add-service">
              <span className="page-big-headings">Add New Services</span>
            </NavLink>
            <span className="med-font">
              Add new services for customers and manage slots
            </span>
          </div>
          <div className="bulk-upload tab">
            <NavLink className="product-link" to="/services/bulk-services">
              <span className="page-big-headings">Bulk CSV upload</span>
            </NavLink>
            <span className="med-font">Bulk upload new Products</span>
          </div>
          <div className="bulk-upload tab">
            <span
              className="page-big-headings"
              style={{ cursor: "pointer" }}
              onClick={deleteProd}
            >
              Delete Services
            </span>
            <span className="med-font">Select Services to Delete</span>
          </div>
        </div>
        <div className="services-data">
          <div className="services">
            <div>
              <span className="bigger-font">Services</span>
            </div>
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
              <div>
                <button
                  className="search-btn"
                  onClick={(e) => search(string, e)}
                >
                  Search
                </button>
              </div>
              <div>
                <button className="search-btn" onClick={downloadCSV}>
                  Export
                </button>
              </div>
            </div>
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
                          nav("add-service", {
                            state: {
                              data: services.find(
                                (item) => item.serviceID == row.values.serviceID
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
              <span className="tpg">No Services Availiable in this Store</span>
            </div>
          )}
        </div>
      </div>
      <ToastContainer></ToastContainer>
    </div>
  );
}
