// import React, { useState } from "react";
// import axios from "axios";
// import "../styles/addforms.css";
// import CreatableSelect from "react-select";
// import imageicon from "../assets/Imageicon.png";

// const resourcesOptions = [
//   {
//     value: "tin",
//     label: "tin",
//   },
//   {
//     value: "nin",
//     label: "nin",
//   },
// ];

// export default function Addresources() {
//   const [resource, setResource] = useState({
//     serviceTitle: "",
//     sellerName: "",
//     availibility: "",
//     expertise: "",
//     experience: "",
//   });

//   const handleResourceChange = (e, key) => {
//     setResource({
//       ...resource,
//       [key?.name || e?.target?.name || key]:
//         e?.value || e?.target?.files?.[0] || e?.target?.value || "",
//     });
//   };

//   async function handleSubmit(event) {
//     event.preventDefault();

//     const formData = { resource };
//     console.log(formData);

//     try {
//       const response = await axios.post(
//         "https://test-api.petsetgo.com/v1/seller/resources/add",
//         formData
//       );
//       console.log(response.data);
//     } catch (error) {
//       console.error(error);
//     }
//   }

//   const customColor = (baseStyles) => ({
//     ...baseStyles,
//     background: "#FFFFFF",
//     height: "52px",
//   });
//   return (
//     <div className="add-resource">
//       <div className="res-form">
//         <div className="res-head">
//           <span className="form-heading">Add Resources</span>
//         </div>
//         <div className="res-no-more">
//           <div className="empty"></div>
//           <div className="more">
//             <div>
//               <span className="res-no">RES009</span>
//             </div>
//             <div>
//               <button className="more-btn">Add more</button>
//             </div>
//           </div>
//         </div>
//         <div>
//           <form onSubmit={handleSubmit}>
//             <div className="resform-content">
//               <div className="res-row">
//                 <div className="res-field">
//                   <span>Name</span>
//                   <input
//                     type="text"
//                     placeholder="Service Title"
//                     className="res-input"
//                     id="serviceTitle"
//                     name="serviceTitle"
//                     value={resource.serviceTitle}
//                     onChange={handleResourceChange}
//                   />
//                 </div>
//                 <div className="res-field">
//                   <span>Seller Name</span>
//                   <CreatableSelect
//                     styles={{
//                       control: customColor,
//                     }}
//                     options={resourcesOptions}
//                     placeholder="petsetCorner"
//                     className="select-in"
//                     id="sellerName"
//                     name="sellerName"
//                     // value={resource.sellerName}
//                     onChange={handleResourceChange}
//                   />
//                 </div>
//               </div>
//               <div className="res-row">
//                 <div className="res-field">
//                   <span>Availability</span>
//                   <CreatableSelect
//                     styles={{
//                       control: customColor,
//                     }}
//                     options={resourcesOptions}
//                     placeholder="Yes"
//                     className="select-in"
//                     id="availibilty"
//                     name="availibility"
//                     // value={resource.availibilty}
//                     onChange={handleResourceChange}
//                   />
//                 </div>
//                 <div className="res-field">
//                   <span>Expertise</span>
//                   <CreatableSelect
//                     styles={{
//                       control: customColor,
//                     }}
//                     options={resourcesOptions}
//                     placeholder="Grooming"
//                     className="select-in"
//                     id="expertise"
//                     name="expertise"
//                     // value={resource.expertise}
//                     onChange={handleResourceChange}
//                   />
//                 </div>
//                 <div className="res-field">
//                   <span>Experience</span>
//                   <CreatableSelect
//                     styles={{
//                       control: customColor,
//                     }}
//                     options={resourcesOptions}
//                     placeholder="1Year"
//                     className="select-in"
//                     id="experience"
//                     name="experience"
//                     // value={resource.experience}
//                     onChange={handleResourceChange}
//                   />
//                 </div>
//               </div>
//               <div>
//                 <button className="res-sub-btn" type="submit">
//                   Submit
//                 </button>
//               </div>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }
