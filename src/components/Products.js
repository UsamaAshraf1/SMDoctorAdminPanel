import React, { useEffect, useMemo, useState } from "react";
import { useTable, usePagination, useSortBy, useRowSelect } from "react-table";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { format, parse } from "date-fns";
import { COLUMNS } from "../utils/Col.js";
import "../styles/table.css";
import { toast, ToastContainer } from "react-toastify";
import { Checkbox } from "./Checkbox.js";
import { url as apiUrl } from "../utils/urls.js";

export default function Products(props) {
  // console.log(props.storeId);
  useEffect(() => {
    if (props.storeId) {
      setStoreid(props.storeId);
    }
  }, [props.storeId]);
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
  const [products, setProducts] = useState([]);
  const [string, setString] = useState("");
  const [apiData, setApiData] = useState([]);
  const [storeid, setStoreid] = useState();
  const [Delete, setDelete] = useState([]);

  const fetchdata = async () => {
    toast("Products loading please wait", {
      progress: true,
    });
    if (props.storeId) {
      try {
        const response = await axios.get(
          `${apiUrl}/v1/store/product/get?store_id=${props.storeId}`,
          {
            headers: { authtoken: authToken, sessionid: session_id },
          }
        );
        toast.dismiss();

        // console.log(resdata);
        // let newArray = resdata.map((obj) => ({ ...obj, isChecked: false }));
        if (response) {
          const resdata = [...response?.data?.products].sort((p1, p2) =>
            p1.createdAt < p2.createdAt
              ? 1
              : p1.createdAt > p2.createdAt
              ? -1
              : 0
          );
          setProducts(resdata);
          setApiData(resdata);
          setPageSize(20);
        }
      } catch (error) {
        toast.dismiss();
        toast(error.response?.data?.message || "request failed", {
          type: "error",
        });
        console.log(error);
        setProducts([]);
      }
    } else {
      toast.dismiss();
      toast("request failed store id undefined", {
        type: "error",
      });
      setProducts([]);
    }
  };
  const downloadCSV = async () => {
    toast("Request loading please wait", {
      progress: true,
    });
    try {
      const response = await axios.get(
        `${apiUrl}/v1/admin/exports/products?store_id=${storeid}`,
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
  };
  const handleString = (e) => {
    // console.log(e.target.value);
    setString(e.target.value);
    if (e.target.value === "") {
      setProducts(apiData);
    }
  };

  function search(string, e) {
    e.preventDefault();
    if (!string) {
      setProducts(apiData);
    } else {
      const filtered = products?.filter((prod) => {
        // console.log(prod.title);
        return prod.title.toLowerCase().includes(string.toLowerCase());
      });
      setProducts(filtered);
    }
  }

  async function deleteProd(e) {
    e.preventDefault();
    console.log(e);
    console.log(selectedFlatRows.length);
    if (selectedFlatRows.length) {
      const arrayOfPid = selectedFlatRows.map((e) => e.original.pid);
      try {
        toast(arrayOfPid.length + " item is getting deleted , please wait!", {
          progress: true,
        });
        const data = { data: arrayOfPid };
        const response = await axios.post(
          `${apiUrl}/v1/store/product/delete`,
          data,
          {
            header: "Content-Type: application/json",
          }
        );
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
      toast("Select Products first", {
        type: "info",
      });
    }
  }

  useEffect(() => {
    if (props.storeId) {
      fetchdata();
    }
    // fetchdata();
    setString("");
    props.setName("Products");
  }, [props.storeId]);

  const data = useMemo(() => products, [products]);
  const columns = useMemo(() => COLUMNS, []);
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
  let { pageIndex, pageSize } = state;
  // console.log(selectedFlatRows[0]?.original);
  return (
    <div className="content">
      <div className="add-link">
        <div className="product tab">
          <NavLink className="product-link" to="/products/add-product">
            <span className="page-big-headings">Add New Products</span>
          </NavLink>
          <span className="med-font">Add new products for Customer</span>
        </div>
        <div className="bulk-upload tab">
          <NavLink className="product-link" to="/products/bulk-products">
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
            Delete Products
          </span>
          <span className="med-font">Select Products to Delete</span>
        </div>
        {/* <div className="seller-binding tab">
            <a href="/" className="product-link">
              <span className="page-big-headings">Seller Product Binding</span>
            </a>
            <span className="med-font">
              Bulk Biding of a seller with Products
            </span>
          </div> */}
      </div>
      <div className="products-data">
        <div className="products">
          <div>
            <span className="bigger-font">Products</span>
          </div>
          <div className="search-div">
            <input
              type="text"
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
            <div>
              <button className="search-btn" onClick={downloadCSV}>
                Export
              </button>
            </div>
          </div>
        </div>
        {products.length ? (
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
                        nav("add-product", {
                          state: {
                            data: products.find(
                              (item) => item.product_id == row.values.product_id
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
            <span className="tpg">No Products Availiable in this Store</span>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}
