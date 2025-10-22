// src/App.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import RegisterStudent from "./pages/RegisterStudent";
import AdminDashboard from "./pages/AdminDashboard";
import AdminClasses from "./pages/AdminClasses";
import AdminRecycleBin from "./pages/AdminRecycleBin";
import ClassStudents from "./pages/ClassStudents";
import AdminLayout from "./components/AdminLayout";

function App() {
  return (
    <Routes>
      {/* Public registration page */}
      <Route path="/" element={<RegisterStudent />} />

      {/* All admin routes under /admin with shared layout */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="classes" element={<AdminClasses />} />
        <Route path="class/:classLevel" element={<ClassStudents />} />
        <Route path="recycle-bin" element={<AdminRecycleBin />} />
        <Route path="register-student" element={<RegisterStudent />} />
      </Route>

      {/* 404 fallback */}
      <Route
        path="*"
        element={<h2 style={{ padding: 20 }}>404 - Page Not Found</h2>}
      />
    </Routes>
  );
}

export default App;
