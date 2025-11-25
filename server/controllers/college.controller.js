// controllers/college.controller.js
import Class from '../models/Class.model.js';
import College from '../models/College.model.js';
import User from '../models/User.model.js';
import generateUniqueCode from '../utils/generateCode.js';

const generateCode = async () => {
    let code;
    let exists = true;

    while (exists) {
        code = generateUniqueCode();
        exists = await Class.findOne({ classCode: code });
    }

    return code;
};

export const createClass = async (req, res) => {
    const { className, subjects } = req.body;
    const teacherId = req.user._id;

    if (!className || !subjects?.length) {
        return res.status(400).json({ message: "className and subjects required" });
    }

    try {
        // ✅ FIX: auto-create college if not found
        let college = await College.findOne({ name: req.user.collegeName });

        if (!college) {
            college = await College.create({
                name: req.user.collegeName
            });
        }

        const classCode = await generateCode();

        const structuredSubjects = subjects.map((s) => ({
            name: s.name,
            teachers: [teacherId],
        }));

        const newClass = await Class.create({
            className,
            classCode,
            college: college._id,
            subjects: structuredSubjects,
        });

        await User.findByIdAndUpdate(teacherId, {
            $addToSet: { classes: newClass._id },
        });

        res.status(201).json({
            message: "Class created",
            class: newClass,
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Server error" });
    }
};


export const getTeacherClasses = async (req, res) => {
    try {
        const teacherId = req.user._id;

        const classes = await Class.find({
            "subjects.teachers": teacherId,
        });

        res.status(200).json({ classes });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch classes" });
    }
};