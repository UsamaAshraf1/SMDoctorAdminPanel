import React, { useEffect, useMemo, useState } from "react";
import { useTable, usePagination, useSortBy } from "react-table";
import { useNavigate } from "react-router-dom";
import { TRANSACTIONS } from "../utils/Col.js";
import axios from "axios";
import "../styles/table.css";
import { toast, ToastContainer } from "react-toastify";
import Vatpop from "./Vatpop.js";
import { url } from "../utils/urls.js";

export default function Transactions(props) {
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
  const [string, setString] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [apiData, setApiData] = useState([]);
  const [popup, setPopup] = useState(false);
  const [pageNumber, setpageNumber] = useState(1);
  const [storeid, setStoreid] = useState("");
  const [sellerid, setSellerid] = useState("");

  const handleString = (e) => {
    // console.log(e.target.value);
    setString(e.target.value);
    if (e.target.value === "") {
      setTransactions(apiData);
    }
  };

  function search(string, e) {
    e.preventDefault();
    if (string) {
      const filtered = transactions?.filter((prod) => {
        // console.log(prod.title);
        return prod.transaction_code
          .toLowerCase()
          .includes(string.toLowerCase());
      });
      setTransactions(filtered);
      // setString("");
    }
  }

  const fetchdata = async (page) => {
    toast("Transactions loading please wait", {
      progress: true,
    });
    try {
      const response = await axios.get(
        `${url}/v1/admin/get/transactions?pageNumber=${page}`,
        { headers: { authtoken: authToken, sessionid: session_id } }
      );
      if (response) {
        toast.dismiss();
        console.log(response.data?.dataWithType);
        const resdata = [...response?.data?.dataWithType].sort((p1, p2) =>
          p1.updatedAt < p2.updatedAt ? 1 : p1.updatedAt > p2.updatedAt ? -1 : 0
        );
        setTransactions(resdata);
        console.log(resdata);
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

  const data = useMemo(() => transactions, [transactions]);
  const columns = useMemo(() => TRANSACTIONS, []);
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

  // useEffect(() => {
  //   // if (props.storeId) {
  //   //   setStoreid(props.storeId);
  //   // }
  //   if (props.sellerId) {
  //     setSellerid(props.sellerId);
  //   }
  // }, [props.sellerId]);
  // console.log(props);
  // console.log(props.storeId);
  useEffect(() => {
    fetchdata(pageNumber);
    setString("");
    props.setName("Transactions");
  }, []);
  return (
    <div className="content">
      <Vatpop trigger={popup} setTrigger={setPopup} />
      <div className="products-data">
        <div className="add-link">
          <div className="tab">
            <button
              className="cat-popup page-big-headings"
              onClick={() => {
                setPopup(true);
              }}
            >
              Update VAT
            </button>
            <span className="med-font">Enter VAT percentage</span>
          </div>
        </div>
        <div className="products">
          <div>
            <span className="bigger-font">Transactions</span>
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
              <button className="search-btn" onClick={(e) => search(string, e)}>
                Search
              </button>
            </div>
          </div>
        </div>
        {transactions.length ? (
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
                      onClick={() => {
                        // setPopup(true);
                      }}
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
            <span className="tpg">No Transactions Availiable to show</span>
            {pageNumber !== 1 ? (
              <div className="pagination-btns">
                <button
                  onClick={() => {
                    // gotoPage(0);
                    fetchdata(1);
                    setpageNumber(1);
                  }}
                  className={pageNumber >= 2 ? "ablepagibtn" : "pagination-btn"}
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
      <ToastContainer />
    </div>
  );
}
