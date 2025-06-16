import "../styles/addforms.css";
import { useLocation, useNavigate } from "react-router-dom";
import backicon from "../assets/back.png";
import { format } from "date-fns";

export default function DepartmentDetail() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const department = state?.department;

  if (!department) {
    return <div className="content">Department not found</div>;
  }

  console.log(department);

  return (
    <div className="content">
      <div className="form-header">
        <div className="back">
          <button
            className="back-btn"
            type="button"
            onClick={() => navigate("/department")}
          >
            <img src={backicon} alt="Back" className="back-icon" />
          </button>
        </div>
        <span className="form-heading">Department Details</span>
      </div>

      <div className="department-detail-container">
        {/* Department Header */}
        <div className="department-profile-header">
          {department.media ? (
            <img
              src={department.media}
              alt={`${department.name} media`}
              className="department-profile-photo"
            />
          ) : (
            <div className="department-profile-placeholder">No Media</div>
          )}
          <div className="department-profile-info">
            <h1>{department.name}</h1>
            {/* <p className="department-id">Department ID: {department.id}</p> */}
          </div>
        </div>

        {/* Department Details */}
        <div className="department-details">
          <h2>Department Information</h2>
          <div className="detail-grid">
            <div className="detail-item">
              <strong>Short Description:</strong> {department.shortDes || "N/A"}
            </div>
            <div className="detail-item">
              <strong>Description:</strong> {department.des || "N/A"}
            </div>
            <div className="detail-item">
              <strong>Created At:</strong>{" "}
              {department.createdAt
                ? format(new Date(department.createdAt), "dd/MM/yyyy HH:mm")
                : "N/A"}
            </div>
            <div className="detail-item">
              <strong>Updated At:</strong>{" "}
              {department.updatedAt
                ? format(new Date(department.updatedAt), "dd/MM/yyyy HH:mm")
                : "N/A"}
            </div>
            <div className="detail-item">
              <strong>Status:</strong>{" "}
              {department.isDeleted ? "Deleted" : "Active"}
            </div>
          </div>

          {/* Child Categories */}
          <h2>Services</h2>
          {department.childCategories &&
          department.childCategories.length > 0 ? (
            <div className="child-categories-list">
              {department.childCategories.map((category, index) => (
                <div key={index} className="category-card">
                  <ul>
                    <li>{category.des}</li>
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <p>No child categories available.</p>
          )}

          {/* Doctors List */}
          <h2>Doctors</h2>
          {department.Doctors && department.Doctors.length > 0 ? (
            <div className="doctors-list">
              {department.Doctors.map((doctor, index) => (
                <div key={index} className="doctor-card">
                  <h3>{doctor.name}</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <strong>Professional Title:</strong>{" "}
                      {doctor.professionalTitle || "N/A"}
                    </div>
                    <div className="detail-item">
                      <strong>Fees:</strong> {doctor.fees || "N/A"}
                    </div>
                    <div className="detail-item">
                      <strong>Gender:</strong> {doctor.gender || "N/A"}
                    </div>
                    <div className="detail-item">
                      <strong>Nationality:</strong>{" "}
                      {doctor.nationality || "N/A"}
                    </div>
                    <div className="detail-item">
                      <strong>Email:</strong>{" "}
                      {doctor.personalEmailAddress || "N/A"}
                    </div>
                    <div className="detail-item">
                      <strong>Phone:</strong>{" "}
                      {doctor.personalMobileNumber || "N/A"}
                    </div>
                    <div className="detail-item">
                      <strong>Primary Location:</strong>{" "}
                      {doctor.primaryLocation || "N/A"}
                    </div>
                    <div className="detail-item">
                      <strong>Experience:</strong> {doctor.experience || "N/A"}
                    </div>
                    <div className="detail-item">
                      <strong>Languages:</strong>{" "}
                      {doctor.languages?.join(", ") || "N/A"}
                    </div>
                    <div className="detail-item">
                      <strong>Specialties:</strong>{" "}
                      {doctor.specialties?.join(", ") || "N/A"}
                    </div>
                    <div className="detail-item">
                      <strong>Education:</strong>{" "}
                      {doctor.degreeQualification || "N/A"} from{" "}
                      {doctor.universityName || "N/A"} (
                      {doctor.yearOfGraduation || "N/A"})
                    </div>
                    <div className="detail-item">
                      <strong>Certifications:</strong>{" "}
                      {doctor.educationCertifications
                        ? Object.entries(doctor.educationCertifications)
                            .map(([key, value]) => `${key}: ${value}`)
                            .join(", ")
                        : "N/A"}
                    </div>
                    <div className="detail-item">
                      <strong>License Expiry:</strong>{" "}
                      {doctor.licenseExpiryDate
                        ? format(
                            new Date(doctor.licenseExpiryDate),
                            "dd/MM/yyyy"
                          )
                        : "N/A"}
                    </div>
                    <div className="detail-item">
                      <strong>Regulating Authority:</strong>{" "}
                      {doctor.regulatingAuthority || "N/A"}
                    </div>
                    <div className="detail-item">
                      <strong>Average Rating:</strong>{" "}
                      {doctor.averageRating || "N/A"}
                    </div>
                    <div className="detail-item">
                      <strong>About:</strong> {doctor.aboutMe || "N/A"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No doctors available in this department.</p>
          )}
        </div>
      </div>
    </div>
  );
}
