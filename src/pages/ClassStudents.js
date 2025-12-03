import "../App.css";
import React, { useEffect, useState, useRef } from "react";
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
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [uploadStatus, setUploadStatus] = useState('');
    const [retryCount, setRetryCount] = useState(0);
    const [networkType, setNetworkType] = useState('unknown');
    const [uploadMethod, setUploadMethod] = useState('formData');
    const [imageInfo, setImageInfo] = useState(null);
    const fileInputRef = useRef(null);

    // Configure axios with different timeouts for different scenarios
    const axiosInstance = axios.create({
        timeout: 90000, // 90 seconds
        maxContentLength: 10 * 1024 * 1024, // 10MB max
        maxBodyLength: 10 * 1024 * 1024,
    });

    useEffect(() => {
        fetchStudents();

        // Check if device is mobile
        const checkMobile = () => {
            setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);

        // Monitor network status and type
        const updateNetworkInfo = () => {
            setIsOnline(navigator.onLine);
            if (navigator.connection) {
                const connection = navigator.connection;
                setNetworkType(connection.effectiveType || 'unknown');
            }
        };

        updateNetworkInfo();
        window.addEventListener('online', updateNetworkInfo);
        window.addEventListener('offline', updateNetworkInfo);

        if (navigator.connection) {
            navigator.connection.addEventListener('change', updateNetworkInfo);
        }

        return () => {
            window.removeEventListener('resize', checkMobile);
            window.removeEventListener('online', updateNetworkInfo);
            window.removeEventListener('offline', updateNetworkInfo);
            if (navigator.connection) {
                navigator.connection.removeEventListener('change', updateNetworkInfo);
            }
        };
    }, [classLevel]);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get("http://localhost:5000/api/students");
            const classStudents = res.data.filter(
                (student) => student.classLevel === classLevel
            );
            setStudents(classStudents);
            setError(null);
        } catch (err) {
            console.error("❌ Error fetching students:", err);
            if (err.code === 'ECONNABORTED') {
                setError("Request timed out. Please check your connection and try again.");
            } else {
                setError("Failed to load students for this class.");
            }
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
        if (student.passport) {
            setPassportPreview(`http://localhost:5000/uploads/${student.passport}`);
        } else {
            setPassportPreview(null);
        }
        setError(null);
        setUploadStatus('');
        setRetryCount(0);
        setUploadMethod('formData');
        setImageInfo(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const trimmedValue = typeof value === 'string' ? value.trim() : value;
        setForm({ ...form, [name]: trimmedValue });
        setError(null);
    };

    // Smart image resizing with multiple attempts
    const smartResizeImage = async (file) => {
        const sizePresets = [
            { maxWidth: 1200, maxHeight: 1200, quality: 0.9, label: "Large" },
            { maxWidth: 800, maxHeight: 800, quality: 0.8, label: "Medium" },
            { maxWidth: 600, maxHeight: 600, quality: 0.7, label: "Small" },
            { maxWidth: 400, maxHeight: 400, quality: 0.6, label: "Very Small" },
            { maxWidth: 300, maxHeight: 300, quality: 0.5, label: "Tiny" },
            { maxWidth: 200, maxHeight: 200, quality: 0.4, label: "Minimal" }
        ];

        // Determine target size based on network and device
        const getTargetSize = () => {
            if (isMobile) {
                switch (networkType) {
                    case 'slow-2g':
                    case '2g':
                        return 200 * 1024; // 200KB
                    case '3g':
                        return 400 * 1024; // 400KB
                    default:
                        return 600 * 1024; // 600KB
                }
            } else {
                return 2 * 1024 * 1024; // 2MB for desktop
            }
        };

        const targetSize = getTargetSize();
        const originalSize = file.size;
        const originalSizeKB = Math.round(originalSize / 1024);

        setUploadStatus(`Analyzing image (${originalSizeKB}KB)...`);

        // Get original image dimensions
        const originalDimensions = await new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                resolve({ width: img.width, height: img.height });
                URL.revokeObjectURL(img.src);
            };
            img.src = URL.createObjectURL(file);
        });

        setImageInfo({
            original: {
                size: originalSizeKB,
                width: originalDimensions.width,
                height: originalDimensions.height
            }
        });

        // Try each preset until we find one that works
        for (let i = 0; i < sizePresets.length; i++) {
            const preset = sizePresets[i];
            setUploadStatus(`Trying ${preset.label} size (${preset.maxWidth}x${preset.maxHeight})...`);

            try {
                const resizedFile = await resizeImage(file, preset);
                const newSizeKB = Math.round(resizedFile.size / 1024);

                setImageInfo(prev => ({
                    ...prev,
                    current: {
                        size: newSizeKB,
                        width: preset.maxWidth,
                        height: preset.maxHeight,
                        quality: preset.quality,
                        preset: preset.label
                    }
                }));

                if (resizedFile.size <= targetSize) {
                    setUploadStatus(`✓ Image optimized to ${newSizeKB}KB`);
                    return resizedFile;
                }

                // If this is the last preset and still too large, try extreme compression
                if (i === sizePresets.length - 1) {
                    setUploadStatus(`Applying maximum compression...`);
                    const ultraCompressed = await resizeImage(file, {
                        maxWidth: 150,
                        maxHeight: 150,
                        quality: 0.2
                    });

                    const ultraSizeKB = Math.round(ultraCompressed.size / 1024);
                    setImageInfo(prev => ({
                        ...prev,
                        current: {
                            size: ultraSizeKB,
                            width: 150,
                            height: 150,
                            quality: 0.2,
                            preset: "Ultra Compressed"
                        }
                    }));

                    setUploadStatus(`✓ Image compressed to ${ultraSizeKB}KB (minimum size)`);
                    return ultraCompressed;
                }
            } catch (err) {
                console.error(`Error with preset ${preset.label}:`, err);
                continue;
            }
        }

        throw new Error("Unable to compress image to uploadable size");
    };

    // Core image resize function
    const resizeImage = (file, options) => {
        return new Promise((resolve, reject) => {
            const { maxWidth, maxHeight, quality = 0.7 } = options;

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            img.onload = () => {
                try {
                    // Calculate new dimensions maintaining aspect ratio
                    let { width, height } = calculateDimensions(
                        img.width,
                        img.height,
                        maxWidth,
                        maxHeight
                    );

                    canvas.width = width;
                    canvas.height = height;

                    // Draw with better quality settings
                    ctx.imageSmoothingEnabled = true;
                    ctx.imageSmoothingQuality = 'high';
                    ctx.drawImage(img, 0, 0, width, height);

                    // Convert to blob
                    canvas.toBlob(
                        (blob) => {
                            if (blob) {
                                const resizedFile = new File([blob], file.name, {
                                    type: 'image/jpeg',
                                    lastModified: Date.now()
                                });
                                resolve(resizedFile);
                            } else {
                                reject(new Error('Failed to create blob'));
                            }
                        },
                        'image/jpeg',
                        quality
                    );
                } catch (error) {
                    reject(error);
                } finally {
                    URL.revokeObjectURL(img.src);
                }
            };

            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = URL.createObjectURL(file);
        });
    };

    // Calculate dimensions maintaining aspect ratio
    const calculateDimensions = (width, height, maxWidth, maxHeight) => {
        if (width <= maxWidth && height <= maxHeight) {
            return { width, height };
        }

        const aspectRatio = width / height;

        if (width > height) {
            // Landscape
            if (width > maxWidth) {
                width = maxWidth;
                height = width / aspectRatio;
            }
        } else {
            // Portrait
            if (height > maxHeight) {
                height = maxHeight;
                width = height * aspectRatio;
            }
        }

        return {
            width: Math.round(width),
            height: Math.round(height)
        };
    };

    // Convert file to base64 as fallback
    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    };

    const handlePassportChange = async (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            // Validate file type
            if (!file.type.match('image.*')) {
                setError("Please select an image file (JPEG, PNG, etc.)");
                return;
            }

            // Check initial file size
            if (file.size > 20 * 1024 * 1024) { // 20MB initial limit
                setError("Image is too large (max 20MB). Please choose a smaller image.");
                return;
            }

            setUploadStatus('Processing image...');
            setImageInfo(null);

            try {
                // Smart resize the image
                const processedFile = await smartResizeImage(file);

                // Final check
                if (processedFile.size > 5 * 1024 * 1024) { // 5MB absolute limit
                    setError("Image is still too large after processing. Please choose a different image.");
                    setUploadStatus('');
                    return;
                }

                setPassport(processedFile);

                // Create preview
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPassportPreview(reader.result);
                    setUploadStatus('');
                };
                reader.readAsDataURL(processedFile);

            } catch (err) {
                console.error("Error processing image:", err);
                setError("Failed to process image. Please try another one.");
                setUploadStatus('');
            }
        }
        setError(null);
    };

    const uploadWithFormData = async (studentData, file) => {
        const fd = new FormData();

        // Append all form fields
        Object.keys(studentData).forEach((key) => {
            if (studentData[key] !== "") {
                fd.append(key, studentData[key]);
            }
        });

        // Append passport
        if (file) {
            fd.append("passport", file);
        }

        return await axiosInstance.put(
            `http://localhost:5000/api/students/${editingStudent._id}`,
            fd,
            {
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    setUploadProgress(percentCompleted);
                },
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
    };

    const uploadWithBase64 = async (studentData, file) => {
        const base64 = await fileToBase64(file);

        const payload = {
            ...studentData,
            passportBase64: base64,
            passportName: file.name
        };

        // Simulate progress for base64 upload
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += 10;
            setUploadProgress(progress);
            if (progress >= 90) {
                clearInterval(progressInterval);
            }
        }, 200);

        const response = await axiosInstance.put(
            `http://localhost:5000/api/students/${editingStudent._id}`,
            payload
        );

        clearInterval(progressInterval);
        setUploadProgress(100);

        return response;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isOnline) {
            setError("You appear to be offline. Please check your internet connection.");
            return;
        }

        setError(null);
        setUploadProgress(0);
        setUploadStatus('Preparing upload...');
        setRetryCount(0);

        const uploadWithRetry = async (attempt = 1, method = 'formData') => {
            try {
                setUploadStatus(`Uploading... (Attempt ${attempt} - ${method === 'base64' ? 'Base64' : 'FormData'})`);

                // Prepare form data
                const studentData = { ...form };
                Object.keys(studentData).forEach(key => {
                    if (studentData[key] === "") {
                        delete studentData[key];
                    }
                });

                let response;

                if (method === 'formData') {
                    response = await uploadWithFormData(studentData, passport);
                } else {
                    response = await uploadWithBase64(studentData, passport);
                }

                setUploadStatus('Upload complete!');
                setTimeout(() => {
                    alert("✅ Student updated successfully!");
                    setEditingStudent(null);
                    fetchStudents();
                    setUploadStatus('');
                }, 500);

            } catch (err) {
                console.error("❌ Error updating student:", err);

                let errorMessage = "Failed to update student";
                let shouldRetry = false;
                let switchMethod = false;

                if (err.code === 'ECONNABORTED') {
                    errorMessage = "Upload timed out. This might be due to a slow connection.";
                    shouldRetry = attempt < 3;
                } else if (err.response) {
                    if (err.response.status === 413) {
                        errorMessage = "File too large. Please choose a smaller image.";
                    } else if (err.response.status >= 500) {
                        errorMessage = "Server error. Please try again.";
                        shouldRetry = attempt < 3;
                    } else {
                        errorMessage = err.response.data.message || err.response.data || errorMessage;
                    }
                } else if (err.request) {
                    errorMessage = "No response from server. Please check your connection.";
                    shouldRetry = attempt < 3;
                    // If FormData fails on mobile, try Base64
                    if (isMobile && method === 'formData' && attempt === 1) {
                        switchMethod = true;
                    }
                } else {
                    errorMessage = err.message;
                }

                if (switchMethod) {
                    setUploadMethod('base64');
                    setUploadStatus('Switching to Base64 upload method...');
                    setTimeout(() => uploadWithRetry(1, 'base64'), 1000);
                } else if (shouldRetry) {
                    setRetryCount(attempt);
                    setUploadStatus(`Retrying... (${attempt}/3)`);
                    setTimeout(() => uploadWithRetry(attempt + 1, method), 2000 * attempt);
                } else {
                    setError(errorMessage);
                    setUploadStatus('');
                    alert(errorMessage);
                }
            }
        };

        uploadWithRetry();
    };

    const handleCancel = () => {
        setEditingStudent(null);
        setError(null);
        setUploadStatus('');
        setRetryCount(0);
        setUploadMethod('formData');
        setImageInfo(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
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
            {!isOnline && (
                <div style={{
                    backgroundColor: '#ffeb3b',
                    color: '#000',
                    padding: '10px',
                    borderRadius: '4px',
                    marginBottom: '10px',
                    textAlign: 'center'
                }}>
                    ⚠️ You appear to be offline. Some features may not work properly.
                </div>
            )}

            {isMobile && networkType !== 'unknown' && (
                <div style={{
                    backgroundColor: '#e3f2fd',
                    color: '#000',
                    padding: '8px',
                    borderRadius: '4px',
                    marginBottom: '10px',
                    textAlign: 'center',
                    fontSize: '12px'
                }}>
                    📶 Network: {networkType.toUpperCase()} {uploadMethod === 'base64' && '| Using Base64 upload'}
                </div>
            )}

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
                                                src={`https://localhost:5000/uploads/${st.passport}`}
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
                            <div style={uploadContainer}>
                                <label style={label}>Passport Photo:</label>
                                {passportPreview && (
                                    <div style={previewContainer}>
                                        <img
                                            src={passportPreview}
                                            alt="Passport Preview"
                                            style={previewImage}
                                        />
                                        <button
                                            type="button"
                                            style={removeImageButton}
                                            onClick={() => {
                                                setPassport(null);
                                                setPassportPreview(null);
                                                setImageInfo(null);
                                                if (fileInputRef.current) {
                                                    fileInputRef.current.value = '';
                                                }
                                            }}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                )}

                                {/* Image Info Display */}
                                {imageInfo && (
                                    <div style={imageInfoContainer}>
                                        {imageInfo.original && (
                                            <div style={imageInfoItem}>
                                                <span style={imageInfoLabel}>Original:</span>
                                                <span style={imageInfoValue}>
                                                    {imageInfo.original.width}×{imageInfo.original.height} ({imageInfo.original.size}KB)
                                                </span>
                                            </div>
                                        )}
                                        {imageInfo.current && (
                                            <div style={imageInfoItem}>
                                                <span style={imageInfoLabel}>Optimized:</span>
                                                <span style={imageInfoValue}>
                                                    {imageInfo.current.width}×{imageInfo.current.height} ({imageInfo.current.size}KB) - {imageInfo.current.preset}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div style={buttonContainer}>
                                    <label htmlFor="passport-upload" style={uploadButton}>
                                        {isMobile ? "📷 Take Photo" : "📁 Choose File"}
                                    </label>
                                    <input
                                        ref={fileInputRef}
                                        id="passport-upload"
                                        type="file"
                                        onChange={handlePassportChange}
                                        style={{ display: 'none' }}
                                        accept="image/*"
                                        capture={isMobile ? "environment" : undefined}
                                    />
                                    {isMobile && (
                                        <label htmlFor="passport-upload-file" style={uploadButton}>
                                            📁 Choose from Gallery
                                        </label>
                                    )}
                                    <input
                                        id="passport-upload-file"
                                        type="file"
                                        onChange={handlePassportChange}
                                        style={{ display: 'none' }}
                                        accept="image/*"
                                    />
                                </div>
                                <div style={uploadInfo}>
                                    Images will be automatically resized to uploadable size
                                </div>
                                {uploadStatus && (
                                    <div style={statusMessage}>
                                        {uploadStatus}
                                    </div>
                                )}
                                {uploadProgress > 0 && uploadProgress < 100 && (
                                    <div style={progressContainer}>
                                        <div style={progressBar}>
                                            <div style={{ ...progressFill, width: `${uploadProgress}%` }}></div>
                                        </div>
                                        <div style={progressText}>{uploadProgress}%</div>
                                    </div>
                                )}
                                {retryCount > 0 && (
                                    <div style={retryMessage}>
                                        Retry attempt {retryCount}/3
                                    </div>
                                )}
                            </div>

                            {/* Buttons */}
                            <div style={{ display: "flex", gap: "10px", flexDirection: "column", marginTop: "10px" }}>
                                <button
                                    type="submit"
                                    style={editButton}
                                    disabled={uploadStatus && uploadStatus.includes('Uploading')}
                                >
                                    {uploadStatus && uploadStatus.includes('Uploading') ? 'Uploading...' : 'Save'}
                                </button>
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

// New styles for upload functionality
const uploadContainer = {
    margin: '15px 0',
    padding: '10px',
    border: '1px dashed #ccc',
    borderRadius: '5px',
    backgroundColor: '#f9f9f9'
};

const previewContainer = {
    position: 'relative',
    width: '120px',
    height: '120px',
    margin: '0 auto 10px'
};

const previewImage = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '5px',
    border: '1px solid #ddd'
};

const removeImageButton = {
    position: 'absolute',
    top: '-5px',
    right: '-5px',
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
};

const buttonContainer = {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
    marginBottom: '10px',
    flexWrap: 'wrap'
};

const uploadButton = {
    padding: '10px 15px',
    backgroundColor: '#2196F3',
    color: 'white',
    borderRadius: '4px',
    cursor: 'pointer',
    textAlign: 'center',
    fontSize: '14px',
    flex: '1',
    minWidth: '120px'
};

const uploadInfo = {
    fontSize: '12px',
    color: '#666',
    textAlign: 'center',
    marginTop: '5px'
};

const progressContainer = {
    marginTop: '10px'
};

const progressBar = {
    width: '100%',
    height: '10px',
    backgroundColor: '#e0e0e0',
    borderRadius: '5px',
    overflow: 'hidden'
};

const progressFill = {
    height: '100%',
    backgroundColor: '#4CAF50',
    transition: 'width 0.3s ease'
};

const progressText = {
    textAlign: 'center',
    fontSize: '12px',
    marginTop: '5px'
};

const statusMessage = {
    textAlign: 'center',
    fontSize: '14px',
    color: '#2196F3',
    marginTop: '10px',
    fontStyle: 'italic'
};

const retryMessage = {
    textAlign: 'center',
    fontSize: '12px',
    color: '#ff9800',
    marginTop: '5px'
};

// New styles for image info
const imageInfoContainer = {
    backgroundColor: '#f0f0f0',
    padding: '8px',
    borderRadius: '4px',
    margin: '10px 0',
    fontSize: '12px'
};

const imageInfoItem = {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '2px 0'
};

const imageInfoLabel = {
    fontWeight: 'bold',
    color: '#555'
};

const imageInfoValue = {
    color: '#333'
};

export default ClassStudents;