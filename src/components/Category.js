import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useTable, usePagination, useSortBy } from "react-table";
import { COLUMNS_CATEGORY } from "../utils/Col.js";
import "../styles/table.css";
// import AddCategory from "./AddCategory.js"; // Fixed typo
import Addcategroy from "./Addcategroy.js";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { url } from "../utils/urls.js";

export default function Categories({ setName }) {
  const nav = useNavigate();
  const [authToken] = useState(localStorage.getItem("authToken") || "");
  const [session_id] = useState(localStorage.getItem("session_id") || "");
  const [categories, setCategories] = useState([]);
  const [searchString, setSearchString] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [originalData, setOriginalData] = useState([]);
  const [previousData, setPreviousData] = useState(undefined); // Fixed typo
  const [relatedPCategory, setRelatedPCategory] = useState(undefined);

  const fetchdata = async () => {
    try {
      // toast.info("Categories loading, please wait...");
      toast("Categories loading, please wait...", {
        progress: true,
      });
      const response = await axios.get(`${url}/v1/department/get/all`, {
        headers: { authtoken: authToken, sessionid: session_id },
      });
      toast.dismiss();

      // Filter only main categories (those with an 'id' field)
      const mainCategories = response.data.data.filter((item) => item.id);
      setCategories(mainCategories);
      setOriginalData(mainCategories); // Store main categories for search reset
    } catch (err) {
      toast.dismiss();
      toast.error("Failed to load categories");
      console.error("Fetch error:", err);
      if (err.response?.status === 401) {
        nav("/login");
      }
    }
  };

  const handleString = (e) => {
    const value = e.target.value;
    setSearchString(value);
    if (value === "") {
      setCategories(originalData); // Reset to main categories
    }
  };

  const search = (string, e) => {
    e.preventDefault();
    if (string) {
      const filtered = originalData.filter((item) =>
        item.name?.toLowerCase().includes(string.toLowerCase())
      );
      setCategories(filtered);
    }
  };

  useEffect(() => {
    fetchdata();
    setName("Department");
    setSearchString("");
  }, [authToken, session_id, setName, showPopup]); // Added missing dependencies

  const data = useMemo(() => categories, [categories]);
  const columns = useMemo(() => COLUMNS_CATEGORY, []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    previousPage,
    setPageSize,
    gotoPage,
    pageOptions,
    state,
    pageCount,
    prepareRow,
  } = useTable(
    { columns, data, initialState: { pageSize: 20 } },
    useSortBy,
    usePagination
  );
  const { pageIndex } = state;

  return (
    <div className="page">
      <div className="content">
        <div className="add-link">
          <div className="category">
            <button
              className="cat-popup page-big-headings"
              onClick={() => {
                setShowPopup(true);
                setPreviousData(undefined);
              }}
            >
              Add new Department
            </button>
            <Addcategroy
              trigger={showPopup}
              setTrigger={setShowPopup}
              previousData={previousData} // Fixed typo
              relatedPCategory={relatedPCategory}
              categories={categories}
              setPreviousData={setPreviousData}
            />
            <span className="med-font">Add new Department</span>
          </div>
        </div>
        <div className="categories-data">
          <div className="categories">
            <div>
              <span className="bigger-font">Departments</span>
            </div>
            <div className="search-div">
              <input
                type="search"
                className="search-category"
                placeholder="Search"
                value={searchString}
                onChange={handleString}
              />
              <button
                className="search-btn"
                onClick={(e) => search(searchString, e)}
              >
                Search
              </button>
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
                {page.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length}>No departments found</td>
                  </tr>
                ) : (
                  page.map((row) => {
                    prepareRow(row);
                    return (
                      <tr
                        {...row.getRowProps()}
                        onClick={() => {
                          const data = categories.find(
                            (item) => item.id === row.values.id
                          );
                          setPreviousData(data);
                          nav(`/department_detail`, {
                            state: { department: row.original },
                          });
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        {row.cells.map((cell) => (
                          <td {...cell.getCellProps()}>
                            {cell.render("Cell")}
                          </td>
                        ))}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
            <div className="pagination-btns">
              <button
                onClick={() => gotoPage(0)}
                className={pageIndex > 0 ? "ablepagibtn" : "pagination-btn"}
                disabled={pageIndex === 0}
              >
                {"<<"}
              </button>
              <button
                onClick={() => previousPage()}
                className={pageIndex > 0 ? "ablepagibtn" : "pagination-btn"}
                disabled={pageIndex === 0}
              >
                Prev
              </button>
              <span className="pagination-btn">
                Page {pageIndex + 1} of {pageCount}
              </span>
              <button
                onClick={() => nextPage()}
                className={
                  pageIndex + 1 < pageCount ? "ablepagibtn" : "pagination-btn"
                }
                disabled={pageIndex + 1 >= pageCount}
              >
                Next
              </button>
              <button
                onClick={() => gotoPage(pageCount - 1)}
                className={
                  pageIndex + 1 < pageCount ? "ablepagibtn" : "pagination-btn"
                }
                disabled={pageIndex + 1 >= pageCount}
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
