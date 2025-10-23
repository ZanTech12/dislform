// src/pages/EditStudentPage.jsx
import "../App.css";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUser, FaCalendarAlt, FaSchool, FaPhone } from "react-icons/fa";

function EditStudentPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [student, setStudent] = useState(null);
    const [formData, setFormData] = useState({});
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        fetchStudent();
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const fetchStudent = async () => {
        try {
            const res = await axios.get(`https://datregdatabase-1.onrender.com/api/students/${id}`);
            setStudent(res.data);
            setFormData(res.data);
        } catch (err) {
            console.error("❌ Error fetching student:", err);
            alert("Failed to load student.");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, passportFile: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            for (let key in formData) {
                if (key === "passportFile" && formData[key]) {
                    data.append("passport", formData[key]);
                } else if (formData[key] !== undefined) {
                    data.append(key, formData[key]);
                }
            }

            await axios.put(`https://datregdatabase-1.onrender.com/api/students/${id}`, data, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            alert("✅ Student updated successfully!");
            navigate("/admin/students");
        } catch (err) {
            console.error("❌ Error updating student:", err);
            alert("Failed to update student.");
        }
    };

    if (!student) return <p>Loading student...</p>;

    const inputField = (icon, element) => (
        <div style={{ ...inputWrapper, flex: isMobile ? "100%" : "1" }}>
            <span style={iconStyle}>{icon}</span>
            {element}
        </div>
    );

    return (
        <div style={background}>
            <div style={outerContainer}>
                <div style={{ ...container, maxWidth: isMobile ? "90%" : "600px" }}>
                    <h2 style={title}>✏️ Edit Student: {student.firstName} {student.lastName}</h2>
                    <form onSubmit={handleSubmit} style={formStyle}>
                        <div style={{ ...row, flexDirection: isMobile ? "column" : "row" }}>
                            {inputField(<FaUser />, <input type="text" name="firstName" placeholder="First Name" value={formData.firstName || ""} onChange={handleChange} required style={input} />)}
                            {inputField(<FaUser />, <input type="text" name="middleName" placeholder="Middle Name" value={formData.middleName || ""} onChange={handleChange} style={input} />)}
                        </div>

                        <div style={{ ...row, flexDirection: isMobile ? "column" : "row" }}>
                            {inputField(<FaUser />, <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName || ""} onChange={handleChange} required style={input} />)}
                            {inputField(<FaUser />, <input type="text" name="admissionNumber" placeholder="Admission Number" value={formData.admissionNumber || ""} onChange={handleChange} required style={input} />)}
                        </div>

                        <div style={{ ...row, flexDirection: isMobile ? "column" : "row" }}>
                            {inputField(<FaSchool />, (
                                <select name="classLevel" value={formData.classLevel || ""} onChange={handleChange} style={input} required>
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
                            {inputField(<FaSchool />, <input type="text" name="section" placeholder="Section" value={formData.section || ""} onChange={handleChange} style={input} />)}
                        </div>

                        <div style={{ ...row, flexDirection: isMobile ? "column" : "row" }}>
                            {inputField(<FaSchool />, <input type="text" name="session" placeholder="Session" value={formData.session || ""} onChange={handleChange} style={input} />)}
                            {inputField(<FaSchool />, <input type="text" name="term" placeholder="Term" value={formData.term || ""} onChange={handleChange} style={input} />)}
                        </div>

                        <div style={{ ...row, flexDirection: isMobile ? "column" : "row" }}>
                            {inputField(<FaCalendarAlt />, <input type="date" name="dateOfAdmission" value={formData.dateOfAdmission?.slice(0, 10) || ""} onChange={handleChange} style={input} />)}
                            {inputField(<FaPhone />, <input type="tel" name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber || ""} onChange={handleChange} style={input} />)}
                        </div>

                        <div>
                            <label>Passport Image: </label>
                            <input type="file" accept="image/*" onChange={handleFileChange} />
                            {student.passport && !formData.passportFile && (
                                <img src={`https://datregdatabase-1.onrender.com/uploads/${student.passport}`} alt="Passport" width="50" style={{ marginLeft: "10px" }} />
                            )}
                        </div>

                        <button type="submit" style={saveBtn}>Save Changes</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

// --- Styles ---
const background = { minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" };
const outerContainer = { width: "100%", display: "flex", justifyContent: "center", alignItems: "center" };
const container = { backgroundColor: "rgba(255,255,255,0.97)", padding: "25px", borderRadius: "10px", boxShadow: "0 4px 10px rgba(0,0,0,0.2)", width: "100%" };
const title = { textAlign: "center", color: "#800000", marginBottom: "20px", fontSize: "22px" };
const formStyle = { display: "flex", flexDirection: "column", gap: "15px" };
const row = { display: "flex", gap: "15px", flexWrap: "wrap" };
const inputWrapper = { position: "relative" };
const iconStyle = { position: "absolute", top: "50%", left: "10px", transform: "translateY(-50%)", color: "#800000" };
const input = { width: "100%", padding: "10px 10px 10px 35px", borderRadius: "5px", border: "1px solid #ccc", outline: "none", fontSize: "15px" };
const saveBtn = { background: "green", color: "white", padding: "12px", borderRadius: "6px", border: "none", cursor: "pointer", width: "100%", fontWeight: "bold", fontSize: "16px" };

export default EditStudentPage;
