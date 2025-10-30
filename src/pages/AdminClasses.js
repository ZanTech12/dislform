import "../App.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminClasses() {
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchStudents();
    }, []);

    // Fetch all non-deleted students
    const fetchStudents = async () => {
        try {
            const res = await axios.get("https://datforte.duckdns.org/api/students");
            setStudents(res.data);
            setFilteredStudents(res.data);
        } catch (err) {
            console.error("❌ Error fetching students:", err);
            alert("Failed to load student list.");
        }
    };

    // Filter students by name
    const handleSearch = () => {
        if (!searchTerm.trim()) {
            setFilteredStudents(students);
            return;
        }
        const term = searchTerm.toLowerCase();
        const filtered = students.filter((st) =>
            [st.firstName, st.lastName]
                .filter(Boolean)
                .some((namePart) => namePart.toLowerCase().includes(term))
        );
        setFilteredStudents(filtered);
    };

    // Optional: run search on Enter key in input
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    // Move student to recycle bin
    const handleDelete = async (id, e) => {
        e.stopPropagation(); // prevent row click from triggering navigation
        if (!window.confirm("Are you sure you want to move this student to the bin?")) return;
        try {
            await axios.put(`https://datforte.duckdns.org/api/students/recycle/${id}`);
            alert("🗑 Student moved to recycle bin successfully!");
            fetchStudents();
            setSearchTerm("");
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

            {/* Search bar */}

            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "10px",
                    width: "100%",
                    maxWidth: "600px",
                    margin: "0 auto",
                    padding: "10px",
                }}
            >
                <input
                    type="text"
                    placeholder="Search by first or last name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyDown}
                    style={{
                        flex: "1",
                        minWidth: "200px",
                        width: "100%",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                        fontSize: "16px",
                        boxSizing: "border-box",
                    }}
                />
                <button
                    onClick={handleSearch}
                    style={{
                        padding: "12px 18px",
                        borderRadius: "8px",
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "16px",
                        flexShrink: "0",
                    }}
                >
                    🔍 Search
                </button>
            </div>


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
                        {filteredStudents.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={noDataText}>
                                    No students found.
                                </td>
                            </tr>
                        ) : (
                            filteredStudents.map((st) => (
                                <tr
                                    key={st._id}
                                    className="table-row"
                                    style={tableRow}
                                    onClick={() => handleRowClick(st._id)}
                                >
                                    <td>
                                        {st.passport ? (
                                            <img
                                                src={`https://datforte.duckdns.org/uploads/${st.passport}`}
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

const searchWrapper = {
    marginBottom: "15px",
    display: "flex",
    gap: "10px",
    width: "100%",
    maxWidth: "600px",
};

const searchInput = {
    flex: 1,
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "16px",
    minWidth: "300px",
};

const searchButton = {
    padding: "8px 16px",
    backgroundColor: "#800000",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
};

const tableWrapper = {
    width: "100%",
    maxWidth: "1000px",
    backgroundColor: "white",
    borderRadius: "10px",
    boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
    overflowX: "auto",
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
    userSelect: "none",
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

export default AdminClasses;
