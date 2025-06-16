import React, { useEffect, useMemo, useState } from "react";
import { useTable, usePagination, useSortBy } from "react-table";
import { useNavigate } from "react-router-dom";
import { CONTACTS } from "../utils/Col.js";
import axios from "axios";
import "../styles/table.css";
import { toast, ToastContainer } from "react-toastify";
// import Petpop from "./Petpop.js";
import Notifycustomerpop from "./Notifycustomerpop.js";
import { url } from "../utils/urls.js";

export default function ContactUs(props) {
  const nav = useNavigate();
  const [string, setString] = useState("");
  const [apiData, setApiData] = useState([]);
  const [customers, setcustomers] = useState([]);
  const [popup, setPopup] = useState(false);
  const [notifyPop, setNotifyPop] = useState(false);
  const [query, setQuery] = useState("");
  const [storeid, setStoreid] = useState("");
  const [expState, setExpState] = useState(false);
  const [exportDates, setExportDates] = useState({
    from: null,
    to: null,
  });
  const dynamicArray = [];
  // const [sellerid, setSellerid] = useState("");
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

  const downloadCSV = async () => {
    if (exportDates.from && exportDates.to) {
      toast("Request loading please wait", {
        progress: true,
      });
      try {
        const response = await axios.get(
          `${url}/v1/admin/exports/customer?from=${exportDates.from}&to=${exportDates.to}`,
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

  const handleString = (e) => {
    // console.log(e.target.value);
    setString(e.target.value);
    if (e.target.value === "") {
      setcustomers(apiData);
    }
  };

  function search(string, e) {
    e.preventDefault();
    if (string) {
      const filtered = customers?.filter((prod) => {
        return (
          prod.first_name.toLowerCase().includes(string.toLowerCase()) ||
          prod.email.toLowerCase().includes(string.toLowerCase())
        );
      });
      setcustomers(filtered);
      // setString("");
    }
  }

  const fetchdata = async () => {
    toast("Customers loading please wait", {
      progress: true,
    });
    try {
      const response = await axios.get(`${url}/v1/contact/get-all`, {
        headers: { authtoken: authToken, sessionid: session_id },
      });
      toast.dismiss();
      if (response) {
        const resdata = [...response?.data?.data].sort((p1, p2) =>
          p1.createdAt < p2.createdAt ? 1 : p1.createdAt > p2.createdAt ? -1 : 0
        );
        // console.log(resdata);
        setcustomers(resdata);
        setApiData(resdata);
        setPageSize(20);
      }
    } catch (error) {
      toast.dismiss();
      toast(error.response?.data?.error || "request failed", {
        type: "error",
      });
      console.log(error);
    }
  };

  const data = useMemo(() => customers, [customers]);
  console.log(data)
  const columns = useMemo(() => CONTACTS, []);
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
    setPageSize,
    state,
    pageCount,
    prepareRow,
  } = tableinstance;
  let { pageIndex, pageSize } = state;

  useEffect(() => {
    fetchdata();
    setString("");
    props.setName("Contact");
  }, [props.storeId]);
  return (
    <div className="content">
      {/* <Petpop trigger={popup} query={query} setTrigger={setPopup} /> */}
      <Notifycustomerpop
        trigger={notifyPop}
        query={query}
        setTrigger={setNotifyPop}
      />
      <div className="products-data">
        {/* <div className="add-link">
          <div className="tab">
            <button
              className="cat-popup page-big-headings"
              onClick={() => {
                nav("pets");
              }}
            >
              View Pet Profiles
            </button>
            <span className="med-font">Complete List of Pet Profiles</span>
          </div>
        </div> */}
        <div className="products">
          <div>
            <span className="bigger-font">Contact</span>
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

              <button className="search-btn" onClick={(e) => search(string, e)}>
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
                  setExportDates({ ...exportDates, from: e.target.value })
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
        {customers.length ? (
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
                      className="tr"
                      style={{ cursor: "pointer" }}
                    >
                      {row.cells.map((cell) => {
                        const isNotifyColumn = cell.column.id === "NOTIFY";

                        return (
                          <td
                            {...cell.getCellProps()}
                            onClick={() => {
                              setQuery(
                                customers.find(
                                  (i) => i.customer_id == row.values.customer_id
                                )
                              );
                              if (isNotifyColumn) {
                                setNotifyPop(true);
                              } else {
                                setPopup(true);
                              }
                            }}
                          >
                            {cell.render("Cell")}
                          </td>
                        );
                      })}{" "}
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
            <span className="tpg">No Customer Available</span>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}
