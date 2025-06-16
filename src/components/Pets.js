import React, { useEffect, useMemo, useState } from "react";
import { useTable, usePagination, useSortBy } from "react-table";
import { useNavigate } from "react-router-dom";
import { PETSCOL } from "../utils/Col.js";
import axios from "axios";
import "../styles/table.css";
import { toast, ToastContainer } from "react-toastify";
import { url } from "../utils/urls.js";

export default function Pets(props) {
  const nav = useNavigate();
  const [string, setString] = useState("");
  const [apiData, setApiData] = useState([]);
  const [pets, setpets] = useState([]);
  const [storeid, setStoreid] = useState("");
  const [expState, setExpState] = useState(false);
  const [exportDates, setExportDates] = useState({
    from: null,
    to: null,
  });

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
          `${url}/v1/admin/exports/pet?from=${exportDates.from}&to=${exportDates.to}`,
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
      setpets(apiData);
    }
  };

  function search(string, e) {
    e.preventDefault();
    if (string) {
      const filtered = pets?.filter((prod) => {
        // console.log(prod.title);
        return prod.pet_name.toLowerCase().includes(string.toLowerCase());
      });
      setpets(filtered);
      // setString("");
    }
  }

  const fetchdata = async () => {
    toast("Pets loading please wait", {
      progress: true,
    });
    try {
      const response = await axios.get(`${url}/v1/pet/get/all`, {
        headers: { authtoken: authToken, sessionid: session_id },
      });
      toast.dismiss();
      if (response) {
        const resdata = [...response?.data?.data].sort((p1, p2) =>
          p1.createdAt < p2.createdAt ? 1 : p1.createdAt > p2.createdAt ? -1 : 0
        );
        // console.log(resdata);
        setpets(resdata);
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
  // console.log(pets);

  const data = useMemo(() => pets, [pets]);
  const columns = useMemo(() => PETSCOL, []);
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
    props.setName("Pet Profiles");
  }, [props.storeId]);
  return (
    <div className="content">
      <div className="products-data">
        <div className="products">
          <div>
            <span className="bigger-font">Pet Profiles</span>
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
        {pets.length ? (
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
                        nav("profile", {
                          state: {
                            data: pets.find(
                              (item) => item.pet_id === row.values.pet_id
                            ),
                          },
                        });
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
            <span className="tpg">No Pets to show</span>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}
