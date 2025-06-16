import React, { useEffect, useMemo, useState } from "react";
import { useTable, usePagination, useSortBy } from "react-table";
import { useNavigate } from "react-router-dom";
import { ASKADMIN } from "../utils/Col.js";
import axios from "axios";
import "../styles/table.css";
import { toast, ToastContainer } from "react-toastify";
import Askpop from "./Askpop.js";
import { url } from "../utils/urls.js";

export default function Askadmin(props) {
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
  const [popup, setPopup] = useState(false);
  const [apiData, setapiData] = useState([]);
  const [queries, setQueries] = useState([]);
  const [query, setQuery] = useState("");
  const [storeid, setStoreid] = useState("");
  // const [sellerid, setSellerid] = useState("");
  // console.log(query);
  const handleString = (e) => {
    // console.log(e.target.value);
    setString(e.target.value);
    if (e.target.value === "") {
      setapiData(queries);
    }
  };
  function search(string, e) {
    e.preventDefault();
    if (string) {
      const filtered = apiData?.filter((prod) => {
        // console.log(prod.title);
        return prod.message.toLowerCase().includes(string.toLowerCase());
      });
      setapiData(filtered);
      // setString("");
    }
  }

  const fetchdata = async () => {
    toast("Queries loading please wait", {
      progress: true,
    });
    try {
      const response = await axios.get(`${url}/v1/admin/emails`, {
        headers: { authtoken: authToken, sessionid: session_id },
      });
      toast.dismiss();
      // console.log(resdata);
      console.log(response.data.data);
      const res = response?.data?.data?.map((e, index) => {
        return { ...e, index_num: index + 1 + "" };
      });
      console.log(res);
      setapiData(res);
      setQueries(res);
      setPageSize(20);
    } catch (error) {
      toast.dismiss();
      toast(error.response?.data?.error || "request failed", {
        type: "error",
      });
      console.log(error);
    }
  };

  const data = useMemo(() => apiData, [apiData]);
  const columns = useMemo(() => ASKADMIN, []);
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

  //   useEffect(() => {
  //     // if (props.storeId) {
  //     //   setStoreid(props.storeId);
  //     // }
  //     if (props.sellerId) {
  //       setSellerid(props.sellerId);
  //     }
  //   }, [props.sellerId]);
  // console.log(props);
  // console.log(props.storeId);
  useEffect(() => {
    fetchdata();
    setString("");
    props.setName("Ask Admin");
  }, [props.storeId]);
  return (
    <div className="content">
      <Askpop trigger={popup} query={query} setTrigger={setPopup} />
      <div className="products-data">
        <div className="products">
          <div>
            <span className="bigger-font">Queries List</span>
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
        {apiData.length ? (
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
                      onClick={(r) => {
                        setQuery(
                          queries.find(
                            (it) => it.index_num == row.values.index_num
                          )
                        );
                        setPopup(true);
                      }}
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
            <span className="tpg">No Queries Available</span>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}
