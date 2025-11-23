import React, { useEffect, useState } from "react";
import axios from "axios";


function AdminRecycleBin() {
    const [deletedStudents, setDeletedStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    // === Fetch deleted students ===
    const fetchDeleted = async () => {
        try {
            setLoading(true);
            const res = await axios.get("https://zannu.duckdns.org/api/students/recyclebin");
            setDeletedStudents(res.data);
        } catch (err) {
            console.error("Error fetching deleted students:", err);
            alert("❌ Failed to load recycle bin data. Please check backend.");
        } finally {
            setLoading(false);
        }
    };

    // === Restore student ===
    const handleRestore = async (id) => {
        if (!window.confirm("Are you sure you want to restore this student?")) return;
        try {
            await axios.put(`https://zannu.duckdns.org/api/students/restore/${id}`);
            alert("✅ Student restored successfully!");
            fetchDeleted();
        } catch (err) {
            console.error("Error restoring student:", err);
            alert("❌ Failed to restore student.");
        }
    };

    // === Permanently delete student ===
    const handlePermanentDelete = async (id) => {
        if (!window.confirm("⚠️ Are you sure you want to permanently delete this student? This action cannot be undone.")) return;
        try {
            await axios.delete(`https://zannu.duckdns.org/api/students/permanent/${id}`);
            alert("✅ Student permanently deleted!");
            fetchDeleted();
        } catch (err) {
            console.error("Error permanently deleting student:", err);
            alert("❌ Failed to permanently delete student.");
        }
    };

    useEffect(() => {
        fetchDeleted();
    }, []);

    return (
        <>

            <div style={container}>
                <h2>🗑️ Deleted Students (Recycle Bin)</h2>

                {loading ? (
                    <p>Loading deleted students...</p>
                ) : deletedStudents.length === 0 ? (
                    <p>No deleted students found.</p>
                ) : (
                    <div style={{ overflowX: "auto" }}>
                        <table style={table}>
                            <thead>
                                <tr>
                                    <th>Passport</th>
                                    <th>Full Name</th>
                                    <th>Gender</th>
                                    <th>Class</th>
                                    <th>Section</th>
                                    <th>Session</th>
                                    <th>Term</th>
                                    <th>Date of Admission</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {deletedStudents.map((student) => {
                                    const fullName = [student.firstName, student.middleName, student.lastName]
                                        .filter(Boolean)
                                        .join(" ");
                                    return (
                                        <tr key={student._id}>
                                            <td>
                                                {student.passport ? (
                                                    <img
                                                        src={`https://zannu.duckdns.org/uploads/${student.passport}`}
                                                        alt="Passport"
                                                        style={passportImg}
                                                    />
                                                ) : (
                                                    "No Image"
                                                )}
                                            </td>
                                            <td>{fullName}</td>
                                            <td>{student.gender}</td>
                                            <td>{student.classLevel}</td>
                                            <td>{student.section}</td>
                                            <td>{student.session}</td>
                                            <td>{student.term}</td>
                                            <td>{student.dateOfAdmission?.slice(0, 10)}</td>
                                            <td>
                                                <button
                                                    onClick={() => handleRestore(student._id)}
                                                    style={restoreBtn}
                                                >
                                                    Restore
                                                </button>
                                                <button
                                                    onClick={() => handlePermanentDelete(student._id)}
                                                    style={deleteBtn}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
}

// === Styles ===
const container = { padding: "20px" };
const table = {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
    minWidth: "800px", // ensures responsive scroll on smaller screens
};
const passportImg = { width: "50px", height: "50px", borderRadius: "50%" };
const restoreBtn = {
    background: "green",
    color: "white",
    border: "none",
    padding: "6px 10px",
    borderRadius: "5px",
    cursor: "pointer",
    marginRight: "5px",
};
const deleteBtn = {
    ...restoreBtn,
    background: "red",
};

export default AdminRecycleBin;
