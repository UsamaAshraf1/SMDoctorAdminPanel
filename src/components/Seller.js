import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { usePagination, useTable, useSortBy } from "react-table";
import { Navigate, NavLink, useNavigate } from "react-router-dom";
import { Dropdown } from "react-bootstrap";

import { COLUMNS_SELLER } from "../utils/Col.js";
import SellerAdd from "./Newseller";
import "../styles/table.css";
import { toast, ToastContainer } from "react-toastify";
import { url } from "../utils/urls.js";

export default function Seller(props) {
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
  const [popup, setPopup] = useState(false);
  const [sellers, setSellers] = useState([]);
  const [apiData, setApiData] = useState([]);
  const [string, setString] = useState("");
  const fetchdata = async () => {
    toast("Sellers loading please wait", {
      progress: true,
    });
    const response = await axios
      .get(`${url}/v1/admin/get/sellers`, {
        headers: {
          authtoken: authToken,
          sessionid: session_id,
          Authorization: "Bearer 22ba20b1-cee6-42ff-9bf0-5f3ef9055c11",
        },
      })
      .catch((err) => {
        toast.dismiss();
        toast(err.response?.data?.error || "request failed", {
          type: "error",
        });
        console.log(err);
      });
    if (response) {
      toast.dismiss();
      const resdata = [...response.data.data].sort((p1, p2) =>
        p1.seller_id < p2.seller_id ? 1 : p1.seller_id > p2.seller_id ? -1 : 0
      );
      // console.log(resdata);
      setSellers(resdata);
      setApiData(resdata);
      setPageSize(20);
    }
  };

  useEffect(() => {
    fetchdata();
    props.setName("Sellers");
  }, []);

  const handleString = (e) => {
    // console.log(e.target.value);
    setString(e.target.value);
    if (e.target.value === "") {
      setSellers(apiData);
    }
  };

  function search(string, e) {
    e.preventDefault();
    console.log(string);
    if (string) {
      const filtered = apiData?.filter((item) => {
        console.log(item);
        return item.first_name?.toLowerCase().includes(string.toLowerCase());
      });
      setSellers(filtered);
      // setString("");
    }
  }

  const data = useMemo(() => sellers, [sellers]);
  const columns = useMemo(() => COLUMNS_SELLER, []);
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
      <div className="content">
        <div className="add-link">
          <div className="seller">
            <button
              className="cat-popup page-big-headings"
              onClick={() => setPopup(true)}
            >
              Add new Seller
            </button>
            <SellerAdd trigger={popup} setTrigger={setPopup} />
            {/* <NavLink className="product-link" to="/sellers/add-seller">
              <span className="page-big-headings">Add New Seller</span>
            </NavLink> */}
            <span className="med-font">Onboard a new Seller</span>
          </div>
        </div>
        <div className="sellers-data">
          <div className="sellers">
            <div>
              <span className="bigger-font">Seller list</span>
            </div>
            <div className="search-div">
              <input
                type="search"
                className="search-category"
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
            </div>
          </div>
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
                        nav("add-seller", {
                          state: {
                            data: sellers.find(
                              (item) => item.seller_id == row.values.seller_id
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
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
