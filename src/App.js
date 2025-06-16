import { useEffect, useState } from "react";
import { ToastContainer } from "react-bootstrap";
import { Route, Routes } from "react-router-dom";
import Addcategroy from "./components/Addcategroy";
import Addproduct from "./components/Addproduct";
import Addresources from "./components/Addresources";
import Addseller from "./components/Addseller";
import Addservice from "./components/Addservice";
import Bulkproducts from "./components/Bulkproducts";
import Bulkservice from "./components/Bulkservice";
import Categories from "./components/Category";
import Login from "./components/Login";
import Products from "./components/Products";
import Resources from "./components/Resources";
import Seller from "./components/Seller";
import Services from "./components/Services";
import Home from "./Home";
import "react-toastify/dist/ReactToastify.css";
import Orders from "./components/Orders";
import Order from "./components/Order";
import Dayboarding from "./components/Dayboarding";
import Slots from "./components/Slots";
import Dashboard from "./components/Dashboard";
import Transactions from "./components/Transactions";
import Storeslots from "./components/Storeslots";
import Askadmin from "./components/Askadmin";
import Customers from "./components/Customers";
import { fetchToken, onMessageListner } from "./firebase";
import { toast } from "react-toastify";
import Coupons from "./components/Coupons";
import PetRelocation from "./components/PetRelocation";
import Carousels from "./components/Carousels";
import Allorders from "./components/Allorders";
import Pets from "./components/Pets";
import Petprofile from "./components/Petprofile";
import PushNotifications from "./components/PushNotifications";
import ContactUs from "./components/ContactUs";
import Doctors from "./components/Doctor";
import DoctorDetail from "./components/DoctorDetail";
import CustomerDetail from "./components/CustomerDetail";
import DepartmentDetail from "./components/DepartmentDetail";
import ServicePackage from "./components/ServicePackage";

function App() {
  // const [isTokenFound, setTokenFound] = useState(false);
  // const [getFcmToken, setFcmToken] = useState("");
  // fetchToken(setTokenFound, setFcmToken);
  // console.log(onMessageListner);
  // onMessageListner()
  //   .then((payload) => {
  //     toast(payload.notification.title, { type: "success" });
  //   })
  //   .catch((err) => console.log("failed"));

  const [isLogin, setLogin] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [storeId, setStoreId] = useState();
  const [sellerId, setSellerId] = useState();
  // console.log(sellerId);
  const [name, setName] = useState("");
  useEffect(() => {
    setLogin(JSON.parse(localStorage.getItem("login") || false) ? true : false);
    setUserRole(localStorage.getItem("role") || "admin");
  }, []);
  return (
    <div className="App">
      <Routes>
        {isLogin && userRole === "admin" ? (
          <Route
            path="/"
            element={
              <Home
                setLogin={setLogin}
                setStoreId={setStoreId}
                setSellerId={setSellerId}
                name={name}
                role={userRole}
                setName={setName}
              />
            }
          >
            <Route
              path="products"
              element={<Products storeId={storeId} setName={setName} />}
            ></Route>
            <Route
              path="services"
              element={<Services storeId={storeId} setName={setName} />}
            ></Route>
            <Route
              path="Department"
              element={<Categories setName={setName} />}
            ></Route>
            <Route
              path="department_detail"
              element={<DepartmentDetail setName={setName} />}
            ></Route>
            <Route
              path="doctors"
              element={<Doctors setName={setName} />}
            ></Route>

            <Route
              path="service_package"
              element={<ServicePackage setName={setName} />}
            ></Route>
            <Route
              path="doctors_detail"
              element={<DoctorDetail setName={setName} />}
            ></Route>
            <Route
              path="sellers"
              element={<Seller setName={setName} />}
            ></Route>
            <Route
              path="orders"
              element={<Orders storeId={storeId} setName={setName} />}
            ></Route>
            <Route
              path="transactions"
              element={
                <Transactions
                  storeId={storeId}
                  sellerId={sellerId}
                  setName={setName}
                />
              }
            ></Route>
            <Route
              path="store-slots"
              element={<Storeslots storeId={storeId} setName={setName} />}
            ></Route>
            <Route
              path="ask-admin"
              element={<Askadmin storeId={storeId} setName={setName} />}
            ></Route>
            <Route
              path="customers"
              element={<Customers storeId={storeId} setName={setName} />}
            ></Route>
            <Route
              path="customers_detail"
              element={<CustomerDetail storeId={storeId} setName={setName} />}
            ></Route>
            <Route
              path="Contact"
              element={<ContactUs storeId={storeId} setName={setName} />}
            ></Route>
            <Route
              index
              element={
                <Dashboard
                  storeId={storeId}
                  setName={setName}
                  role={userRole}
                />
              }
            ></Route>
            <Route
              path="dayboarding"
              element={<Dayboarding setName={setName} storeId={storeId} />}
            ></Route>
            <Route
              path="coupons"
              element={<Coupons setName={setName} storeId={storeId} />}
            ></Route>
            <Route
              path="carousels"
              element={<Carousels setName={setName} storeId={storeId} />}
            ></Route>
            <Route
              path="notifications"
              element={
                <PushNotifications setName={setName} storeId={storeId} />
              }
            ></Route>
            <Route
              path="allorders"
              element={<Allorders setName={setName} storeId={storeId} />}
            ></Route>
            <Route
              path="relocations"
              element={<PetRelocation setName={setName} storeId={storeId} />}
            ></Route>
            <Route
              path="resources"
              element={
                <Resources
                  storeId={storeId}
                  sellerId={sellerId}
                  setName={setName}
                />
              }
            ></Route>
            <Route
              path="slots"
              element={<Slots setName={setName} storeId={storeId} />}
            ></Route>
            <Route
              path="products/bulk-products"
              element={<Bulkproducts storeId={storeId} />}
            ></Route>
            <Route
              path="services/bulk-services"
              element={<Bulkservice storeId={storeId} />}
            ></Route>
            <Route
              path="doctors/add-doctor"
              element={<Addproduct storeId={storeId} />}
            ></Route>
            <Route
              path="services/add-service"
              element={<Addservice storeId={storeId} setName={setName} />}
            ></Route>
            <Route path="sellers/add-seller" element={<Addseller />}></Route>
            <Route path="orders/order" element={<Order />}></Route>
            <Route path="allorders/order" element={<Order />}></Route>
            <Route
              path="customers/pets"
              element={<Pets setName={setName} />}
            ></Route>
            <Route
              path="customers/pets/profile"
              element={<Petprofile setName={setName} />}
            ></Route>
          </Route>
        ) : isLogin && userRole === "marketingTeam" ? (
          <Route
            path="/"
            element={
              <Home
                setLogin={setLogin}
                setStoreId={setStoreId}
                setSellerId={setSellerId}
                name={name}
                role={userRole}
                setName={setName}
              />
            }
          >
            <Route
              index
              element={
                <Dashboard
                  storeId={storeId}
                  setName={setName}
                  role={userRole}
                />
              }
            ></Route>
            <Route
              path="notifications"
              element={
                <PushNotifications setName={setName} storeId={storeId} />
              }
            ></Route>
          </Route>
        ) : (
          <Route
            path="/"
            element={<Login setLogin={setLogin} setRole={setUserRole} />}
          ></Route>
        )}
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
