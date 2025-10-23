// routes/studentRoutes.js
import express from "express";
import Student from "../models/Student.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// === Multer Setup for Passport Upload ===
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = "uploads";
        if (!fs.existsSync(dir)) fs.mkdirSync(dir);
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

// === Register New Student ===
router.post("/register", upload.single("passport"), async (req, res) => {
    try {
        const { firstName, lastName, gender, classLevel } = req.body;

        if (!firstName || !lastName || !gender || !classLevel) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const allowedClasses = [
            "Reception", "KG 1", "KG 2", "Nursery 1", "Nursery 2",
            "Basic 1", "Basic 2", "Basic 3", "Basic 4", "Basic 5",
            "JSS 1", "JSS 2", "JSS 3",
            "SSS 1", "SSS 2", "SSS 3",
        ];

        if (!allowedClasses.includes(classLevel))
            return res.status(400).json({ message: "Invalid class level" });

        const allowedGenders = ["Male", "Female"];
        if (!allowedGenders.includes(gender))
            return res.status(400).json({ message: "Invalid gender" });

        // Generate admission number
        const year = new Date().getFullYear();
        const lastStudent = await Student.findOne({
            admissionNumber: { $regex: `^DIS/${year}/` },
        }).sort({ admissionNumber: -1 });

        let nextNumber = 1;
        if (lastStudent && lastStudent.admissionNumber) {
            const lastNum = parseInt(lastStudent.admissionNumber.split("/")[2], 10);
            nextNumber = lastNum + 1;
        }

        if (nextNumber > 999) {
            return res.status(400).json({ message: "Maximum number of students reached for this year" });
        }

        const admissionNumber = `DIS/${year}/${String(nextNumber).padStart(3, "0")}`;

        const student = new Student({
            ...req.body,
            admissionNumber,
            passport: req.file ? req.file.filename : null,
        });

        await student.save();
        res.status(201).json(student);
    } catch (error) {
        console.error("❌ Error registering student:", error);
        res.status(500).json({ message: error.message });
    }
});

// === Get All Non-deleted Students ===
router.get("/", async (req, res) => {
    try {
        const students = await Student.find({ deleted: false });
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// === Get Deleted Students (Recycle Bin) ===
router.get("/recyclebin", async (req, res) => {
    try {
        const deletedStudents = await Student.find({ deleted: true });
        res.json(deletedStudents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// === Get Single Student by ID ===
router.get("/:id", async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ message: "Student not found" });
        res.json(student);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// === Edit / Update Student ===
router.put("/:id", upload.single("passport"), async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ message: "Student not found" });

        // Update all editable fields
        Object.keys(req.body).forEach((key) => {
            student[key] = req.body[key];
        });

        // If a new passport is uploaded, replace the old one
        if (req.file) {
            if (student.passport) {
                const oldPath = path.join("uploads", student.passport);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
            student.passport = req.file.filename;
        }

        await student.save();
        res.json({ message: "✅ Student updated successfully", student });
    } catch (error) {
        console.error("❌ Error updating student:", error);
        res.status(500).json({ message: error.message });
    }
});

// === Soft Delete (Move to Recycle Bin) ===
router.put("/recycle/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            { deleted: true },
            { new: true }
        );
        if (!student) return res.status(404).json({ message: "Student not found" });
        res.json({ message: "Student moved to recycle bin", student });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// === Restore Student ===
router.put("/restore/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            { deleted: false },
            { new: true }
        );
        if (!student) return res.status(404).json({ message: "Student not found" });
        res.json({ message: "Student restored successfully", student });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// === Permanent Delete ===
router.delete("/permanent/:id", async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ message: "Student not found" });

        if (student.passport) {
            const filePath = path.join("uploads", student.passport);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }

        await student.deleteOne();
        res.json({ message: "Student permanently deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
