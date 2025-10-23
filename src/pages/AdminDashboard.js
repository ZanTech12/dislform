// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
    const allClasses = [
        "Reception", // Added Reception here
        "KG 1", "KG 2",
        "Nursery 1", "Nursery 2",
        "Basic 1", "Basic 2", "Basic 3", "Basic 4", "Basic 5",
        "JSS 1", "JSS 2", "JSS 3",
        "SSS 1", "SSS 2", "SSS 3"
    ];

    const [classCounts, setClassCounts] = useState({});
    const [totalStudents, setTotalStudents] = useState(0);
    const [genderData, setGenderData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchClassCounts();
    }, []);

    const fetchClassCounts = async () => {
        try {
            const res = await axios.get("https://datregdatabase-1.onrender.com/api/students");
            const students = res.data;

            // Initialize counts
            const counts = {};
            allClasses.forEach((cls) => (counts[cls] = 0));

            // Count students by class
            students.forEach((student) => {
                const cls = student.classLevel;
                if (cls && counts[cls] !== undefined) counts[cls] += 1;
            });

            // Count students by gender
            const maleCount = students.filter((s) => s.gender === "Male").length;
            const femaleCount = students.filter((s) => s.gender === "Female").length;
            const genderStats = [
                { name: "Male", value: maleCount },
                { name: "Female", value: femaleCount },
            ];

            setClassCounts(counts);
            setTotalStudents(students.length);
            setGenderData(genderStats);
        } catch (err) {
            console.error("❌ Error fetching students:", err);
            alert("Failed to fetch student data.");
        }
    };

    const handleCardClick = (cls) => {
        navigate(`/admin/class/${cls}`);
    };

    const getCardColor = (cls) => {
        if (cls === "Reception") return "#6f42c1"; // Purple for Reception
        if (cls.startsWith("KG") || cls.startsWith("Nursery")) return "#28a745"; // Green
        if (cls.startsWith("Basic")) return "#17a2b8"; // Teal
        if (cls.startsWith("JSS")) return "#ffc107"; // Yellow
        if (cls.startsWith("SSS")) return "#dc3545"; // Red
        return "#007bff"; // Blue fallback
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2 style={{ fontSize: "1.8rem", marginBottom: "10px" }}>📊 Admin Dashboard</h2>
            <p style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "25px" }}>
                Total Students Registered: {totalStudents}
            </p>

            {/* Gender Counts Only */}
            <div style={chartContainer}>
                <h3 style={{ marginBottom: "10px" }}>👫 Gender Distribution</h3>
                <p style={{ textAlign: "center", fontWeight: "600", marginBottom: "0" }}>
                    👦 Male: {genderData.find(g => g.name === "Male")?.value || 0} &nbsp;&nbsp; | &nbsp;&nbsp; 👧 Female: {genderData.find(g => g.name === "Female")?.value || 0}
                </p>
            </div>

            {/* Class Counts */}
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

// Layout styles
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

const chartContainer = {
    background: "#f8f9fa",
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    maxWidth: "400px",
    marginLeft: "auto",
    marginRight: "auto",
};

export default AdminDashboard;
