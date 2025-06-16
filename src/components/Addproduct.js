import React, { useState, useEffect } from "react";
import "../styles/addforms.css";
import CreatableSelect from "react-select";
import Select from "react-select";
import imageicon from "../assets/Imageicon.png";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import backicon from "../assets/back.png";
import Rating from "react-rating-stars-component";
import { url } from "../utils/urls.js";

export default function Addproduct(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const [authToken] = useState(localStorage.getItem("authToken") || "");
  const [session_id] = useState(localStorage.getItem("session_id") || "");
  const [previousData, setPreviousData] = useState(
    location.state?.data || props.previousData || ""
  );
  const [store_id] = useState(props.storeId || previousData?.store_id || "");

  // State for doctor fields
  const [doctor, setDoctor] = useState({
    name: previousData?.name || "",
    gender: previousData?.gender || "",
    nationality: previousData?.nationality || "",
    personalMobileNumber: previousData?.personalMobileNumber || "",
    personalEmailAddress: previousData?.personalEmailAddress || "",
    licenseExpiryDate: previousData?.licenseExpiryDate || "",
    regulatingAuthority: previousData?.regulatingAuthority || "",
    professionalTitle: previousData?.professionalTitle || "",
    fees: previousData?.fees || "",
    primaryLocation: previousData?.primaryLocation || "",
    experience: previousData?.experience || "",
    languages:
      previousData?.languages?.map((lang) => ({ label: lang, value: lang })) ||
      [],
    surgeon: previousData?.surgeon || false,
    specialties:
      previousData?.specialties?.map((spec) => ({
        label: spec,
        value: spec,
      })) || [],
    educationCertifications: previousData?.educationCertifications || {},
    degreeQualification: previousData?.degreeQualification || "",
    universityName: previousData?.universityName || "",
    yearOfGraduation: previousData?.yearOfGraduation || "",
    averageRating: previousData?.averageRating || "",
    aboutMe: previousData?.aboutMe || "",
    department_id: previousData?.department_id || "",
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [degreeCertificate, setDegreeCertificate] = useState(null);
  const [specialistCertification, setSpecialistCertification] = useState(null);
  const [media, setMedia] = useState(previousData?.profilePhoto || "");
  const [departments, setDepartments] = useState([]);

  // Gender options
  const genderOptions = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
    { label: "Other", value: "Other" },
  ];

  // Fetch departments
  const fetchDepartments = async () => {
    try {
      const response = await axios.get(`${url}/v1/department/get/all`, {
        headers: { authtoken: authToken, sessionid: session_id },
      });
      setDepartments(
        response.data.data.map((e) => ({ label: e.name, value: e.id }))
      );
    } catch (error) {
      console.error("Fetch departments error:", error);
      toast.error("Failed to fetch departments");
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    setPreviousData(location.state?.data || props.previousData || "");
    setDoctor({
      name: previousData?.name || "",
      gender: previousData?.gender || "",
      nationality: previousData?.nationality || "",
      personalMobileNumber: previousData?.personalMobileNumber || "",
      personalEmailAddress: previousData?.personalEmailAddress || "",
      licenseExpiryDate: previousData?.licenseExpiryDate || "",
      regulatingAuthority: previousData?.regulatingAuthority || "",
      professionalTitle: previousData?.professionalTitle || "",
      fees: previousData?.fees || "",
      primaryLocation: previousData?.primaryLocation || "",
      experience: previousData?.experience || "",
      languages:
        previousData?.languages?.map((lang) => ({
          label: lang,
          value: lang,
        })) || [],
      surgeon: previousData?.surgeon || false,
      specialties:
        previousData?.specialties?.map((spec) => ({
          label: spec,
          value: spec,
        })) || [],
      educationCertifications: previousData?.educationCertifications || {},
      degreeQualification: previousData?.degreeQualification || "",
      universityName: previousData?.universityName || "",
      yearOfGraduation: previousData?.yearOfGraduation || "",
      averageRating: previousData?.averageRating || "",
      aboutMe: previousData?.aboutMe || "",
      department_id: previousData?.department_id || "",
    });
    setMedia(previousData?.profilePhoto || "");
  }, [previousData, props.previousData, location.state]);

  // Handle file uploads
  const handleFileChange = (setFile) => (event) => {
    event.preventDefault();
    setFile(event.target.files[0]);
  };

  // Handle doctor field changes
  const handleDoctorChange = (e, key) => {
    setDoctor({
      ...doctor,
      [key?.name || e?.target?.name || key]: e?.value || e?.target?.value || "",
    });
  };

  // Handle array fields
  const handleArrayEvent = (e, key) => {
    setDoctor({ ...doctor, [key]: e });
  };

  // Handle education certifications
  const handleEducationCertifications = (e) => {
    const { name, value } = e.target;
    setDoctor((prev) => ({
      ...prev,
      educationCertifications: {
        ...prev.educationCertifications,
        [name]: value,
      },
    }));
  };

  // Upload media
  const uploadMedia = async (file) => {
    if (!file) return null;
    const formData = new FormData();
    formData.append("media", file);
    try {
      const response = await axios.post(
        `${url}/v1/store/media/upload`,
        formData,
        {
          headers: {
            authtoken: authToken,
            sessionid: session_id,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return "sellers/" + response.data.fileKey;
    } catch (error) {
      console.error("Media upload failed:", error);
      toast.error(error.response?.data?.message || "Media upload failed");
      return null;
    }
  };

  // Submit doctor
  const formSubmit = async (formData) => {
    try {
      const endpoint = `${url}/v1/doctor/update`;
      //  previousData?.id
      //   ? `${url}/v1/doctor/create`
      //   : `${url}/v1/doctor/update`;
      const response = await axios.put(endpoint, formData);
      toast.success("Doctor updated");

      navigate("/doctors_detail"); // Adjust to your route
    } catch (error) {
      console.error("Form submit error:", error);
      toast.error(error.response?.data?.error || "Request failed");
    }
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    toast("Request loading, please wait", { progress: true });
    try {
      const profilePhotoUrl = await uploadMedia(profilePhoto);
      const degreeCertificateUrl = await uploadMedia(degreeCertificate);
      const specialistCertificateUrl = await uploadMedia(
        specialistCertification
      );
      // if (!profilePhotoUrl && !previousData?.profilePhoto) {
      //   toast.error("Profile photo is required");
      //   return;
      // }
      const formData = {
        ...doctor,
        id: previousData?.id, // Include id for updates
        profilePhoto: profilePhotoUrl || doctor.profilePhoto,
        degreeCertificate: degreeCertificateUrl || doctor.degreeCertificate,
        specialistCertification:
          specialistCertificateUrl || doctor.specialistCertification,
        languages: doctor.languages.map((lang) => lang.value),
        specialties: doctor.specialties.map((spec) => spec.value),
        fees: parseFloat(doctor.fees) || 0,
        averageRating: parseFloat(doctor.averageRating) || 0,
      };
      await formSubmit(formData);
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Request failed");
    }
  };

  const customColor = (baseStyles) => ({
    ...baseStyles,
    backgroundColor: "rgba(239, 241, 249, 0.6)",
    minHeight: "52px",
  });

  return (
    <div className="content">
      <form className="adding-form" onSubmit={handleSubmit}>
        <div className="form-header">
          <div className="back">
            <button
              className="back-btn"
              type="button"
              onClick={() => navigate("/doctors_detail")}
            >
              <img src={backicon} alt="back" className="back-icon" />
            </button>
          </div>
          <span className="form-heading">{doctor.name || "Add Doctor"}</span>
          <button type="submit" className="submit-btn addp">
            {previousData?.id ? "Update" : "Create"}
          </button>
        </div>
        {doctor.averageRating ? (
          <div className="form-header" style={{ paddingLeft: "35px" }}>
            <Rating
              count={5}
              value={parseFloat(doctor.averageRating)}
              size={30}
              edit={false}
              isHalf={true}
              emptyIcon={<i className="far fa-star"></i>}
              halfIcon={<i className="fa fa-star-half-alt"></i>}
              fullIcon={<i className="fa fa-star"></i>}
            />
            <span className="form-heading">{doctor.averageRating}/5</span>
          </div>
        ) : null}
        <div className="form-body">
          <div className="form-content">
            <div className="content-right">
              <input
                required
                type="text"
                name="name"
                placeholder="Name"
                className="field"
                value={doctor.name}
                onChange={handleDoctorChange}
              />
              <Select
                styles={{ control: customColor }}
                options={genderOptions}
                value={genderOptions.find((opt) => opt.value === doctor.gender)}
                onChange={(e) =>
                  handleDoctorChange({
                    target: { name: "gender", value: e.value },
                  })
                }
                placeholder="Gender"
              />
              <input
                required
                type="text"
                name="nationality"
                placeholder="Nationality"
                className="field"
                value={doctor.nationality}
                onChange={handleDoctorChange}
              />
              <input
                required
                type="text"
                name="personalMobileNumber"
                placeholder="Personal Mobile Number"
                className="field"
                value={doctor.personalMobileNumber}
                onChange={handleDoctorChange}
              />
              <input
                required
                type="email"
                name="personalEmailAddress"
                placeholder="Personal Email Address"
                className="field"
                value={doctor.personalEmailAddress}
                onChange={handleDoctorChange}
              />
              <input
                required
                type="date"
                name="licenseExpiryDate"
                placeholder="License Expiry Date"
                className="field"
                value={doctor.licenseExpiryDate}
                onChange={handleDoctorChange}
              />
              <input
                required
                type="text"
                name="regulatingAuthority"
                placeholder="Regulating Authority"
                className="field"
                value={doctor.regulatingAuthority}
                onChange={handleDoctorChange}
              />
              <input
                required
                type="text"
                name="professionalTitle"
                placeholder="Professional Title"
                className="field"
                value={doctor.professionalTitle}
                onChange={handleDoctorChange}
              />
              <input
                required
                type="number"
                name="fees"
                placeholder="Fees"
                className="field"
                value={doctor.fees}
                onChange={handleDoctorChange}
              />
              <input
                required
                type="text"
                name="primaryLocation"
                placeholder="Primary Location"
                className="field"
                value={doctor.primaryLocation}
                onChange={handleDoctorChange}
              />
              <input
                required
                type="text"
                name="experience"
                placeholder="Experience (e.g., 12 years)"
                className="field"
                value={doctor.experience}
                onChange={handleDoctorChange}
              />
              <CreatableSelect
                isMulti
                styles={{ control: customColor }}
                value={doctor.languages}
                onChange={(e) => handleArrayEvent(e, "languages")}
                placeholder="Languages"
                className="field"
              />
              <div>
                <label>
                  <input
                    type="checkbox"
                    name="surgeon"
                    checked={doctor.surgeon}
                    onChange={(e) =>
                      setDoctor({ ...doctor, surgeon: e.target.checked })
                    }
                  />
                  Surgeon
                </label>
              </div>
              <CreatableSelect
                isMulti
                styles={{ control: customColor }}
                value={doctor.specialties}
                onChange={(e) => handleArrayEvent(e, "specialties")}
                placeholder="Specialties"
                className="field"
              />
              <input
                type="text"
                name="FCPS"
                placeholder="FCPS Certification"
                className="field"
                value={doctor.educationCertifications.FCPS || ""}
                onChange={handleEducationCertifications}
              />
              <input
                type="text"
                name="MRCP"
                placeholder="MRCP Certification"
                className="field"
                value={doctor.educationCertifications.MRCP || ""}
                onChange={handleEducationCertifications}
              />
              <input
                required
                type="text"
                name="degreeQualification"
                placeholder="Degree Qualification"
                className="field"
                value={doctor.degreeQualification}
                onChange={handleDoctorChange}
              />
              <input
                required
                type="text"
                name="universityName"
                placeholder="University Name"
                className="field"
                value={doctor.universityName}
                onChange={handleDoctorChange}
              />
              <input
                required
                type="number"
                name="yearOfGraduation"
                placeholder="Year of Graduation"
                className="field"
                value={doctor.yearOfGraduation}
                onChange={handleDoctorChange}
              />
              <input
                required
                type="number"
                step="0.1"
                name="averageRating"
                placeholder="Average Rating (e.g., 4.7)"
                className="field"
                value={doctor.averageRating}
                onChange={handleDoctorChange}
              />
              <textarea
                required
                name="aboutMe"
                placeholder="About Me"
                className="field description"
                value={doctor.aboutMe}
                onChange={handleDoctorChange}
              />
              <Select
                styles={{ control: customColor }}
                options={departments}
                value={departments.find(
                  (opt) => opt.value === doctor.department_id
                )}
                onChange={(e) =>
                  handleDoctorChange({
                    target: { name: "department_id", value: e.value },
                  })
                }
                placeholder="Department"
                className="field"
              />
            </div>
            <div className="form-image">
              {[
                {
                  id: "profilePhoto",
                  label: "Upload Profile Photo",
                  file: profilePhoto,
                  setter: setProfilePhoto,
                },
                {
                  id: "degreeCertificate",
                  label: "Upload Degree Certificate",
                  file: degreeCertificate,
                  setter: setDegreeCertificate,
                },
                {
                  id: "specialistCertification",
                  label: "Upload Specialist Certification",
                  file: specialistCertification,
                  setter: setSpecialistCertification,
                },
              ].map(({ id, label, file, setter }) => (
                <div className="image-sec" key={id}>
                  <div className="imageicon">
                    <img
                      src={
                        file
                          ? URL.createObjectURL(file)
                          : id === "profilePhoto" && media
                          ? media.substring(0, 4) === "http"
                            ? media
                            : `https://petsetgostorage.blob.core.windows.net/petsetgo-u2/${media}`
                          : imageicon
                      }
                      alt={label}
                      className="image"
                    />
                  </div>
                  <div className="imagehead">
                    <label htmlFor={id} style={{ cursor: "pointer" }}>
                      {label}
                    </label>
                    <input
                      type="file"
                      id={id}
                      name={id}
                      onChange={handleFileChange(setter)}
                      className="file"
                    />
                  </div>
                  <span className="imagepg">
                    Upload an image for your{" "}
                    {id === "profilePhoto"
                      ? "profile"
                      : id === "degreeCertificate"
                      ? "degree certificate"
                      : "specialist certification"}
                    .
                    <br />
                    File Format jpeg, png Recommended Size 600x600 (1:1)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
}
