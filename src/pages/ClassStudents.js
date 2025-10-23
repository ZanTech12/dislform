import "../App.css"
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function ClassStudents() {
    const { classLevel } = useParams();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingStudent, setEditingStudent] = useState(null);
    const [form, setForm] = useState({
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
        term: "",
        previousSchool: "",
        dateOfAdmission: "",
        admissionNumber: "",
    });
    const [passport, setPassport] = useState(null);

    useEffect(() => {
        fetchStudents();
    }, [classLevel]);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const res = await axios.get("https://datregdatabase-1.onrender.com/api/students");
            const classStudents = res.data.filter(
                (student) => student.classLevel === classLevel
            );
            setStudents(classStudents);
        } catch (err) {
            console.error("❌ Error fetching students:", err);
            alert("Failed to load students for this class.");
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (student) => {
        setEditingStudent(student);
        setForm({
            firstName: student.firstName || "",
            middleName: student.middleName || "",
            lastName: student.lastName || "",
            gender: student.gender || "",
            dateOfBirth: student.dateOfBirth || "",
            nationality: student.nationality || "",
            stateOfOrigin: student.stateOfOrigin || "",
            lga: student.lga || "",
            homeAddress: student.homeAddress || "",
            religion: student.religion || "",
            classLevel: student.classLevel || "",
            section: student.section || "",
            session: student.session || "",
            term: student.term || "",
            previousSchool: student.previousSchool || "",
            dateOfAdmission: student.dateOfAdmission || "",
            admissionNumber: student.admissionNumber || "",
        });
        setPassport(null);
    };

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const fd = new FormData();
            Object.keys(form).forEach((key) => fd.append(key, form[key]));
            if (passport) fd.append("passport", passport);

            await axios.put(
                `https://datregdatabase-1.onrender.com/api/students/${editingStudent._id}`,
                fd,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            alert("✅ Student updated successfully!");
            setEditingStudent(null);
            fetchStudents();
        } catch (err) {
            console.error("❌ Error updating student:", err);
            alert("Failed to update student");
        }
    };

    const handleCancel = () => setEditingStudent(null);

    return (
        <div style={{ padding: 20 }}>
            <h2>👨‍🎓 Students in {classLevel}</h2>
            {loading ? (
                <p>Loading students...</p>
            ) : students.length === 0 ? (
                <p>No students registered in this class.</p>
            ) : (
                <div style={tableWrapper}>
                    <table style={table}>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Full Name</th>
                                <th>Admission Number</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((st, idx) => (
                                <tr key={st._id}>
                                    <td>{idx + 1}</td>
                                    <td>
                                        {[st.firstName, st.middleName, st.lastName]
                                            .filter(Boolean)
                                            .join(" ")}
                                    </td>
                                    <td>{st.admissionNumber || "N/A"}</td>
                                    <td>
                                        <button
                                            style={editButton}
                                            onClick={() => handleEditClick(st)}
                                        >
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {editingStudent && (
                <div style={modalOverlay}>
                    <div style={modalContent}>
                        <h3>Edit Student</h3>
                        <form
                            onSubmit={handleSubmit}
                            style={formStyle}
                            className="responsive-form"
                        >
                            {/* Admission Number (read-only) */}
                            <div>
                                <label style={label}>Admission Number:</label>
                                <input
                                    type="text"
                                    name="admissionNumber"
                                    value={form.admissionNumber}
                                    readOnly
                                    style={{ ...input, backgroundColor: "#f4f4f4" }}
                                />
                            </div>

                            {/* Name Fields */}
                            <input
                                type="text"
                                name="firstName"
                                placeholder="First Name"
                                value={form.firstName}
                                onChange={handleChange}
                                required
                                style={input}
                            />
                            <input
                                type="text"
                                name="middleName"
                                placeholder="Middle Name"
                                value={form.middleName}
                                onChange={handleChange}
                                style={input}
                            />
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Last Name"
                                value={form.lastName}
                                onChange={handleChange}
                                required
                                style={input}
                            />

                            {/* Gender & DOB */}
                            <div>
                                <label style={label}>Gender:</label>
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
                            </div>
                            <div>
                                <label style={label}>Date of Birth:</label>
                                <input
                                    type="date"
                                    name="dateOfBirth"
                                    value={form.dateOfBirth}
                                    onChange={handleChange}
                                    style={input}
                                />
                            </div>

                            {/* Nationality, State, LGA, Address */}
                            <input
                                type="text"
                                name="nationality"
                                placeholder="Nationality"
                                value={form.nationality}
                                onChange={handleChange}
                                style={input}
                            />
                            <input
                                type="text"
                                name="stateOfOrigin"
                                placeholder="State of Origin"
                                value={form.stateOfOrigin}
                                onChange={handleChange}
                                style={input}
                            />
                            <input
                                type="text"
                                name="lga"
                                placeholder="Local Government Area"
                                value={form.lga}
                                onChange={handleChange}
                                style={input}
                            />
                            <input
                                type="text"
                                name="homeAddress"
                                placeholder="Home Address"
                                value={form.homeAddress}
                                onChange={handleChange}
                                style={input}
                            />

                            {/* Other Fields */}
                            <div>
                                <label style={label}>Religion:</label>
                                <select
                                    name="religion"
                                    value={form.religion}
                                    onChange={handleChange}
                                    style={input}
                                >
                                    <option value="">Select Religion</option>
                                    <option value="Christianity">Christianity</option>
                                    <option value="Islam">Islam</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label style={label}>Class Level:</label>
                                <select
                                    name="classLevel"
                                    value={form.classLevel}
                                    onChange={handleChange}
                                    style={input}
                                >
                                    <option value="">Select Class</option>
                                    <option value="Reception">Reception</option>
                                    <option value="JSS 1">JSS 1</option>
                                    <option value="JSS 2">JSS 2</option>
                                    <option value="JSS 3">JSS 3</option>
                                    <option value="SSS 1">SSS 1</option>
                                    <option value="SSS 2">SSS 2</option>
                                    <option value="SSS 3">SSS 3</option>
                                </select>
                            </div>

                            {/* Remaining Fields */}
                            <input
                                type="text"
                                name="section"
                                placeholder="Section (e.g. A, B)"
                                value={form.section}
                                onChange={handleChange}
                                style={input}
                            />
                            <input
                                type="text"
                                name="session"
                                placeholder="Session (e.g. 2025/2026)"
                                value={form.session}
                                onChange={handleChange}
                                style={input}
                            />
                            <input
                                type="text"
                                name="term"
                                placeholder="Term (e.g. First Term)"
                                value={form.term}
                                onChange={handleChange}
                                style={input}
                            />
                            <input
                                type="text"
                                name="previousSchool"
                                placeholder="Previous School"
                                value={form.previousSchool}
                                onChange={handleChange}
                                style={input}
                            />
                            <input
                                type="date"
                                name="dateOfAdmission"
                                value={form.dateOfAdmission}
                                onChange={handleChange}
                                style={input}
                            />

                            <div>
                                <label style={label}>Upload Passport:</label>
                                <input
                                    type="file"
                                    onChange={(e) => setPassport(e.target.files[0])}
                                    style={input}
                                />
                            </div>

                            {/* Buttons */}
                            <div
                                style={{
                                    display: "flex",
                                    gap: "10px",
                                    flexDirection: "column",
                                    marginTop: "10px",
                                }}
                            >
                                <button type="submit" style={editButton}>
                                    Save
                                </button>
                                <button
                                    type="button"
                                    style={cancelButton}
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

// --- Styles ---
const tableWrapper = { overflowX: "auto", width: "100%" };
const table = {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
    minWidth: "400px",
};
const editButton = {
    padding: "10px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
};
const cancelButton = {
    padding: "10px",
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
};
const modalOverlay = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "10px",
    zIndex: 1000,
};
const modalContent = {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    width: "100%",
    maxWidth: "600px",
    maxHeight: "90vh",
    overflowY: "auto",
    boxSizing: "border-box",
};
const formStyle = {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "10px",
    width: "100%",
};
const input = {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    width: "100%",
    boxSizing: "border-box",
};
const label = { fontWeight: "bold", marginTop: "10px" };

export default ClassStudents;
