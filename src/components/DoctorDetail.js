import "../styles/addforms.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import backicon from "../assets/back.png";

export default function DoctorDetail(props) {
  const navigate = useNavigate();
  const doctordetail = localStorage.getItem("user");
  const doctorData = JSON.parse(doctordetail);
  const doctor = doctorData?.data;
  console.log(doctor);

  useEffect(() => {
    props.setName("Profile");
  }, [props]);
  if (!doctor) {
    return <div className="content">Doctor not found</div>;
  }

  return (
    <div className="content">
      {/* <div className="form-header">
       
      </div> */}

      <div className="doctor-detail-container">
        {/* Profile Header */}
        <div className="doctor-profile-header">
          {doctor.profilePhoto ? (
            <img
              src={doctor.profilePhoto}
              alt={`${doctor.name}'s profile`}
              className="doctor-profile-photo"
            />
          ) : (
            <div className="doctor-profile-placeholder">No Photo</div>
          )}
          <div className="doctor-profile-info">
            <h1>{doctor.name}</h1>
            <p className="professional-title">{doctor.professionalTitle}</p>
            <p className="average-rating">Rating: {doctor.averageRating} / 5</p>
          </div>
        </div>

        {/* Doctor Details */}
        <div className="doctor-details">
          <h2>Professional Information</h2>
          <div className="detail-grid">
            {/* <div className="detail-item">
              <strong>ID:</strong> {doctor.id}
            </div> */}
            <div className="detail-item">
              <strong>Department:</strong> {doctor.department?.name || "N/A"}
            </div>
            <div className="detail-item">
              <strong>Specialties:</strong>{" "}
              {doctor.specialties?.join(", ") || "None"}
            </div>
            <div className="detail-item">
              <strong>Fees:</strong> PKR {doctor.fees}
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
              {doctor.languages?.join(", ") || "None"}
            </div>
            <div className="detail-item">
              <strong>Surgeon:</strong> {doctor.surgeon ? "Yes" : "No"}
            </div>
            <div className="detail-item">
              <strong>Regulating Authority:</strong>{" "}
              {doctor.regulatingAuthority || "N/A"}
            </div>
            <div className="detail-item">
              <strong>License Expiry:</strong>{" "}
              {doctor.licenseExpiryDate
                ? new Date(doctor.licenseExpiryDate).toLocaleDateString()
                : "N/A"}
            </div>
          </div>

          <h2>Educational Background</h2>
          <div className="detail-grid">
            <div className="detail-item">
              <strong>Degree:</strong> {doctor.degreeQualification || "N/A"}
            </div>
            <div className="detail-item">
              <strong>University:</strong> {doctor.universityName || "N/A"}
            </div>
            <div className="detail-item">
              <strong>Year of Graduation:</strong>{" "}
              {doctor.yearOfGraduation || "N/A"}
            </div>
            <div className="detail-item">
              <strong>Certifications:</strong>{" "}
              {doctor.educationCertifications
                ? Object.entries(doctor.educationCertifications)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join(", ")
                : "None"}
            </div>
          </div>

          <h2>Personal Information</h2>
          <div className="detail-grid">
            <div className="detail-item">
              <strong>Gender:</strong> {doctor.gender || "N/A"}
            </div>
            <div className="detail-item">
              <strong>Nationality:</strong> {doctor.nationality || "N/A"}
            </div>
            <div className="detail-item">
              <strong>Mobile Number:</strong>{" "}
              {doctor.personalMobileNumber || "N/A"}
            </div>
            <div className="detail-item">
              <strong>Email:</strong> {doctor.personalEmailAddress || "N/A"}
            </div>
          </div>

          <h2>About</h2>
          <p className="about-me">
            {doctor.aboutMe || "No description available."}
          </p>
          <h2>Department Details</h2>
          <div className="detail-grid">
            <div className="detail-item">
              <strong>Department Name:</strong>{" "}
              {doctor.department?.name || "N/A"}
            </div>
            <div className="detail-item">
              <strong>Short Description:</strong>{" "}
              {doctor.department?.shortDes || "N/A"}
            </div>
            <div className="detail-item">
              <strong>Description:</strong> {doctor.department?.des || "N/A"}
            </div>
          </div>

          <h2>Credentials</h2>
          <div className="detail-grid">
            <div className="detail-item">
              <strong>Email:</strong> {doctor.email || "N/A"}
            </div>
            <div className="detail-item">
              <strong>Password:</strong> {doctor.password || "N/A"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
