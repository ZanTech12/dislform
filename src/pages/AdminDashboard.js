import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
    const allClasses = ["JSS 1", "JSS 2", "JSS 3", "SSS 1", "SSS 2", "SSS 3"];
    const [classCounts, setClassCounts] = useState({});
    const [totalStudents, setTotalStudents] = useState(0); // total students
    const navigate = useNavigate();

    useEffect(() => {
        fetchClassCounts();
    }, []);

    const fetchClassCounts = async () => {
        try {
            const res = await axios.get("https://datregdatabase-1.onrender.com/api/students");
            const students = res.data;

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

    return (
        <div>
            <h2>📊 Dashboard - Students Count by Class</h2>
            <p style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "20px" }}>
                Total Students Registered: {totalStudents}
            </p>

            <div style={grid}>
                {allClasses.map((cls) => (
                    <div key={cls} style={card} onClick={() => handleCardClick(cls)}>
                        <h3>{cls}</h3>
                        <p style={countStyle}>{classCounts[cls] || 0} Students</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

const grid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "20px",
    marginTop: "20px",
};

const card = {
    background: "#007bff",
    color: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    textAlign: "center",
    cursor: "pointer",
    transition: "transform 0.2s",
};

const countStyle = {
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginTop: "10px",
};

export default AdminDashboard;
