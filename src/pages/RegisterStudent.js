// src/pages/RegisterStudent.jsx
import "../App.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import bgImage from "../background.jpg";
import studentImg from "../student.jpg";
import AdminFooter from "../components/AdminFooter";
import { FaUser, FaCalendarAlt, FaFlag, FaSchool, FaEnvelope } from "react-icons/fa";

function RegisterStudent() {
    const initialForm = {
        firstName: "", middleName: "", lastName: "", gender: "", dateOfBirth: "",
        nationality: "", stateOfOrigin: "", lga: "", homeAddress: "", religion: "",
        classLevel: "", section: "", session: "", term: "", previousSchool: "",
        dateOfAdmission: "",
    };

    const [form, setForm] = useState(initialForm);
    const [passport, setPassport] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const fd = new FormData();
            Object.keys(form).forEach((key) => fd.append(key, form[key]));
            if (passport) fd.append("passport", passport);

            await axios.post("https://datregdatabase-1.onrender.com/api/students/register", fd, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            alert("✅ Registration successful!");
            setForm(initialForm);
            setPassport(null);
        } catch (err) {
            alert("❌ Error registering student");
            console.error(err);
        }
    };

    const inputField = (icon, element) => (
        <div style={inputWrapper}>
            <span style={iconStyle}>{icon}</span>
            {element}
        </div>
    );

    return (
        <>
            <div style={background}>
                <div style={outerContainer}>
                    <div style={container}>
                        <div style={marqueeContainer}>
                            <img src={studentImg} alt="Student" style={marqueeImage} />
                            <p style={marqueeText}>
                                ⚠️ Please fill the form carefully with your correct information!
                            </p>
                        </div>

                        <h2 style={title}>📝 Student Registration</h2>

                        <form onSubmit={handleSubmit} style={formStyle}>
                            {/* --- Input Rows --- */}
                            <div style={{ ...row, flexDirection: isMobile ? "column" : "row" }}>
                                {inputField(<FaUser />, <input type="text" name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} required style={input} />)}
                                {inputField(<FaUser />, <input type="text" name="middleName" placeholder="Middle Name" value={form.middleName} onChange={handleChange} style={input} />)}
                            </div>

                            <div style={{ ...row, flexDirection: isMobile ? "column" : "row" }}>
                                {inputField(<FaUser />, <input type="text" name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} required style={input} />)}
                                {inputField(<FaUser />, (
                                    <select name="gender" value={form.gender} onChange={handleChange} required style={input}>
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                ))}
                            </div>

                            <div style={{ ...row, flexDirection: isMobile ? "column" : "row" }}>
                                {inputField(<FaCalendarAlt />, <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} style={input} />)}
                                {inputField(<FaFlag />, <input type="text" name="nationality" placeholder="Nationality" value={form.nationality} onChange={handleChange} style={input} />)}
                            </div>

                            <div style={{ ...row, flexDirection: isMobile ? "column" : "row" }}>
                                {inputField(<FaFlag />, <input type="text" name="stateOfOrigin" placeholder="State of Origin" value={form.stateOfOrigin} onChange={handleChange} style={input} />)}
                                {inputField(<FaFlag />, <input type="text" name="lga" placeholder="Local Government Area" value={form.lga} onChange={handleChange} style={input} />)}
                            </div>

                            {inputField(<FaEnvelope />, <input type="text" name="homeAddress" placeholder="Home Address" value={form.homeAddress} onChange={handleChange} style={input} />)}

                            <div style={{ ...row, flexDirection: isMobile ? "column" : "row" }}>
                                {inputField(<FaSchool />, (
                                    <select name="religion" value={form.religion} onChange={handleChange} style={input}>
                                        <option value="">Select Religion</option>
                                        <option value="Christianity">Christianity</option>
                                        <option value="Islam">Islam</option>
                                        <option value="Other">Other</option>
                                    </select>
                                ))}
                                {inputField(<FaSchool />, (
                                    <select name="classLevel" value={form.classLevel} onChange={handleChange} style={input} required>
                                        <option value="">Select Class</option>
                                        <option value="KG 1">KG 1</option>
                                        <option value="KG 2">KG 2</option>
                                        <option value="Nursery 1">Nursery 1</option>
                                        <option value="Nursery 2">Nursery 2</option>
                                        <option value="Basic 1">Basic 1</option>
                                        <option value="Basic 2">Basic 2</option>
                                        <option value="Basic 3">Basic 3</option>
                                        <option value="Basic 4">Basic 4</option>
                                        <option value="Basic 5">Basic 5</option>
                                        <option value="JSS 1">JSS 1</option>
                                        <option value="JSS 2">JSS 2</option>
                                        <option value="JSS 3">JSS 3</option>
                                        <option value="SSS 1">SSS 1</option>
                                        <option value="SSS 2">SSS 2</option>
                                        <option value="SSS 3">SSS 3</option>
                                    </select>
                                ))}
                            </div>

                            <div style={{ ...row, flexDirection: isMobile ? "column" : "row" }}>
                                {inputField(<FaSchool />, <input type="text" name="section" placeholder="Section" value={form.section} onChange={handleChange} style={input} />)}
                                {inputField(<FaSchool />, (
                                    <select name="session" value={form.session} onChange={handleChange} style={input}>
                                        <option value="">Select Session</option>
                                        <option value="2025/2026">2025/2026</option>
                                        <option value="2024/2025">2024/2025</option>
                                    </select>
                                ))}
                            </div>

                            <div style={{ ...row, flexDirection: isMobile ? "column" : "row" }}>
                                {inputField(<FaSchool />, (
                                    <select name="term" value={form.term} onChange={handleChange} style={input}>
                                        <option value="">Select Term</option>
                                        <option value="First Term">First Term</option>
                                        <option value="Second Term">Second Term</option>
                                        <option value="Third Term">Third Term</option>
                                    </select>
                                ))}
                                {inputField(<FaSchool />, <input type="text" name="previousSchool" placeholder="Previous School" value={form.previousSchool} onChange={handleChange} style={input} />)}
                            </div>

                            <div style={{ ...row, flexDirection: isMobile ? "column" : "row" }}>
                                {inputField(<FaCalendarAlt />, <input type="date" name="dateOfAdmission" value={form.dateOfAdmission} onChange={handleChange} style={input} />)}
                                {inputField(<FaUser />, <input type="file" onChange={(e) => setPassport(e.target.files[0])} style={input} />)}
                            </div>

                            <button type="submit" style={btn}>Register</button>
                        </form>
                    </div>
                </div>
            </div>

            <AdminFooter />
        </>
    );
}

// --- Styles ---
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
    maxWidth: "750px",
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

const marqueeText = {
    fontWeight: "bold",
    color: "#800000",
    whiteSpace: "nowrap",
    flexShrink: 0,
};

const title = {
    textAlign: "center",
    color: "#800000",
    marginBottom: "20px",
    fontSize: "22px",
};

const formStyle = { display: "flex", flexDirection: "column", gap: "15px" };
const row = { display: "flex", gap: "15px", flexWrap: "wrap" };
const inputWrapper = { position: "relative", flex: "1" };
const iconStyle = { position: "absolute", top: "50%", left: "10px", transform: "translateY(-50%)", color: "#800000" };
const input = {
    width: "100%",
    minHeight: "45px",
    padding: "10px 10px 10px 35px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    outline: "none",
    fontSize: "15px",
    boxSizing: "border-box",
};
const btn = { background: "#800000", color: "white", padding: "12px", border: "none", borderRadius: "6px", marginTop: "10px", cursor: "pointer", width: "100%", fontWeight: "bold", fontSize: "16px" };

export default RegisterStudent;
