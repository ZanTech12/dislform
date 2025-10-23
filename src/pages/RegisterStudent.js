// src/pages/RegisterStudent.jsx
import "../App.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import bgImage from "../background.jpg";
import studentImg from "../student.jpg";
import AdminFooter from "../components/AdminFooter";
import { FaUser, FaCalendarAlt, FaFlag, FaSchool, FaEnvelope, FaPhone } from "react-icons/fa";
import nigeriaLgas from "../data/nigeriaLgas.json";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function RegisterStudent() {
    const initialForm = {
        firstName: "",
        middleName: "",
        lastName: "",
        gender: "",
        dateOfBirth: "",
        nationality: "",
        stateOfOrigin: "",
        lga: "",
        homeAddress: "",
        religion: "",
        classLevel: "",
        section: "",
        session: "",
        term: "",          // <-- term field added here
        previousSchool: "",
        dateOfAdmission: "",
        phoneNumber: "",
    };

    // ✅ Always show popup on page load
    const [showPopup, setShowPopup] = useState(true);

    const handleClosePopup = () => {
        setShowPopup(false);
    };


    const [form, setForm] = useState(initialForm);
    const [passport, setPassport] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    const availableLgas = form.stateOfOrigin ? nigeriaLgas[form.stateOfOrigin] || [] : [];

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const fd = new FormData();
            Object.keys(form).forEach((key) => fd.append(key, form[key]));
            if (passport) fd.append("passport", passport);

            const response = await axios.post(
                "https://datregdatabase-1.onrender.com/api/students/register",
                fd,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            alert("✅ Registration successful!");
            setForm(initialForm);
            setPassport(null);
        } catch (err) {
            if (err.response) {
                // ✅ Handle duplicate student clearly
                if (err.response.status === 409) {
                    // Use backend message if exists, otherwise fallback
                    const message =
                        err.response.data?.message ||
                        "⚠️ A student with this information already exists!";
                    alert(message);
                } else {
                    alert(`❌ ${err.response.data?.message || "Error registering student"}`);
                }
            } else {
                alert("❌ Network or server error");
            }
            console.error(err);
        }
    };


    const inputField = (icon, element) => (
        <div style={{ ...inputWrapper, flex: isMobile ? "100%" : "1" }}>
            <span style={iconStyle}>{icon}</span>
            {element}
        </div>
    );

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener("resize", handleResize);

        const styleSheet = document.styleSheets[0];
        const keyframes = `
          @keyframes moveLeftRight {
            0% { transform: translateX(0); }
            50% { transform: translateX(20px); }
            100% { transform: translateX(0); }
          }
        `;
        styleSheet.insertRule(keyframes, styleSheet.cssRules.length);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div>
            <style>
                {`
      @keyframes fadeInOverlay {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      @keyframes fadeInPopup {
        from { transform: translateY(-20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      `}
            </style>

            {/* ✅ Popup always shows on page load */}
            {showPopup && (
                <div style={overlayStyle}>
                    <div style={popupStyle}>
                        <h2 style={{ color: "#800000" }}>Important Notice</h2>
                        <p>
                            Students/Teachers/Parents are required to register their wards
                            to the <strong>Student Management System</strong> because
                            it will serve as their database for academic record(s).
                        </p>
                        <button style={buttonStyle} onClick={handleClosePopup}>
                            OK, I Understand
                        </button>
                    </div>
                </div>
            )}
            <div style={background}>
                <div style={outerContainer}>
                    <div style={{ ...container, maxWidth: isMobile ? "95%" : "750px" }}>
                        <div style={marqueeContainer}>
                            <img src={studentImg} alt="Student" style={marqueeImage} />
                            <p style={{ ...marqueeText, whiteSpace: isMobile ? "normal" : "nowrap" }}>
                                ⚠️ Please fill the form carefully with your correct information!
                            </p>
                        </div>

                        <h2 style={title}>📝 Student Registration</h2>

                        <form onSubmit={handleSubmit} style={formStyle}>
                            {/* --- Input Rows --- */}
                            <div style={{ ...row, flexDirection: isMobile ? "column" : "row" }}>
                                {inputField(
                                    <FaUser />,
                                    <input
                                        type="text"
                                        name="firstName"
                                        placeholder="First Name"
                                        value={form.firstName}
                                        onChange={handleChange}
                                        required
                                        style={input}
                                    />
                                )}
                                {inputField(
                                    <FaUser />,
                                    <input
                                        type="text"
                                        name="middleName"
                                        placeholder="Middle Name"
                                        value={form.middleName}
                                        onChange={handleChange}
                                        style={input}
                                    />
                                )}
                            </div>

                            <div style={{ ...row, flexDirection: isMobile ? "column" : "row" }}>
                                {inputField(
                                    <FaUser />,
                                    <input
                                        type="text"
                                        name="lastName"
                                        placeholder="Last Name"
                                        value={form.lastName}
                                        onChange={handleChange}
                                        required
                                        style={input}
                                    />
                                )}
                                {inputField(
                                    <FaUser />,
                                    <select
                                        name="gender"
                                        value={form.gender}
                                        onChange={handleChange}
                                        required
                                        style={input}
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                )}
                            </div>

                            {/* Date of Birth */}

                            <div style={{ marginBottom: "15px" }}>
                                <label htmlFor="dateOfBirth" style={{ display: "block", marginBottom: "5px" }}>
                                    Date of Birth:
                                </label>
                                <DatePicker
                                    id="dateOfBirth"
                                    selected={form.dateOfBirth ? new Date(form.dateOfBirth) : null}
                                    onChange={(date) =>
                                        setForm({
                                            ...form,
                                            dateOfBirth: date ? date.toISOString().split("T")[0] : "",
                                        })
                                    }
                                    dateFormat="yyyy-MM-dd"
                                    placeholderText="YYYY-MM-DD"
                                    customInput={
                                        <input
                                            type="text"
                                            name="dateOfBirth"
                                            placeholder="YYYY-MM-DD"
                                            value={form.dateOfBirth}
                                            onChange={(e) =>
                                                setForm({ ...form, dateOfBirth: e.target.value })
                                            }
                                            style={input}
                                            required
                                        />
                                    }
                                />
                            </div>
                            {inputField(
                                <FaUser />,
                                <select
                                    name="religion"
                                    value={form.religion}
                                    onChange={handleChange}
                                    required
                                    style={input}
                                >
                                    <option value="">Select Religion</option>
                                    <option value="Christianity">Christianity</option>
                                    <option value="Islam">Islam</option>
                                    <option value="Other">Other</option>
                                </select>
                            )}

                            <div style={{ marginBottom: "15px" }}>
                                <label htmlFor="nationality" style={{ display: "block", marginBottom: "5px" }}>
                                    Nationality:
                                </label>
                                <input
                                    type="text"
                                    id="nationality"
                                    name="nationality"
                                    placeholder="Nationality"
                                    value={form.nationality}
                                    onChange={handleChange}
                                    style={input}
                                    required
                                />
                            </div>

                            {/* State and LGA */}
                            <div style={{ marginBottom: "15px" }}>
                                <label htmlFor="stateOfOrigin" style={{ display: "block", marginBottom: "5px" }}>
                                    State of Origin:
                                </label>
                                <select
                                    id="stateOfOrigin"
                                    name="stateOfOrigin"
                                    value={form.stateOfOrigin}
                                    onChange={handleChange}
                                    style={input}
                                    required
                                >
                                    <option value="">Select State of Origin</option>
                                    {Object.keys(nigeriaLgas).map((state) => (
                                        <option key={state} value={state}>
                                            {state}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div style={{ marginBottom: "15px" }}>
                                <label htmlFor="lga" style={{ display: "block", marginBottom: "5px" }}>
                                    Local Government Area:
                                </label>
                                <select
                                    id="lga"
                                    name="lga"
                                    value={form.lga}
                                    onChange={handleChange}
                                    style={input}
                                    disabled={!form.stateOfOrigin} // only enabled if state is selected
                                    required
                                >
                                    <option value="">Select Local Government Area</option>
                                    {availableLgas.map((lga) => (
                                        <option key={lga} value={lga}>
                                            {lga}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div style={{ marginBottom: "15px" }}>
                                <label htmlFor="homeAddress" style={{ display: "block", marginBottom: "5px" }}>
                                    Home Address:
                                </label>
                                <textarea
                                    id="homeAddress"
                                    name="homeAddress"
                                    value={form.homeAddress}
                                    onChange={handleChange}
                                    style={{
                                        ...input,
                                        height: "80px", // taller for multiline input
                                        resize: "vertical" // user can resize vertically
                                    }}
                                    placeholder="Enter your home address"
                                    required
                                />
                            </div>


                            <div style={{ marginBottom: "15px" }}>
                                <label htmlFor="phone" style={{ display: "block", marginBottom: "5px" }}>
                                    Phone Number:
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={form.phone}
                                    onChange={(e) => {
                                        // Remove all non-digit characters
                                        let cleaned = e.target.value.replace(/\D/g, "");

                                        // Limit to 10 digits
                                        if (cleaned.length > 10) cleaned = cleaned.slice(0, 10);

                                        // Format as XXX-XXX-XXXX
                                        let formatted = cleaned;
                                        if (cleaned.length > 6) {
                                            formatted = `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
                                        } else if (cleaned.length > 3) {
                                            formatted = `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
                                        }

                                        setForm({ ...form, phone: formatted });
                                    }}
                                    style={input}
                                    placeholder="XXX-XXX-XXXX"
                                    required
                                />
                            </div>



                            <div style={{ marginBottom: "15px" }}>
                                <label htmlFor="classLevel" style={{ display: "block", marginBottom: "5px" }}>
                                    Class:
                                </label>
                                <select
                                    id="classLevel"
                                    name="classLevel"
                                    value={form.classLevel}
                                    onChange={handleChange}
                                    style={input}
                                    required
                                >
                                    <option value="">Select Class</option>
                                    <option value="Reception">Reception</option>
                                    <option value="KG1">KG 1</option>
                                    <option value="KG2">KG 2</option>
                                    <option value="Nursery 1">Nursery 1</option>
                                    <option value="Nursery 2">Nursery 2</option>
                                    <option value="Primary 1">Primary 1</option>
                                    <option value="Primary 2">Primary 2</option>
                                    <option value="Primary 3">Primary 3</option>
                                    <option value="Primary 4">Primary 4</option>
                                    <option value="Primary 5">Primary 5</option>
                                    <option value="Primary 6">Primary 6</option>
                                    <option value="JSS1">JSS 1</option>
                                    <option value="JSS2">JSS 2</option>
                                    <option value="JSS3">JSS 3</option>
                                    <option value="SSS1">SSS 1</option>
                                    <option value="SSS2">SSS 2</option>
                                    <option value="SSS3">SSS 3</option>
                                </select>
                            </div>

                            <div style={{ marginBottom: "15px" }}>
                                <label htmlFor="section" style={{ display: "block", marginBottom: "5px" }}>
                                    Section:
                                </label>
                                <select
                                    id="section"
                                    name="section"
                                    value={form.section}
                                    onChange={handleChange}
                                    style={input}
                                    required
                                >
                                    <option value="">Select Section</option>
                                    <option value="A">A</option>
                                    <option value="B">B</option>
                                    <option value="C">C</option>
                                    <option value="D">D</option>
                                </select>
                            </div>

                            <div style={{ marginBottom: "15px" }}>
                                <label htmlFor="term" style={{ display: "block", marginBottom: "5px" }}>
                                    Term:
                                </label>
                                <select
                                    id="term"
                                    name="term"
                                    value={form.term}
                                    onChange={handleChange}
                                    style={input}
                                    required
                                >
                                    <option value="">Select Term</option>
                                    <option value="First Term">First Term</option>
                                    <option value="Second Term">Second Term</option>
                                    <option value="Third Term">Third Term</option>
                                </select>
                            </div>
                            <div style={{ marginBottom: "15px" }}>
                                <label htmlFor="session" style={{ display: "block", marginBottom: "5px" }}>
                                    Session:
                                </label>
                                <select
                                    id="session"
                                    name="session"
                                    value={form.session}
                                    onChange={handleChange}
                                    style={input}
                                    required
                                >
                                    <option value="">Select Session</option>
                                    <option value="2025/2026">2025/2026</option>
                                    <option value="2026/2027">2026/2027</option>
                                </select>
                            </div>
                            {/* Date of Admission */}

                            <div style={{ marginBottom: "15px" }}>
                                <label htmlFor="dateOfAdmission" style={{ display: "block", marginBottom: "5px" }}>
                                    Date of Admission:
                                </label>
                                <input
                                    type="date"
                                    id="dateOfAdmission"
                                    name="dateOfAdmission"
                                    placeholder="YYYY-MM-DD"
                                    value={form.dateOfAdmission || ""}
                                    onChange={handleChange}
                                    style={input}
                                    required
                                />
                            </div>

                            <div style={{ marginBottom: "15px" }}>
                                <label htmlFor="previousSchool" style={{ display: "block", marginBottom: "5px" }}>
                                    Previous School:
                                </label>
                                <input
                                    type="text"
                                    id="previousSchool"
                                    name="previousSchool"
                                    placeholder="Enter Name of Former School"
                                    value={form.previousSchool}
                                    onChange={handleChange}
                                    style={input}
                                />
                            </div>

                            <div style={{ marginBottom: "15px" }}>
                                <label htmlFor="passport" style={{ display: "block", marginBottom: "5px" }}>
                                    Passport:
                                </label>
                                <input
                                    type="file"
                                    id="passport"
                                    name="passport"
                                    onChange={(e) => setPassport(e.target.files[0])}
                                    style={input}
                                />
                            </div>

                            <button type="submit" style={btn}>
                                Register
                            </button>
                        </form>
                    </div>
                </div >
            </div >

            <AdminFooter />
        </div >
    );
}

// --- Styles remain unchanged ---
const background = {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    padding: "20px",
    overflowY: "auto",
};

const outerContainer = {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "10px",
};

const container = {
    backgroundColor: "rgba(255,255,255,0.97)",
    padding: "25px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
    width: "100%",
};

const marqueeContainer = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "2px dashed #800000",
    borderRadius: "8px",
    marginBottom: "20px",
    padding: "5px 10px",
    backgroundColor: "rgba(255,255,255,0.9)",
    overflow: "hidden",
    flexWrap: "wrap",
};

const marqueeImage = {
    width: "45px",
    height: "45px",
    animation: "moveLeftRight 4s linear infinite alternate",
    marginRight: "10px",
};
const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
};

const popupStyle = {
    backgroundColor: "#fff",
    padding: "25px",
    borderRadius: "10px",
    maxWidth: "500px",
    width: "90%",
    textAlign: "center",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
};

const buttonStyle = {
    backgroundColor: "#800000",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "15px",
    fontWeight: "bold",
};

const marqueeText = { fontWeight: "bold", color: "#800000", flexShrink: 0, textAlign: "center" };
const title = { textAlign: "center", color: "#800000", marginBottom: "20px", fontSize: "22px" };
const formStyle = { display: "flex", flexDirection: "column", gap: "15px" };
const row = { display: "flex", gap: "15px", flexWrap: "wrap" };
const inputWrapper = { position: "relative" };
const iconStyle = { position: "absolute", top: "50%", left: "10px", transform: "translateY(-50%)", color: "#800000" };
const input = { width: "100%", padding: "10px 10px 10px 35px", borderRadius: "5px", border: "1px solid #ccc", outline: "none", fontSize: "15px" };
const btn = { background: "#800000", color: "white", padding: "12px", border: "none", borderRadius: "6px", marginTop: "10px", cursor: "pointer", width: "100%", fontWeight: "bold", fontSize: "16px" };

export default RegisterStudent;
