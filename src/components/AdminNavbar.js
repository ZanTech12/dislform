// src/components/AdminNavbar.jsx
import "../App.css";
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../logo DAT.png"; // Your school logo

function AdminNavbar() {
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    const toggleMenu = () => setMenuOpen(!menuOpen);

    // ✅ Detect window resize dynamically
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <nav style={navbar}>
            {/* --- Logo and School Info --- */}
            <div style={logoContainer}>
                <img src={logo} alt="School Logo" style={logoStyle} />
                <div style={schoolInfo}>
                    <h3 style={schoolName}>DATFORTE INT'L SCHOOL</h3>
                    <p style={companyName}>STUDENT INFORMATION SYSTEM</p>
                </div>
            </div>

            {/* --- Menu Icon (mobile only) --- */}
            {isMobile && (
                <div style={menuIcon} onClick={toggleMenu}>
                    ☰
                </div>
            )}

            {/* --- Navigation Links --- */}
            <div
                style={{
                    ...navLinks,
                    ...(isMobile
                        ? menuOpen
                            ? navLinksMobileOpen
                            : navLinksMobileClosed
                        : {}),
                }}
            >
                {navItem("/admin/dashboard", "Dashboard", location.pathname)}
                {navItem("/admin/classes", "Classes", location.pathname)}
                {navItem("/admin/recycle-bin", "Recycle Bin", location.pathname)}
                {navItem("/admin/register-student", "Student Registration", location.pathname)}
            </div>
        </nav>
    );
}

// --- Helper Function for Nav Links ---
const navItem = (path, label, currentPath) => {
    const isActive = currentPath === path;
    return (
        <Link
            to={path}
            style={{
                ...link,
                ...(isActive ? activeLink : {}),
            }}
            onMouseEnter={(e) => {
                if (!isActive) e.target.style.color = "#FFD700";
            }}
            onMouseLeave={(e) => {
                if (!isActive) e.target.style.color = "white";
            }}
        >
            {label}
        </Link>
    );
};

// --- Styles ---
const navbar = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 20px",
    backgroundColor: "#800000",
    color: "white",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    flexWrap: "wrap",
};

const logoContainer = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
};

const logoStyle = {
    width: "45px",
    height: "45px",
    objectFit: "contain",
};

const schoolInfo = {
    display: "flex",
    flexDirection: "column",
    lineHeight: "1.2",
};

const schoolName = {
    fontSize: "16px",
    fontWeight: "bold",
    margin: 0,
};

const companyName = {
    fontSize: "12px",
    margin: 0,
    opacity: 0.8,
};

const menuIcon = {
    fontSize: "26px",
    cursor: "pointer",
    color: "white",
};

const navLinks = {
    display: "flex",
    gap: "20px",
    fontWeight: "bold",
    transition: "all 0.3s ease-in-out",
};

const link = {
    color: "white",
    textDecoration: "none",
    fontSize: "16px",
    padding: "8px 15px",
    borderRadius: "6px",
    transition: "all 0.3s ease",
    cursor: "pointer",
};

const activeLink = {
    backgroundColor: "#FFD700",
    color: "#800000",
    boxShadow: "0 0 8px rgba(255,215,0,0.6)",
};

// --- Mobile Menu Styles ---
const navLinksMobileClosed = {
    display: "none",
};

const navLinksMobileOpen = {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    backgroundColor: "#660000",
    padding: "10px 0",
    marginTop: "10px",
};

export default AdminNavbar;
