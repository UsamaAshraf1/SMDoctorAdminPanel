import { format, parse, isValid } from "date-fns";
import { FormCheck } from "react-bootstrap";
import sorticon from "../assets/sort.png";
import { Checkbox } from "../components/Checkbox";

const check = <FormCheck type="checkbox" className="mb-3" />;

export const COLUMNS = [
  {
    id: "selection",
    // The header can use the table's getToggleAllRowsSelectedProps method
    // to render a checkbox
    Header: ({ getToggleAllRowsSelectedProps }) => (
      <div>
        <Checkbox {...getToggleAllRowsSelectedProps()} />
      </div>
    ),
    // The cell can use the individual row's getToggleRowSelectedProps method
    // to the render a checkbox
    Cell: ({ row }) => (
      <div onClick={(e) => e.stopPropagation()}>
        <Checkbox
          {...row.getToggleRowSelectedProps()}
          style={{ cursor: "default" }}
        />
      </div>
    ),
  },
  { Header: "ID", accessor: "product_id" },
  { Header: "PRODUCT NAME", accessor: "title" },
  {
    Header: "DATE & TIME",
    accessor: "createdAt",
    Cell: ({ value }) => {
      return format(new Date(value), "dd-MM-yyyy h:mm a");
    },
  },
  { Header: "STOCK", accessor: "stock" },
  { Header: "PRICE", accessor: "price" },
  { Header: "CATEGORY", accessor: "categories" },
];

export const SERVICES_COLUMNS = [
  {
    id: "selection",
    // The header can use the table's getToggleAllRowsSelectedProps method
    // to render a checkbox
    Header: ({ getToggleAllRowsSelectedProps }) => (
      <div>
        <Checkbox {...getToggleAllRowsSelectedProps()} />
      </div>
    ),
    // The cell can use the individual row's getToggleRowSelectedProps method
    // to the render a checkbox
    Cell: ({ row }) => (
      <div onClick={(e) => e.stopPropagation()}>
        <Checkbox
          {...row.getToggleRowSelectedProps()}
          style={{ cursor: "default" }}
        />
      </div>
    ),
  },
  { Header: "ID", accessor: "serviceID" },
  { Header: "SERVICE NAME", accessor: "service_title" },
  {
    Header: "DATE & TIME",
    accessor: "createdAt",
    Cell: ({ value }) => {
      return format(new Date(value), "dd-MM-yyyy h:mm a");
    },
  },
  // { Header: "STOCK", accessor: "" },
  { Header: "PRICE", accessor: "service_price" },
  {
    Header: "TYPE",
    accessor: "service_type",
    Cell: ({ value }) => {
      return value === "service" ? "Service" : value;
    },
  },
  {
    Header: "CATEGORY",
    accessor: "categories",
  },
];

export const COLUMNS_CATEGORY = [
  { Header: "NAME", accessor: "name" },
  {
    Header: "Desc",
    accessor: "shortDes",
    Cell: ({ value }) => {
      if (value && value.length > 20) {
        return `${value.slice(0, 20)}...`;
      }
      return value || ""; // Handle null/undefined values
    },
  },
  {
    Header: "DATE & TIME",
    accessor: "createdAt",
    Cell: ({ value }) => {
      return format(new Date(value), "dd-MM-yyyy h:mm a");
    },
  },
  // { Header: "TYPE", accessor: "type" },
  // {
  //   Header: "CATEGORY",
  //   accessor: (row) => (row.cid ? row.cid : row.sub_cid),
  //   Cell: (row) => {
  //     // console.log(row);
  //     return row.row.original.sub_cid
  //       ? "Sub Child"
  //       : row.row.original.child_cid
  //       ? "Child"
  //       : "Parent";
  //   },
  // },
];

export const COLUMNS_Doctor = [
  { Header: "NAME", accessor: "name" },
  { Header: "Gender", accessor: "gender" },
  { Header: "Professional Title", accessor: "professionalTitle" },
  {
    Header: "DATE & TIME",
    accessor: "createdAt",
    Cell: ({ value }) => {
      return format(new Date(value), "dd-MM-yyyy h:mm a");
    },
  },
];

export const COLUMNS_Packages = [
  { Header: "NAME", accessor: "name" },
  { Header: "Type", accessor: "type" },
  { Header: "Active", accessor: "isActive" },
  {
    Header: "DATE & TIME",
    accessor: "createdAt",
    Cell: ({ value }) => {
      return format(new Date(value), "dd-MM-yyyy h:mm a");
    },
  },
];
// if (row.data[0].cid && !row.data[0].sub_cid && !row.data[0].child_cid)
export const COLUMNS_RESOURCES = [
  { Header: "ID", accessor: "resourceID" },
  { Header: "NAME", accessor: "name" },
  {
    id: "status",
    Header: "STATUS",
    accessor: "status",
    Cell: (props) => {
      return (
        <p
          style={{
            backgroundColor: props.value ? " #D1FAE5" : "#FEE2E2",
            borderRadius: 15,
            padding: 8,
            textAlign: "center",
            color: props.value ? " #065F46" : "#991B1B",
            // color: "white",
          }}
        >
          {props.value ? "Available" : "notAvailable"}
        </p>
      );
    },
  },
];

export const COLUMNS_SELLER = [
  { Header: "ID", accessor: "seller_id" },
  { Header: "USER NAME", accessor: "last_name" },
  { Header: "NAME", accessor: "first_name" },
  { Header: "EMAIL", accessor: "email" },
  {
    Header: "SELLER STATUS",
    accessor: "status",
    Cell: (props) => {
      return (
        <div
          style={{
            backgroundColor:
              props.value === "verified"
                ? " #D1FAE5"
                : props.value == "unverified"
                ? "#FEE2E2"
                : "#FEF3C7",
            borderRadius: 15,
            padding: 6,
            textAlign: "center",
            color:
              props.value === "verified"
                ? " #065F46"
                : props.value === "unverified"
                ? "#991B1B"
                : "#92400E",
          }}
        >
          {props.value === "verified" ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div
                style={{
                  height: 6,
                  width: 6,
                  backgroundColor: " #065F46",
                  borderRadius: 50,
                }}
              />
              <span>Approved</span>
            </div>
          ) : props.value == "unverified" ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div
                style={{
                  height: 6,
                  width: 6,
                  backgroundColor: "#991B1B",
                  borderRadius: 50,
                }}
              />
              <span>Unapproved</span>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div
                style={{
                  height: 6,
                  width: 6,
                  backgroundColor: "#92400E",
                  borderRadius: 50,
                }}
              />
              <span>Pending</span>
            </div>
          )}
        </div>
      );
    },
  },
];

export const COLUMNS_ORDERS = [
  { Header: "ID", accessor: "orderID" },
  {
    Header: "DATE & TIME",
    accessor: "createdAt",
    Cell: ({ value }) => {
      return format(new Date(value), "dd-MM-yyyy h:mm a");
    },
  },
  {
    Header: "STATUS",
    accessor: "order_status",
    Cell: (props) => {
      return (
        <div
          style={{
            backgroundColor:
              props.value === "Completed"
                ? " #D1FAE5"
                : props.value === "Canceled"
                ? "#FEE2E2"
                : "#FEF3C7",
            borderRadius: 15,
            padding: 6,
            textAlign: "center",
            color:
              props.value === "Completed"
                ? " #065F46"
                : props.value === "Cancel Request"
                ? "#991B1B"
                : props.value === "Pending"
                ? "Orange"
                : props.value === "Reschedule"
                ? "blue"
                : props.value === "Out For Delivery"
                ? "#1ABC9C"
                : props.value === "Replacement"
                ? "#99A3A4"
                : props.value === "Cancelled"
                ? "#991B1B"
                : "#92400E",
          }}
        >
          {props.value === "Completed" ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div
                style={{
                  height: 6,
                  width: 6,
                  backgroundColor: "#065F46",
                  borderRadius: 50,
                }}
              />
              <span>Completed</span>
            </div>
          ) : props.value === "Canceled" ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div
                style={{
                  height: 6,
                  width: 6,
                  backgroundColor: "#991B1B",
                  borderRadius: 50,
                }}
              />
              <span>Cancel Request</span>
            </div>
          ) : props.value === "Pending" ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div
                style={{
                  height: 6,
                  width: 6,
                  backgroundColor: "Orange",
                  borderRadius: 50,
                }}
              />
              <span>Pending</span>
            </div>
          ) : props.value === "Processing" ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div
                style={{
                  height: 6,
                  width: 6,
                  backgroundColor: "#92400E",
                  borderRadius: 50,
                }}
              />
              <span>Processing</span>
            </div>
          ) : props.value === "Reschedule" ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div
                style={{
                  height: 6,
                  width: 6,
                  backgroundColor: "blue",
                  borderRadius: 50,
                }}
              />
              <span>Reschedule</span>
            </div>
          ) : props.value === "Out For Delivery" ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div
                style={{
                  height: 6,
                  width: 6,
                  backgroundColor: "#1ABC9C",
                  borderRadius: 50,
                }}
              />
              <span>Out For Delivery</span>
            </div>
          ) : props.value === "Replacement" ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div
                style={{
                  height: 6,
                  width: 6,
                  backgroundColor: "#99A3A4",
                  borderRadius: 50,
                }}
              />
              <span>Replacement</span>
            </div>
          ) : props.value === "Processing" ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div
                style={{
                  height: 6,
                  width: 6,
                  backgroundColor: "#92400E",
                  borderRadius: 50,
                }}
              />
              <span>Processing</span>
            </div>
          ) : props.value === "Cancelled" ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div
                style={{
                  height: 6,
                  width: 6,
                  backgroundColor: "#991B1B",
                  borderRadius: 50,
                }}
              />
              <span>Cancelled</span>
            </div>
          ) : props.value === "No Show" ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div
                style={{
                  height: 6,
                  width: 6,
                  backgroundColor: "#991B1B",
                  borderRadius: 50,
                }}
              />
              <span>No Show</span>
            </div>
          ) : props.value === "Doctor Enroute" ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div
                style={{
                  height: 6,
                  width: 6,
                  backgroundColor: "#991B1B",
                  borderRadius: 50,
                }}
              />
              <span>Doctor Enroute</span>
            </div>
          ) : props.value === "Doctor Arrived" ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div
                style={{
                  height: 6,
                  width: 6,
                  backgroundColor: "#991B1B",
                  borderRadius: 50,
                }}
              />
              <span>Doctor Arrived</span>
            </div>
          ) : props.value === "Visit Started" ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div
                style={{
                  height: 6,
                  width: 6,
                  backgroundColor: "#991B1B",
                  borderRadius: 50,
                }}
              />
              <span>Visit Started</span>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div
                style={{
                  height: 6,
                  width: 6,
                  backgroundColor: "#92400E",
                  borderRadius: 50,
                }}
              />
              <span>In progress</span>
            </div>
          )}
        </div>
      );
    },
  },
  { Header: "TOTAL", accessor: "total_price" },
  { Header: "NAME", accessor: "customer.first_name" },
  { Header: "Location", accessor: "cart.location" },
  {
    Header: "EMAIL",
    accessor: "customer.email",
  },
];

// /////////////////////////////////////////////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////ALL ORDERS////////

export const ALL_ORDERS = [
  { Header: "ID", accessor: "orderID" },
  {
    Header: "DATE & TIME",
    accessor: "createdAt",
    Cell: ({ value }) => {
      return format(new Date(value), "dd-MM-yyyy h:mm a");
    },
  },
  {
    Header: "STATUS",
    accessor: "order_status",
    Cell: (props) => {
      return (
        <div
          style={{
            backgroundColor:
              props.value === "Completed"
                ? " #D1FAE5"
                : props.value === "Cancel Request"
                ? "#FEE2E2"
                : props.value === "Pending"
                ? "#FFD580"
                : props.value === "Reschedule"
                ? "#ADD8E6"
                : props.value === "Out For Delivery"
                ? "#D1F2EB"
                : props.value === "Replacement"
                ? "#E5E8E8"
                : props.value === "Cancelled"
                ? "#FEE2E2"
                : "#FEF3C7",
            borderRadius: 15,
            padding: 6,
            textAlign: "center",
            color:
              props.value === "Completed"
                ? " #065F46"
                : props.value === "Cancel Request"
                ? "#991B1B"
                : props.value === "Pending"
                ? "Orange"
                : props.value === "Reschedule"
                ? "blue"
                : props.value === "Out For Delivery"
                ? "#1ABC9C"
                : props.value === "Replacement"
                ? "#99A3A4"
                : props.value === "Cancelled"
                ? "#991B1B"
                : "#92400E",
          }}
        >
          {props.value === "Completed" ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div
                style={{
                  height: 6,
                  width: 6,
                  backgroundColor: "#065F46",
                  borderRadius: 50,
                }}
              />
              <span>Completed</span>
            </div>
          ) : props.value === "Cancel Request" ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div
                style={{
                  height: 6,
                  width: 6,
                  backgroundColor: "#991B1B",
                  borderRadius: 50,
                }}
              />
              <span>Cancel Request</span>
            </div>
          ) : props.value === "Pending" ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div
                style={{
                  height: 6,
                  width: 6,
                  backgroundColor: "Orange",
                  borderRadius: 50,
                }}
              />
              <span>Pending</span>
            </div>
          ) : props.value === "Reschedule" ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div
                style={{
                  height: 6,
                  width: 6,
                  backgroundColor: "blue",
                  borderRadius: 50,
                }}
              />
              <span>Reschedule</span>
            </div>
          ) : props.value === "Out For Delivery" ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div
                style={{
                  height: 6,
                  width: 6,
                  backgroundColor: "#1ABC9C",
                  borderRadius: 50,
                }}
              />
              <span>Out For Delivery</span>
            </div>
          ) : props.value === "Replacement" ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div
                style={{
                  height: 6,
                  width: 6,
                  backgroundColor: "#99A3A4",
                  borderRadius: 50,
                }}
              />
              <span>Replacement</span>
            </div>
          ) : props.value === "Processing" ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div
                style={{
                  height: 6,
                  width: 6,
                  backgroundColor: "#92400E",
                  borderRadius: 50,
                }}
              />
              <span>Processing</span>
            </div>
          ) : props.value === "Cancelled" ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div
                style={{
                  height: 6,
                  width: 6,
                  backgroundColor: "#991B1B",
                  borderRadius: 50,
                }}
              />
              <span>Cancelled</span>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div
                style={{
                  height: 6,
                  width: 6,
                  backgroundColor: "#92400E",
                  borderRadius: 50,
                }}
              />
              <span>In progress</span>
            </div>
          )}
        </div>
      );
    },
  },
  { Header: "TOTAL", accessor: "total_price" },
  { Header: "NAME", accessor: "cart.customer.first_name" },
  {
    Header: "EMAIL",
    accessor: "cart.customer.email",
  },
  { Header: "STORE", accessor: "cart.store.store_name" },
];

// ORDER COLUMNS ///////
////////////////////////
const imgsort = (
  <span style={{ display: "flex", gap: 5, alignItems: "center" }}>
    <span>Product Image</span> <img src={sorticon} alt="sort" />
  </span>
);
const psort = (
  <span style={{ display: "flex", gap: 5, alignItems: "center" }}>
    <span>Product Name</span> <img src={sorticon} alt="sort" />
  </span>
);
const barsort = (
  <span style={{ display: "flex", gap: 5, alignItems: "center" }}>
    <span>Barcode</span> <img src={sorticon} alt="sort" />
  </span>
);
const usort = (
  <span style={{ display: "flex", gap: 5, alignItems: "center" }}>
    Unit Price <img src={sorticon} alt="sort" />
  </span>
);
const qsort = (
  <span style={{ display: "flex", gap: 5, alignItems: "center" }}>
    Qty <img src={sorticon} alt="sort" />
  </span>
);
const dsort = (
  <span style={{ display: "flex", gap: 5, alignItems: "center" }}>
    Discount <img src={sorticon} alt="sort" />
  </span>
);
const osort = (
  <span style={{ display: "flex", gap: 5, alignItems: "center" }}>
    Order Total <img src={sorticon} alt="sort" />
  </span>
);
const asort = (
  <span style={{ display: "flex", gap: 5, alignItems: "center" }}>
    Action <img src={sorticon} alt="sort" />
  </span>
);

//single Order Table
// //////////////////////////////////////////////////////////////////////////////////////////
export const COLUMNS_ORDER_PRODUCT = [
  // {
  //   Header: check,
  //   accessor: "checkbox",
  // },
  {
    Header: imgsort,
    accessor: "product.img_id",
    Cell: ({ value }) => (
      <img src={value} width="50" height="50" borderRadius="50" alt="image" />
    ),
  },
  {
    Header: psort,
    accessor: "product.title",
    Cell: (row) => {
      // console.log(row);
      if (row.row.original.replace === "r") {
        return (
          <span>
            {row.value}{" "}
            <span
              className="card-btn"
              style={{ backgroundColor: "#dcf2c0", color: "#1C1D22" }}
            >
              Replacement
            </span>
          </span>
        );
      } else {
        return <span>{row.value}</span>;
      }
    },
  },
  { Header: barsort, accessor: "product.barcode" },
  {
    Header: usort,
    accessor: "product.price",
  },
  {
    Header: qsort,
    accessor: "quantity",
  },
  {
    Header: dsort,
    accessor: "discount_price",
  },
  {
    Header: osort,
    accessor: "total_single",
  },
  // {
  //   Header: asort,
  //   accessor: "action",
  // },
];

// ORDER BOOKINGS
const simgsort = (
  <span style={{ display: "flex", gap: 5, alignItems: "center" }}>
    Service Image <img src={sorticon} alt="sort" />
  </span>
);
const snsort = (
  <span style={{ display: "flex", gap: 5, alignItems: "center" }}>
    Service Name <img src={sorticon} alt="sort" />
  </span>
);
const bsort = (
  <span style={{ display: "flex", gap: 5, alignItems: "center" }}>
    Booking Date <img src={sorticon} alt="sort" />
  </span>
);
const slsort = (
  <span style={{ display: "flex", gap: 5, alignItems: "center" }}>
    Booking Slot <img src={sorticon} alt="sort" />
  </span>
);

// Orders table
////////////////////////////////////////////////////////////////////////////////////////////////
export const COLUMNS_ORDER_BOOKING = [
  // {
  //   Header: "simgsort",
  //   accessor: "service.media", // Assuming service.media is just the filename or path
  //   Cell: ({ value }) => {
  //     const baseUrl =
  //       "https://petsetgostorage.blob.core.windows.net/petsetgo-u2/sellers/";
  //     return (
  //       <img
  //         src={`${baseUrl}${value}`}
  //         width="50"
  //         height="50"
  //         alt="image"
  //       />
  //     );
  //   },
  // },

  {
    Header: snsort,
    accessor: "service.service_title",
    Cell: (row) => {
      if (row.data[0].replace === "r") {
        return (
          <span>
            {row.value}
            <span
              className="card-btn"
              style={{ backgroundColor: "#dcf2c0", color: "#1C1D22" }}
            >
              Replacement
            </span>
          </span>
        );
      } else {
        return <span>{row.value}</span>;
      }
    },
  },
  {
    Header: bsort,
    accessor: "slotDate",
    Cell: ({ value }) => {
      try {
        const date = parse(value, "yyyy-MM-dd", new Date());
        return format(new Date(date), "dd-MM-yyyy");
      } catch (error) {
        return null;
      }
    },
  },
  {
    Header: slsort,
    accessor: "slotTiming",
    Cell: ({ value }) => {
      try {
        if (!value) return "N/A"; // Handle empty or undefined values
        const time = parse(value, "HH:mm:ss", new Date());
        return isValid(time) ? format(time, "hh:mm a") : "Invalid Time";
      } catch (error) {
        console.error("Error parsing time:", error);
        return "Invalid Time";
      }
    },
  },
];

const btype = (
  <span style={{ display: "flex", gap: 5, alignItems: "center" }}>
    Type <img src={sorticon} alt="sort" />
  </span>
);
const barriv = (
  <span style={{ display: "flex", gap: 5, alignItems: "center" }}>
    Arrival <img src={sorticon} alt="sort" />
  </span>
);
const bchkout = (
  <span style={{ display: "flex", gap: 5, alignItems: "center" }}>
    CheckOut <img src={sorticon} alt="sort" />
  </span>
);

export const COLUMNS_ORDER_BOARDING = [
  {
    Header: snsort,
    accessor: "service.service_title",
  },
  { Header: btype, accessor: "type" },
  {
    Header: barriv,
    accessor: "arrival",
    Cell: ({ value }) => {
      return format(new Date(value), "dd-MM-yyyy");
    },
  },
  {
    Header: bchkout,
    accessor: "checkout",
    Cell: ({ value }) => {
      return format(new Date(value), "dd-MM-yyyy");
    },
  },
  {
    Header: dsort,
    accessor: "discount_price",
  },
  {
    Header: usort,
    accessor: "service.service_price",
  },
];

const vptype = (
  <span style={{ display: "flex", gap: 5, alignItems: "center" }}>
    Pet Type <img src={sorticon} alt="sort" />
  </span>
);
const vdate = (
  <span style={{ display: "flex", gap: 5, alignItems: "center" }}>
    Date <img src={sorticon} alt="sort" />
  </span>
);
const vday = (
  <span style={{ display: "flex", gap: 5, alignItems: "center" }}>
    Slot Day <img src={sorticon} alt="sort" />
  </span>
);
const vtiming = (
  <span style={{ display: "flex", gap: 5, alignItems: "center" }}>
    Slot Timing <img src={sorticon} alt="sort" />
  </span>
);

export const COLUMNS_ORDER_VIDEO = [
  { Header: vptype, accessor: "pet" },
  {
    Header: vdate,
    accessor: "slotDate",
    Cell: ({ value }) => {
      return format(new Date(value), "dd-MM-yyyy");
    },
  },
  { Header: vday, accessor: "slotDay" },
  {
    Header: vtiming,
    accessor: "slotTiming",
    // Cell: ({ value }) => {
    //   return format(new Date(value), "h:mm a");
    // },
  },
  {
    Header: btype,
    accessor: "isEmergency",
    Cell: ({ value }) => {
      return value ? "Emergency" : "Normal";
    },
  },
];

// ///////////////////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////////////////////////////////

export const COLUMNS_ADOPTION = [
  {
    Header: "Pet Image",
    accessor: "Pet.pet_image",
    Cell: ({ value }) => (
      <img
        src={value}
        width="50"
        height="50"
        borderRadius="50%"
        alt="pet image"
      />
    ),
  },
  {
    Header: "Pet Details",
    accessor: "",
    Cell: (row) => {
      console.log(row.row.original);
      const Pets = row.row.original;
      return (
        <div>
          {Pets?.Pet?.pet_id ? Pets?.Pet?.pet_id + " - " : ""}
          {Pets?.Pet?.pet_name ? Pets?.Pet?.pet_name + " - " : ""}
          {Pets?.Pet?.gender ? Pets?.Pet?.gender + " - " : ""}
          {Pets?.Pet?.weight ? Pets?.Pet?.weight + " - " : ""}
          {Pets?.Pet?.breed ? Pets?.Pet?.breed + " - " : ""}
          {Pets?.Pet?.species ? Pets?.Pet?.species + " - " : ""}
          {Pets?.Pet?.size ? Pets?.Pet?.size : ""}
        </div>
      );
    },
  },
  { Header: "Micro Chip", accessor: "Pet.microchip_number" },
  { Header: "Price", accessor: "price" },
  {
    Header: "Date",
    accessor: "createdAt",
    Cell: ({ value }) => {
      return format(new Date(value), "dd-MM-yyyy h:mm a");
    },
  },
];

// TRansaction COLUmns
// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const TRANSACTIONS = [
  { Header: "TRANSACTION ID", accessor: "transaction_code" },
  {
    Header: "DATE & TIME",
    accessor: "createdAt",
    Cell: ({ value }) => {
      return format(new Date(value), "dd-MM-yyyy h:mm a");
    },
  },
  { Header: "AMOUNT", accessor: "collected_amount" },
  { Header: "TRANSACTION TYPE", accessor: "transactionType" },
  {
    Header: "TYPE",
    Cell: (row) => {
      // console.log(row);
      return row.row.original.collected_amount < 0 ? "Debit" : "Credit";
    },
  },
  { Header: "STORE", accessor: "Seller.store.store_name" },
];

export const ASKADMIN = [
  { Header: "ID", accessor: "index_num" },
  {
    Header: "DATE & TIME",
    accessor: "createdAt",
    Cell: ({ value }) => {
      return format(new Date(value), "dd-MM-yyyy h:mm a");
    },
  },
  { Header: "SUBJECT", accessor: "title" },
];

// ///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

function calculateAge(dob) {
  if (!dob) {
    return null;
  }

  const today = new Date();
  const [day, month, year] = dob.split("-").map(Number);
  const birthDate = new Date(year, month - 1, day);

  const ageInMilliseconds = today - birthDate;
  const ageInYears = today.getFullYear() - birthDate.getFullYear();
  const ageInMonths = Math.floor(
    ageInMilliseconds / (30.44 * 24 * 60 * 60 * 1000)
  );

  if (ageInYears >= 1) {
    return ageInYears + " year";
  } else {
    return ageInMonths + " months";
  }
}

export const CUSTOMERS = [
  { Header: "ID", accessor: "customer_id" },
  { Header: "NAME", accessor: "first_name" },
  { Header: "NUMBER", accessor: "phone" },
  { Header: "Emirate Id", accessor: "emirate_id" },
  { Header: "EMAIL", accessor: "email" },
  {
    Header: "DATE & TIME",
    accessor: "createdAt",
    Cell: ({ value }) => {
      return format(new Date(value), "dd-MM-yyyy h:mm a");
    },
  },
  // {
  //   Header: "PET PROFILE",
  //   accessor: "",
  //   Cell: ({ row }) => {
  //     const dob = row.original?.Pets?.[0]?.dob;
  //     const age = calculateAge(dob);
  //     return (
  //       <div>
  //         <p>
  //           {row.original?.Pets?.[0]?.pet_name
  //             ? row.original?.Pets?.[0]?.pet_name
  //             : ""}
  //           {dob ? ` - ${age}` : ""}
  //           {row.original?.Pets?.[0]?.breed
  //             ? " - " + row.original?.Pets?.[0]?.breed
  //             : ""}
  //           {row.original?.Pets?.[0]?.dob
  //             ? " - " + row.original?.Pets?.[0]?.dob
  //             : ""}
  //         </p>
  //         {row.original?.Pets?.length > 1 ? (
  //           <div
  //             style={{
  //               display: "flex",
  //               // justifyContent: "center",
  //               alignItems: "center",
  //               backgroundColor: " #D1FAE5",
  //               borderRadius: 15,
  //               padding: 6,
  //               height: 20,
  //               width: 80,
  //               gap: 10,
  //             }}
  //           >
  //             <div
  //               style={{
  //                 height: 6,
  //                 width: 6,
  //                 backgroundColor: "#1ABC9C",
  //                 borderRadius: 50,
  //               }}
  //             />
  //             <span style={{ color: "#1ABC9C" }}>More</span>
  //           </div>
  //         ) : (
  //           ""
  //         )}
  //       </div>
  //     );
  //   },
  // },
  // {
  //   Header: "NOTIFY",
  //   Cell: ({ row }) => (
  //     <div
  //       style={{
  //         display: "flex",
  //         // justifyContent: "center",
  //         alignItems: "center",
  //         backgroundColor: " #D1FAE5",
  //         borderRadius: 15,
  //         padding: 6,
  //         height: 20,
  //         width: 80,
  //         gap: 10,
  //       }}
  //     >
  //       <div
  //         style={{
  //           height: 6,
  //           width: 6,
  //           backgroundColor: "#1ABC9C",
  //           borderRadius: 50,
  //         }}
  //       />
  //       <span style={{ color: "#1ABC9C" }}>Notify</span>
  //     </div>
  //   ),
  //   disableClick: true,
  // },
];

export const CONTACTS = [
  // { Header: "ID", accessor: "id" },
  { Header: "NAME", accessor: "first_name" },
  { Header: "NUMBER", accessor: "phone" },
  { Header: "EMAIL", accessor: "email" },
  { Header: "Subject", accessor: "subject" },
  { Header: "Message", accessor: "message" },
  {
    Header: "DATE & TIME",
    accessor: "createdAt",
    Cell: ({ value }) => {
      return format(new Date(value), "dd-MM-yyyy h:mm a");
    },
  },
  // {
  //   Header: "PET PROFILE",
  //   accessor: "",
  //   Cell: ({ row }) => {
  //     const dob = row.original?.Pets?.[0]?.dob;
  //     const age = calculateAge(dob);
  //     return (
  //       <div>
  //         <p>
  //           {row.original?.Pets?.[0]?.pet_name
  //             ? row.original?.Pets?.[0]?.pet_name
  //             : ""}
  //           {dob ? ` - ${age}` : ""}
  //           {row.original?.Pets?.[0]?.breed
  //             ? " - " + row.original?.Pets?.[0]?.breed
  //             : ""}
  //           {row.original?.Pets?.[0]?.dob
  //             ? " - " + row.original?.Pets?.[0]?.dob
  //             : ""}
  //         </p>
  //         {row.original?.Pets?.length > 1 ? (
  //           <div
  //             style={{
  //               display: "flex",
  //               // justifyContent: "center",
  //               alignItems: "center",
  //               backgroundColor: " #D1FAE5",
  //               borderRadius: 15,
  //               padding: 6,
  //               height: 20,
  //               width: 80,
  //               gap: 10,
  //             }}
  //           >
  //             <div
  //               style={{
  //                 height: 6,
  //                 width: 6,
  //                 backgroundColor: "#1ABC9C",
  //                 borderRadius: 50,
  //               }}
  //             />
  //             <span style={{ color: "#1ABC9C" }}>More</span>
  //           </div>
  //         ) : (
  //           ""
  //         )}
  //       </div>
  //     );
  //   },
  // },
  // {
  //   Header: "NOTIFY",
  //   Cell: ({ row }) => (
  //     <div
  //       style={{
  //         display: "flex",
  //         // justifyContent: "center",
  //         alignItems: "center",
  //         backgroundColor: " #D1FAE5",
  //         borderRadius: 15,
  //         padding: 6,
  //         height: 20,
  //         width: 80,
  //         gap: 10,
  //       }}
  //     >
  //       <div
  //         style={{
  //           height: 6,
  //           width: 6,
  //           backgroundColor: "#1ABC9C",
  //           borderRadius: 50,
  //         }}
  //       />
  //       <span style={{ color: "#1ABC9C" }}>Notify</span>
  //     </div>
  //   ),
  //   disableClick: true,
  // },
];

// //////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////

export const PETSCOL = [
  { Header: "ID", accessor: "pet_id" },
  { Header: "PET NAME", accessor: "pet_name" },
  { Header: "SPECIES", accessor: "species" },
  { Header: "DATE OF BIRTH", accessor: "dob" },
  { Header: "CUSTOMER NAME", accessor: "customer.first_name" },
  {
    Header: "DATE & TIME",
    accessor: "createdAt",
    Cell: ({ value }) => {
      return format(new Date(value), "dd-MM-yyyy h:mm a");
    },
  },
];

// //////////////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////

export const COUPONSC = [
  {
    id: "selection",
    // The header can use the table's getToggleAllRowsSelectedProps method
    // to render a checkbox
    Header: ({ getToggleAllRowsSelectedProps }) => (
      <div>
        <Checkbox {...getToggleAllRowsSelectedProps()} />
      </div>
    ),
    // The cell can use the individual row's getToggleRowSelectedProps method
    // to the render a checkbox
    Cell: ({ row }) => (
      <div onClick={(e) => e.stopPropagation()}>
        <Checkbox
          {...row.getToggleRowSelectedProps()}
          style={{ cursor: "default" }}
        />
      </div>
    ),
  },
  { Header: "CODE", accessor: "couponsCode" },
  { Header: "PERCENTAGE", accessor: "rate" },
  {
    Header: "VALID DATE",
    accessor: "endDateTime",
    Cell: ({ value }) => {
      return format(new Date(value), "dd-MM-yyyy h:mm a");
    },
  },
  {
    Header: "DATE & TIME",
    accessor: "createdAt",
    Cell: ({ value }) => {
      return format(new Date(value), "dd-MM-yyyy h:mm a");
    },
  },
];

// ////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////
export const PETRELOC = [
  { Header: "ID", accessor: "requestID" },
  { Header: "NAME", accessor: "Pet.pet_name" },
  { Header: "NUMBER", accessor: "phone" },
  { Header: "FROM", accessor: "relocation_from" },
  { Header: "To", accessor: "relocation_to" },
  {
    Header: "DATE & TIME",
    accessor: "createdAt",
    Cell: ({ value }) => {
      return format(new Date(value), "dd-MM-yyyy h:mm a");
    },
  },
];

// ////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////

export const CAROUSELCOL = [
  // { Header: "ID", accessor: "pet_id" },
  { Header: "DESCRIPTION", accessor: "des" },
  { Header: "CATEGORY", accessor: "category" },
  {
    Header: "STATUS",
    accessor: "status",
    Cell: ({ value }) => {
      return value ? "Visible" : "Hide";
    },
  },
  {
    Header: "DATE & TIME",
    accessor: "createdAt",
    Cell: ({ value }) => {
      return format(new Date(value), "dd-MM-yyyy h:mm a");
    },
  },
];

// ////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////

export const NOTIFICATIONS = [
  { Header: "DESCRIPTION", accessor: "des" },
  {
    Header: "DATE & TIME",
    accessor: "createdAt",
    Cell: ({ value }) => {
      return format(new Date(value), "dd-MM-yyyy h:mm a");
    },
  },
];
