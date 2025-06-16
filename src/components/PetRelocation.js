import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { usePagination, useRowSelect, useSortBy, useTable } from "react-table";
import { NavLink, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { PETRELOC } from "../utils/Col.js";
import RelocPop from "./RelocPop.js";
import { url } from "../utils/urls.js";

export default function PetRelocation(props) {
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
  const [relocate, setRelocate] = useState([]);
  const [popup, setPopup] = useState(false);
  const [apiData, setApiData] = useState([]);
  const [preData, setPreData] = useState("");
  const [storeid, setStoreid] = useState(props.storeId);

  const fetchdata = async () => {
    toast("Relocation data loading please wait", {
      progress: true,
    });
    try {
      const response = await axios.get(`${url}/v1/pet/relocation/all`, {
        headers: { authtoken: authToken, sessionid: session_id },
      });
      toast.dismiss();
      if (response) {
        const resdata = [...response.data.data].sort((p1, p2) =>
          p1.serviceID < p2.serviceID ? 1 : p1.serviceID > p2.serviceID ? -1 : 0
        );
        console.log(resdata);
        setRelocate(resdata);
        setApiData(resdata);
        setPageSize(20);
      }
    } catch (error) {
      toast.dismiss();
      console.log(error);
      setRelocate([]);
      setApiData([]);
    }
  };

  useEffect(() => {
    props.setName("Pet Relocation");
    fetchdata();
  }, []);

  const data = useMemo(() => relocate, [relocate]);
  const columns = useMemo(() => PETRELOC, []);
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
        <RelocPop trigger={popup} setTrigger={setPopup} preData={preData} />
        <div className="add-link">
          {/* <div className="tab">
            <NavLink className="product-link" to="/services/add-service">
              <span className="page-big-headings">Create Discount Coupon</span>
            </NavLink>
            <span className="med-font">
              Create a coupon for store wide discounts
            </span>
          </div> */}
        </div>
        <div className="services-data">
          <div className="services">
            <div>
              <span className="bigger-font">Pet Relocation</span>
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
                        onClick={() => {
                          setPopup(true);
                          const data = relocate.find(
                            (item) =>
                              row.original.relocation_id === item.relocation_id
                          );
                          console.log(data);
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
              <span className="tpg">No Relocation Data available</span>
            </div>
          )}
        </div>
      </div>
      <ToastContainer></ToastContainer>
    </div>
  );
}
