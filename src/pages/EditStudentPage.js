import "../App.css"
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";


function EditStudentPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [student, setStudent] = useState(null);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        fetchStudent();
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

            await axios.put(`https://datregdatabase-1.onrender.com/api/students/edit/${id}`, data, { headers: { "Content-Type": "multipart/form-data" } });
            alert("✅ Student updated successfully!");
            navigate("/admin/students");
        } catch (err) {
            console.error("❌ Error updating student:", err);
            alert("Failed to update student.");
        }
    };

    if (!student) return <p>Loading student...</p>;

    return (
        <>

            <div style={{ padding: "20px" }}>
                <h2>✏️ Edit Student: {student.firstName} {student.lastName}</h2>
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "400px" }}>
                    <input type="text" name="firstName" value={formData.firstName || ""} onChange={handleChange} placeholder="First Name" required />
                    <input type="text" name="middleName" value={formData.middleName || ""} onChange={handleChange} placeholder="Middle Name" />
                    <input type="text" name="lastName" value={formData.lastName || ""} onChange={handleChange} placeholder="Last Name" required />
                    <input type="text" name="admissionNumber" value={formData.admissionNumber || ""} onChange={handleChange} placeholder="Admission Number" required />
                    <input type="text" name="classLevel" value={formData.classLevel || ""} onChange={handleChange} placeholder="Class" required />
                    <input type="text" name="section" value={formData.section || ""} onChange={handleChange} placeholder="Section" />
                    <input type="text" name="session" value={formData.session || ""} onChange={handleChange} placeholder="Session" />
                    <input type="text" name="term" value={formData.term || ""} onChange={handleChange} placeholder="Term" />
                    <input type="date" name="dateOfAdmission" value={formData.dateOfAdmission?.slice(0, 10) || ""} onChange={handleChange} />
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
        </>
    );
}

const saveBtn = { background: "green", color: "white", padding: "8px 15px", borderRadius: "5px", border: "none", cursor: "pointer" };

export default EditStudentPage;
