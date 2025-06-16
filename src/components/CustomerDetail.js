import "../styles/addforms.css";
import { useLocation, useNavigate } from "react-router-dom";
import backicon from "../assets/back.png";

export default function CustomerDetail() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const customer = state?.customer;

  if (!customer) {
    return <div className="content">Customer not found</div>;
  }

  return (
    <div className="content">
      <div className="form-header">
        <div className="back">
          <button
            className="back-btn"
            type="button"
            onClick={() => navigate("/customers")}
          >
            <img src={backicon} alt="Back" className="back-icon" />
          </button>
        </div>
        <span className="form-heading">Customer Details</span>
      </div>

      <div className="doctor-detail-container">
        {/* Profile Header */}
        <div className="doctor-profile-header">
          {customer.profilePhoto ? (
            <img
              src={customer.profilePhoto}
              alt={`${customer.first_name} ${customer.last_name}'s profile`}
              className="doctor-profile-photo"
            />
          ) : (
            <div className="doctor-profile-placeholder">No Photo</div>
          )}
          <div className="doctor-profile-info">
            <h1>
              {customer.first_name} {customer.last_name || ""}
            </h1>
            <p className="professional-title">
              Customer ID: {customer.customer_id}
            </p>
          </div>
        </div>

        {/* Customer Details */}
        <div className="doctor-details">
          <h2>Personal Information</h2>
          <div className="detail-grid">
            <div className="detail-item">
              <strong>UID:</strong> {customer.uid}
            </div>
            <div className="detail-item">
              <strong>Email:</strong> {customer.email || "N/A"}
            </div>
            <div className="detail-item">
              <strong>Phone:</strong>{" "}
              {customer.country_code
                ? `${customer.country_code}${customer.phone}`
                : customer.phone || "N/A"}
            </div>
            <div className="detail-item">
              <strong>Address:</strong> {customer.address || "N/A"}
            </div>
            <div className="detail-item">
              <strong>Date of Birth:</strong>{" "}
              {customer.dob
                ? new Date(customer.dob).toLocaleDateString()
                : "N/A"}
            </div>
            <div className="detail-item">
              <strong>Emergency Contact:</strong>{" "}
              {customer.emergencyContact || "N/A"}
            </div>
            <div className="detail-item">
              <strong>Country:</strong> {customer.country_name || "N/A"}
            </div>
            <div className="detail-item">
              <strong>Terms Accepted:</strong>{" "}
              {customer.termsAndCondition ? "Yes" : "No"}
            </div>

            <div className="detail-item">
              <strong>Emirate Id:</strong> {customer.emirate_id || "N/A"}
            </div>
          </div>

          <h2>Insurance Information</h2>
          <div className="detail-grid">
            <div className="detail-item">
              <strong>Insurance Provider:</strong>{" "}
              {customer.insuranceProvider || "N/A"}
            </div>
            <div className="detail-item">
              <strong>Policy Number:</strong> {customer.policyNumber || "N/A"}
            </div>
            <div className="detail-item">
              <strong>Group Number:</strong> {customer.groupNumber || "N/A"}
            </div>
            <div className="detail-item">
              <strong>Coverage Start Date:</strong>{" "}
              {customer.coverageStartDate
                ? new Date(customer.coverageStartDate).toLocaleDateString()
                : "N/A"}
            </div>
          </div>

          <h2>Account Information</h2>
          <div className="detail-grid">
            <div className="detail-item">
              <strong>Created At:</strong>{" "}
              {customer.createdAt
                ? new Date(customer.createdAt).toLocaleString()
                : "N/A"}
            </div>
            <div className="detail-item">
              <strong>Updated At:</strong>{" "}
              {customer.updatedAt
                ? new Date(customer.updatedAt).toLocaleString()
                : "N/A"}
            </div>
            <div className="detail-item">
              <strong>Device Token:</strong> {customer.device_token || "N/A"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
