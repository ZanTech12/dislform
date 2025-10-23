import "../App.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaUser, FaEye } from "react-icons/fa";

function AdminDashboard() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const res = await axios.get("https://datregdatabase-1.onrender.com/api/students");
            setStudents(res.data);
        } catch (err) {
            console.error("❌ Error fetching students:", err);
            alert("Failed to fetch students.");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (id) => {
        navigate(`/admin/edit-student/${id}`);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this student?")) return;
        try {
            await axios.put(`https://datregdatabase-1.onrender.com/api/students/recycle/${id}`);
            alert("🗑️ Student moved to Recycle Bin.");
            fetchStudents();
        } catch (err) {
            console.error("❌ Error deleting student:", err);
            alert("Failed to delete student.");
        }
    };

    if (loading) return <p>Loading students...</p>;

    return (
        <div style={pageContainer}>
            <h2 style={pageTitle}>🎓 All Registered Students</h2>

            {students.length === 0 ? (
                <p>No students found.</p>
            ) : (
                <div style={tableWrapper}>
                    <table style={table}>
                        <thead>
                            <tr style={tableHeader}>
                                <th>#</th>
                                <th>Passport</th>
                                <th>Name</th>
                                <th>Gender</th>
                                <th>Class</th>
                                <th>Admission No</th>
                                <th>Phone</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student, index) => (
                                <tr key={student._id} style={tableRow}>
                                    <td>{index + 1}</td>
                                    <td>
                                        {student.passport ? (
                                            <img
                                                src={`https://datregdatabase-1.onrender.com/uploads/${student.passport}`}
                                                alt="Passport"
                                                style={passportImg}
                                            />
                                        ) : (
                                            <FaUser style={{ color: "#800000" }} />
                                        )}
                                    </td>
                                    <td>{`${student.firstName} ${student.middleName || ""} ${student.lastName}`}</td>
                                    <td>{student.gender}</td>
                                    <td>{student.classLevel}</td>
                                    <td>{student.admissionNumber}</td>
                                    <td>{student.phoneNumber || "N/A"}</td>
                                    <td>
                                        <button style={viewBtn} onClick={() => navigate(`/admin/view-student/${student._id}`)}>
                                            <FaEye />
                                        </button>
                                        <button style={editBtn} onClick={() => handleEdit(student._id)}>
                                            <FaEdit />
                                        </button>
                                        <button style={deleteBtn} onClick={() => handleDelete(student._id)}>
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

// --- Styles ---
const pageContainer = {
    padding: "30px",
    backgroundColor: "#f9f9f9",
    minHeight: "100vh",
};

const pageTitle = {
    textAlign: "center",
    color: "#800000",
    marginBottom: "25px",
    fontSize: "24px",
};

const tableWrapper = {
    overflowX: "auto",
    backgroundColor: "white",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
};

const table = {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "15px",
};

const tableHeader = {
    backgroundColor: "#800000",
    color: "white",
};

const tableRow = {
    borderBottom: "1px solid #ddd",
    textAlign: "center",
};

const passportImg = {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    objectFit: "cover",
};

const viewBtn = {
    background: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    padding: "6px 8px",
    margin: "0 3px",
    cursor: "pointer",
};

const editBtn = {
    background: "orange",
    color: "white",
    border: "none",
    borderRadius: "4px",
    padding: "6px 8px",
    margin: "0 3px",
    cursor: "pointer",
};

const deleteBtn = {
    background: "red",
    color: "white",
    border: "none",
    borderRadius: "4px",
    padding: "6px 8px",
    margin: "0 3px",
    cursor: "pointer",
};

export default AdminDashboard;
