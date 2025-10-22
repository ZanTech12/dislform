// src/components/AdminLayout.jsx
import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";

function AdminLayout() {
    // Responsive adjustments for mobile/tablet
    useEffect(() => {
        const handleResize = () => {
            const root = document.documentElement;
            if (window.innerWidth <= 768) {
                root.style.setProperty("--content-padding", "15px");
                root.style.setProperty("--footer-font-size", "12px");
            } else {
                root.style.setProperty("--content-padding", "30px");
                root.style.setProperty("--footer-font-size", "14px");
            }
        };

        handleResize(); // Run on mount
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div style={layoutContainer}>
            {/* --- Navbar --- */}
            <header style={headerStyle}>
                <AdminNavbar />
            </header>

            {/* --- Main Content Area --- */}
            <main style={contentWrapper}>
                <Outlet />
            </main>
        </div>
    );
}

// --- Styles ---
const layoutContainer = {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    backgroundColor: "#f7f7f7",
    width: "100%",
    overflowX: "hidden",
};

const headerStyle = {
    position: "sticky",
    top: 0,
    zIndex: 1000,
    width: "100%",
};

const contentWrapper = {
    flex: 1,
    width: "100%",
    boxSizing: "border-box",
    padding: "var(--content-padding, 30px)",
    maxWidth: "1200px",
    margin: "0 auto",
};

const footerStyle = {
    textAlign: "center",
    padding: "15px 10px",
    backgroundColor: "#800000",
    color: "white",
    fontSize: "var(--footer-font-size, 14px)",
    fontWeight: "bold",
    letterSpacing: "0.5px",
    boxShadow: "0 -3px 8px rgba(0,0,0,0.2)",
    width: "100%",
};

export default AdminLayout;
