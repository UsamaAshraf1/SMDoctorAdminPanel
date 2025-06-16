import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { usePagination, useRowSelect, useSortBy, useTable } from "react-table";
import { NavLink, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { CAROUSELCOL } from "../utils/Col.js";
import Couponpop from "./Couponpop.js";
import CouponUpdate from "./CouponUpdate.js";
import Carouselcreatepop from "./Carouselcreatepop.js";
import Carouselupdate from "./Carouselupdate.js";
import { url } from "../utils/urls.js";

export default function Carousels(props) {
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
  const [carousels, setcarousels] = useState([]);
  const [popup, setPopup] = useState(false);
  const [updatepopup, setupdatePopup] = useState(false);
  const [apiData, setApiData] = useState([]);
  const [preData, setPreData] = useState("");
  const [storeid, setStoreid] = useState(props.storeId);

  const fetchdata = async () => {
    toast("Carousels loading please wait", {
      progress: true,
    });
    try {
      const response = await axios.get(`${url}/v1/app/carasoule/get`, {
        headers: { authtoken: authToken, sessionid: session_id },
      });
      toast.dismiss();
      setcarousels(response.data.data);
      setApiData(response.data.data);
      setPageSize(20);
    } catch (error) {
      toast.dismiss();
      console.log(error);
      setcarousels([]);
      setApiData([]);
    }
  };

  useEffect(() => {
    props.setName("Carousels");
    fetchdata();
  }, []);

  const data = useMemo(() => carousels, [carousels]);
  const columns = useMemo(() => CAROUSELCOL, []);
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
        <Carouselcreatepop
          trigger={popup}
          setTrigger={setPopup}
          fetchdata={fetchdata}
        />
        <Carouselupdate
          trigger={updatepopup}
          setTrigger={setupdatePopup}
          preData={preData}
          fetchdata={fetchdata}
        />
        <div className="add-link">
          <div className="tab">
            <button
              className="cat-popup page-big-headings"
              onClick={() => {
                setPopup("true");
              }}
            >
              Add New Carousel
            </button>
            <span className="med-font">Manage mobile main screen carousel</span>
          </div>
        </div>
        <div className="services-data">
          <div className="services">
            <div>
              <span className="bigger-font">Carousels</span>
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
                          const data = carousels.find((i) => {
                            return row.original.id === i.id;
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
              <span className="tpg">No Carousels available</span>
            </div>
          )}
        </div>
      </div>
      <ToastContainer></ToastContainer>
    </div>
  );
}
