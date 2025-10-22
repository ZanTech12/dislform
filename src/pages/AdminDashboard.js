// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
    const allClasses = [
        "KG 1", "KG 2",
        "Nursery 1", "Nursery 2",
        "Basic 1", "Basic 2", "Basic 3", "Basic 4", "Basic 5",
        "JSS 1", "JSS 2", "JSS 3",
        "SSS 1", "SSS 2", "SSS 3"
    ];

    const [classCounts, setClassCounts] = useState({});
    const [totalStudents, setTotalStudents] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        fetchClassCounts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchClassCounts = async () => {
        try {
            const res = await axios.get("https://datregdatabase-1.onrender.com/api/students");
            const students = res.data;

            // Count students per class
            const counts = {};
            allClasses.forEach((cls) => (counts[cls] = 0));
            students.forEach((student) => {
                const cls = student.classLevel;
                if (cls && counts[cls] !== undefined) counts[cls] += 1;
            });

            setClassCounts(counts);
            setTotalStudents(students.length);
        } catch (err) {
            console.error("❌ Error fetching students:", err);
            alert("Failed to fetch student data.");
        }
    };

    const handleCardClick = (cls) => {
        navigate(`/admin/class/${cls}`);
    };

    const getCardColor = (cls) => {
        if (cls.startsWith("KG") || cls.startsWith("Nursery")) return "#28a745";
        if (cls.startsWith("Basic")) return "#17a2b8";
        if (cls.startsWith("JSS")) return "#ffc107";
        if (cls.startsWith("SSS")) return "#dc3545";
        return "#007bff";
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2 style={{ fontSize: "1.8rem", marginBottom: "10px" }}>📊 Admin Dashboard</h2>
            <p style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "25px" }}>
                Total Students Registered: {totalStudents}
            </p>

            {/* Class Cards */}
            <div style={grid}>
                {allClasses.map((cls) => (
                    <div
                        key={cls}
                        style={{ ...card, background: getCardColor(cls) }}
                        onClick={() => handleCardClick(cls)}
                    >
                        <h3 style={{ margin: 0 }}>{cls}</h3>
                        <p style={countStyle}>{classCounts[cls] || 0} Students</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

const grid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: "20px",
    marginTop: "20px",
};

const card = {
    color: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
    textAlign: "center",
    cursor: "pointer",
    transition: "transform 0.2s, box-shadow 0.2s",
};

const countStyle = {
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginTop: "10px",
};

export default AdminDashboard;
