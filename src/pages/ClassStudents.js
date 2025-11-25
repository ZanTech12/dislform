import "../App.css";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function ClassStudents() {
    const { classLevel } = useParams();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingStudent, setEditingStudent] = useState(null);
    const [form, setForm] = useState({
        firstName: "",
        middleName: "",
        lastName: "",
        gender: "",
        dateOfBirth: "",
        nationality: "",
        stateOfOrigin: "",
        lga: "",
        homeAddress: "",
        religion: "",
        classLevel: "",
        section: "",
        session: "",
        term: "",
        previousSchool: "",
        dateOfAdmission: "",
        admissionNumber: "",
    });
    const [passport, setPassport] = useState(null);
    const [passportPreview, setPassportPreview] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchStudents();
    }, [classLevel]);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const res = await axios.get("https://zannu.duckdns.org/api/students");
            const classStudents = res.data.filter(
                (student) => student.classLevel === classLevel
            );
            setStudents(classStudents);
            setError(null);
        } catch (err) {
            console.error("❌ Error fetching students:", err);
            setError("Failed to load students for this class.");
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (student) => {
        setEditingStudent(student);
        setForm({
            firstName: student.firstName || "",
            middleName: student.middleName || "",
            lastName: student.lastName || "",
            gender: student.gender || "",
            dateOfBirth: student.dateOfBirth?.slice(0, 10) || "",
            nationality: student.nationality || "",
            stateOfOrigin: student.stateOfOrigin || "",
            lga: student.lga || "",
            homeAddress: student.homeAddress || "",
            religion: student.religion || "",
            classLevel: student.classLevel || "",
            section: student.section || "",
            session: student.session || "",
            term: student.term || "",
            previousSchool: student.previousSchool || "",
            dateOfAdmission: student.dateOfAdmission?.slice(0, 10) || "",
            admissionNumber: student.admissionNumber || "",
        });
        setPassport(null);
        // Set passport preview if student has a passport
        if (student.passport) {
            setPassportPreview(`https://zannu.duckdns.org/uploads/${student.passport}`);
        } else {
            setPassportPreview(null);
        }
        setError(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Trim the value to remove any extra spaces
        const trimmedValue = typeof value === 'string' ? value.trim() : value;
        setForm({ ...form, [name]: trimmedValue });
        setError(null);
    };

    const handlePassportChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setPassport(file);

            // Create a preview for the newly selected image
            const reader = new FileReader();
            reader.onloadend = () => {
                setPassportPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            // Create FormData object
            const fd = new FormData();

            // Append all form fields
            Object.keys(form).forEach((key) => {
                // Ensure we don't send empty strings for optional fields
                if (form[key] !== "") {
                    fd.append(key, form[key]);
                }
            });

            // Append passport if a new one is selected
            if (passport) {
                fd.append("passport", passport);
            }

            // Make the API request without manually setting Content-Type
            const response = await axios.put(
                `https://zannu.duckdns.org/api/students/${editingStudent._id}`,
                fd
            );

            alert("✅ Student updated successfully!");
            setEditingStudent(null);
            fetchStudents();
        } catch (err) {
            console.error("❌ Error updating student:", err);

            // Extract error message from response if available
            let errorMessage = "Failed to update student";
            if (err.response) {
                // Server responded with error status
                console.error("Error response data:", err.response.data);
                console.error("Error status:", err.response.status);
                errorMessage = err.response.data.message || err.response.data || errorMessage;
            } else if (err.request) {
                // Request was made but no response received
                errorMessage = "No response from server. Please check your connection.";
            } else {
                // Error in request setup
                errorMessage = err.message;
            }

            setError(errorMessage);
            alert(errorMessage);
        }
    };

    const handleCancel = () => {
        setEditingStudent(null);
        setError(null);
    };

    // ✅ enums aligned with the backend model
    const classLevels = [
        "Reception", "KG 1", "KG 2", "Nursery 1", "Nursery 2",
        "Primary 1", "Primary 2", "Primary 3", "Primary 4", "Primary 5", "Primary 6",
        "JSS 1", "JSS 2", "JSS 3",
        "SSS 1", "SSS 2", "SSS 3"
    ];

    const terms = ["First Term", "Second Term", "Third Term"];

    return (
        <div style={{ padding: 20 }}>
            <h2>👨‍🎓 Students in {classLevel}</h2>
            {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
            {loading ? (
                <p>Loading students...</p>
            ) : students.length === 0 ? (
                <p>No students registered in this class.</p>
            ) : (
                <div style={tableWrapper}>
                    <table style={table}>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Passport</th>
                                <th>Full Name</th>
                                <th>Admission Number</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((st, idx) => (
                                <tr key={st._id}>
                                    <td>{idx + 1}</td>
                                    <td>
                                        {st.passport ? (
                                            <img
                                                src={`https://zannu.duckdns.org/uploads/${st.passport}`}
                                                alt="Passport"
                                                style={passportImageStyle}
                                            />
                                        ) : (
                                            <div style={noImagePlaceholder}>
                                                <span>No Image</span>
                                            </div>
                                        )}
                                    </td>
                                    <td>
                                        <div style={nameContainer}>
                                            <div style={fullName}>
                                                {[st.firstName, st.middleName, st.lastName]
                                                    .filter(Boolean)
                                                    .join(" ")}
                                            </div>
                                            <div style={classInfo}>{st.classLevel}</div>
                                        </div>
                                    </td>
                                    <td>{st.admissionNumber || "N/A"}</td>
                                    <td>
                                        <button
                                            style={editButton}
                                            onClick={() => handleEditClick(st)}
                                        >
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {editingStudent && (
                <div style={modalOverlay}>
                    <div style={modalContent}>
                        <h3>Edit Student</h3>
                        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
                        <form onSubmit={handleSubmit} style={formStyle} className="responsive-form">
                            <div>
                                <label style={label}>Admission Number:</label>
                                <input
                                    type="text"
                                    name="admissionNumber"
                                    value={form.admissionNumber}
                                    readOnly
                                    style={{ ...input, backgroundColor: "#f4f4f4" }}
                                />
                            </div>

                            {/* Name Fields */}
                            <input type="text" name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} required style={input} />
                            <input type="text" name="middleName" placeholder="Middle Name" value={form.middleName} onChange={handleChange} style={input} />
                            <input type="text" name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} required style={input} />

                            {/* Gender & DOB */}
                            <div>
                                <label style={label}>Gender:</label>
                                <select name="gender" value={form.gender} onChange={handleChange} required style={input}>
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>

                            <div>
                                <label style={label}>Date of Birth:</label>
                                <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} style={input} />
                            </div>

                            {/* Address Section */}
                            <input type="text" name="nationality" placeholder="Nationality" value={form.nationality} onChange={handleChange} style={input} />
                            <input type="text" name="stateOfOrigin" placeholder="State of Origin" value={form.stateOfOrigin} onChange={handleChange} style={input} />
                            <input type="text" name="lga" placeholder="Local Government Area" value={form.lga} onChange={handleChange} style={input} />
                            <input type="text" name="homeAddress" placeholder="Home Address" value={form.homeAddress} onChange={handleChange} style={input} />

                            {/* Religion */}
                            <div>
                                <label style={label}>Religion:</label>
                                <select name="religion" value={form.religion} onChange={handleChange} style={input}>
                                    <option value="">Select Religion</option>
                                    <option value="Christianity">Christianity</option>
                                    <option value="Islam">Islam</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            {/* Class & Term */}
                            <div>
                                <label style={label}>Class Level:</label>
                                <select name="classLevel" value={form.classLevel} onChange={handleChange} style={input} required>
                                    <option value="">Select Class</option>
                                    {classLevels.map((level) => (
                                        <option key={level} value={level}>{level}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label style={label}>Term:</label>
                                <select name="term" value={form.term} onChange={handleChange} style={input}>
                                    <option value="">Select Term</option>
                                    {terms.map((term) => (
                                        <option key={term} value={term}>{term}</option>
                                    ))}
                                </select>
                            </div>

                            <input type="text" name="section" placeholder="Section (e.g. A, B)" value={form.section} onChange={handleChange} style={input} />
                            <input type="text" name="session" placeholder="Session (e.g. 2025/2026)" value={form.session} onChange={handleChange} style={input} />
                            <input type="text" name="previousSchool" placeholder="Previous School" value={form.previousSchool} onChange={handleChange} style={input} />
                            <input type="date" name="dateOfAdmission" value={form.dateOfAdmission} onChange={handleChange} style={input} />

                            {/* Passport Upload */}
                            <div>
                                <label style={label}>Passport Photo:</label>
                                {passportPreview && (
                                    <div style={{ marginBottom: "10px" }}>
                                        <img
                                            src={passportPreview}
                                            alt="Passport Preview"
                                            style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "4px" }}
                                        />
                                    </div>
                                )}
                                <input
                                    type="file"
                                    onChange={handlePassportChange}
                                    style={input}
                                    accept="image/*"
                                />
                            </div>

                            {/* Buttons */}
                            <div style={{ display: "flex", gap: "10px", flexDirection: "column", marginTop: "10px" }}>
                                <button type="submit" style={editButton}>Save</button>
                                <button type="button" style={cancelButton} onClick={handleCancel}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

// --- Styles ---
const tableWrapper = { overflowX: "auto", width: "100%" };
const table = { width: "100%", borderCollapse: "collapse", marginTop: "20px", minWidth: "400px" };
const editButton = { padding: "10px", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" };
const cancelButton = { padding: "10px", backgroundColor: "#f44336", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" };
const modalOverlay = { position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", padding: "10px", zIndex: 1000 };
const modalContent = { backgroundColor: "white", padding: "20px", borderRadius: "8px", width: "100%", maxWidth: "600px", maxHeight: "90vh", overflowY: "auto", boxSizing: "border-box" };
const formStyle = { display: "grid", gridTemplateColumns: "1fr", gap: "10px", width: "100%" };
const input = { padding: "10px", borderRadius: "5px", border: "1px solid #ccc", width: "100%", boxSizing: "border-box" };
const label = { fontWeight: "bold", marginTop: "10px" };

// New styles for passport images
const passportImageStyle = {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid #e0e0e0'
};

const noImagePlaceholder = {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    backgroundColor: '#f5f5f5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid #e0e0e0',
    fontSize: '10px',
    color: '#888'
};

const nameContainer = {
    display: 'flex',
    flexDirection: 'column'
};

const fullName = {
    fontWeight: 'bold',
    marginBottom: '4px'
};

const classInfo = {
    fontSize: '12px',
    color: '#666',
    fontStyle: 'italic'
};

export default ClassStudents;