import React from "react";

function AdminFooter() {
    return (
        <footer style={footerStyle}>
            <p style={text}>
                © {new Date().getFullYear()} <strong>Datforte International Schools</strong>.
                All Rights Reserved.
            </p>
            <p style={subText}>
                Deno Technology Limited 💻
            </p>
        </footer>
    );
}

// --- Styles ---
const footerStyle = {
    backgroundColor: "#800000",
    color: "white",
    textAlign: "center",
    padding: "15px 10px",
    position: "relative",
    bottom: "0",
    width: "100%",
    marginTop: "auto",
};

const text = {
    margin: "0",
    fontSize: "14px",
};

const subText = {
    margin: "5px 0 0",
    fontSize: "12px",
    opacity: 0.8,
};

export default AdminFooter;
