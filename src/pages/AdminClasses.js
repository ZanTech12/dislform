// src/pages/AdminClasses.jsx
import "../App.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminClasses() {
    const [students, setStudents] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchStudents();
    }, []);

    // Fetch all non-deleted students
    const fetchStudents = async () => {
        try {
            const res = await axios.get("https://datregdatabase-1.onrender.com/api/students");
            setStudents(res.data);
        } catch (err) {
            console.error("❌ Error fetching students:", err);
            alert("Failed to load student list.");
        }
    };

    // Move student to recycle bin
    const handleDelete = async (id, e) => {
        e.stopPropagation(); // prevent row click from triggering navigation
        if (!window.confirm("Are you sure you want to move this student to the bin?")) return;
        try {
            await axios.put(`https://datregdatabase-1.onrender.com/api/students/recycle/${id}`);
            alert("🗑 Student moved to recycle bin successfully!");
            fetchStudents();
        } catch (err) {
            console.error("❌ Error moving to recycle bin:", err);
            alert("❌ Failed to move student to recycle bin.");
        }
    };

    // Navigate to student details page
    const handleRowClick = (id) => {
        navigate(`/admin/student/${id}`);
    };

    return (
        <div style={pageWrapper}>
            <h2 style={title}>📚 Registered Students</h2>

            <div style={tableWrapper}>
                <table style={table}>
                    <thead>
                        <tr style={theadRow}>
                            <th>Passport</th>
                            <th>Admission No.</th>
                            <th>Name</th>
                            <th>Class</th>
                            <th>Section</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={noDataText}>
                                    No students found.
                                </td>
                            </tr>
                        ) : (
                            students.map((st) => (
                                <tr
                                    key={st._id}
                                    style={tableRow}
                                    onClick={() => handleRowClick(st._id)}
                                >
                                    <td>
                                        {st.passport ? (
                                            <img
                                                src={`https://datregdatabase-1.onrender.com/uploads/${st.passport}`}
                                                alt="Passport"
                                                width="50"
                                                height="50"
                                                style={{
                                                    borderRadius: "6px",
                                                    objectFit: "cover",
                                                    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                                                }}
                                            />
                                        ) : (
                                            "N/A"
                                        )}
                                    </td>
                                    <td>{st.admissionNumber}</td>
                                    <td>{`${st.lastName} ${st.firstName}`}</td>
                                    <td>{st.classLevel}</td>
                                    <td>{st.section}</td>
                                    <td>
                                        <button
                                            style={deleteBtn}
                                            onClick={(e) => handleDelete(st._id, e)}
                                        >
                                            🗑 Move to Bin
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// --- Styles ---
const pageWrapper = {
    padding: "20px",
    backgroundColor: "#f9f9f9",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
};

const title = {
    color: "#800000",
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "22px",
};

const tableWrapper = {
    width: "100%",
    maxWidth: "1000px",
    backgroundColor: "white",
    borderRadius: "10px",
    boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
    overflowX: "auto", // horizontal scroll for small screens
};

const table = {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "15px",
    minWidth: "600px",
};

const theadRow = {
    backgroundColor: "#800000",
    color: "white",
    textAlign: "left",
};

const tableRow = {
    cursor: "pointer",
    transition: "background 0.2s ease",
};

const noDataText = {
    textAlign: "center",
    padding: "20px",
    fontStyle: "italic",
    color: "#666",
};

const deleteBtn = {
    background: "red",
    color: "white",
    padding: "6px 10px",
    borderRadius: "5px",
    cursor: "pointer",
    border: "none",
    fontSize: "14px",
    transition: "background 0.2s",
};

deleteBtn[":hover"] = {
    background: "#b30000",
};

// --- Responsive tweaks (for smaller devices) ---
const mediaQuery = window.matchMedia("(max-width: 768px)");
if (mediaQuery.matches) {
    table.fontSize = "13px";
    deleteBtn.padding = "5px 8px";
}

export default AdminClasses;
