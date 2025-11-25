
import Class from '../models/Class.model.js';
import User from '../models/User.model.js';
import Practical from '../models/Practical.model.js';
import { cloudinary } from '../config/cloudinary.js'; // Import configured cloudinary instance


// @desc    Student joins a class using a unique class code
// @route   POST /api/student/join-class
// @access  Private/Student
const joinClass = async (req, res) => {
    // 1. Get data from request
    const { classCode } = req.body;
    const studentId = req.user._id;
    const studentCollegeName = req.user.collegeName;

    if (!classCode) {
        return res.status(400).json({ message: 'Class code is required.' });
    }

    try {
        // 2. Find the class by code
        // We also need to populate the college details to compare names easily.
        const targetClass = await Class.findOne({ classCode: classCode.toUpperCase() })
            .populate('college'); 

        if (!targetClass) {
            return res.status(404).json({ message: 'Invalid class code. Class not found.' });
        }

        // 3. College Validation (Critical Multi-College requirement)
        // Students can only join classes created within their own college.
        if (targetClass.college.name !== studentCollegeName) {
            return res.status(403).json({ 
                message: 'This class belongs to a different college and cannot be joined.' 
            });
        }
        
        // 4. Check if the student is already enrolled
        // Convert ObjectId array to string array for easy check
        const studentIdsInClass = targetClass.students.map(id => id.toString());
        if (studentIdsInClass.includes(studentId.toString())) {
            return res.status(409).json({ message: 'You are already enrolled in this class.' });
        }

        // 5. Update Class and User records transactionally (using $addToSet for uniqueness)
        
        // A. Add student to the Class's students array
        await Class.findByIdAndUpdate(targetClass._id, {
            $addToSet: { students: studentId }
        });

        // B. Add the Class ID to the Student's classes array
        const updatedUser = await User.findByIdAndUpdate(studentId, {
            $addToSet: { classes: targetClass._id }
        }, { new: true }).select('classes name email role');
        
        // 6. Success Response
        // Return the class details and the subjects they now have access to.
        res.status(200).json({
            message: `Successfully joined class: ${targetClass.className}.`,
            classId: targetClass._id,
            className: targetClass.className,
            // Only return the subject structure needed for display and submission
            subjects: targetClass.subjects.map(subject => ({
                name: subject.name,
                subjectId: subject._id,
            })),
            studentClasses: updatedUser.classes,
        });

    } catch (error) {
        console.error('Error joining class:', error);
        res.status(500).json({ message: 'Server error during class joining.', error: error.message });
    }
};

// --- Helper: Assign a Teacher Randomly ---
const selectRandomTeacher = (teacherList) => {
    if (!teacherList || teacherList.length === 0) {
        throw new Error("No teachers assigned to this subject.");
    }
    // Select one teacher ID randomly from the list
    const randomIndex = Math.floor(Math.random() * teacherList.length);
    return teacherList[randomIndex];
};


// @desc    Student uploads a practical file
// @route   POST /api/student/upload-practical/:classId
// @access  Private/Student
const uploadPractical = async (req, res) => {
    const studentId = req.user._id;
    const { classId } = req.params;
    const { subjectId, practicalNumber } = req.body;

    // 1. Input and File Validation
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded. Please upload a PDF or DOCX.' });
    }
    if (!subjectId || !practicalNumber) {
        return res.status(400).json({ message: 'Subject ID and Practical Number are required.' });
    }

    // 2. Class and Subject Verification
    try {
        const targetClass = await Class.findById(classId);

        if (!targetClass) {
            return res.status(404).json({ message: 'Class not found.' });
        }
        
        // Ensure student is actually enrolled in this class
        if (!targetClass.students.some(s => s.equals(studentId))) {
            return res.status(403).json({ message: 'You are not enrolled in this class.' });
        }

        // Find the specific subject within the class
        const subject = targetClass.subjects.find(s => s._id.equals(subjectId));
        if (!subject) {
            return res.status(404).json({ message: 'Subject not found in this class.' });
        }

        // 3. Assign Teacher
        const teacherAssignedId = selectRandomTeacher(subject.teachers);

        // 4. Cloudinary Upload (using the file buffer)
        // Convert the buffer to a Data URI for upload
        const dataUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

     const uploadResult = await cloudinary.uploader.upload(dataUri, {
    folder: `practicals/${targetClass.classCode}/${subject.name}`,
    resource_type: 'raw' // IMPORTANT: Change from raw to image
});


        // 5. Save Practical Submission to DB
        const newPractical = await Practical.create({
            student: studentId,
            class: targetClass._id,
            subjectName: subject.name,
            practicalNumber,
            teacherAssigned: teacherAssignedId,
            cloudinaryFile: {
                url: uploadResult.secure_url,
                publicId: uploadResult.public_id,
            },
            status: 'Pending',
        });

        // 6. Success Response
        res.status(201).json({
            message: 'Practical submitted successfully!',
            submission: {
                practicalId: newPractical._id,
                subject: newPractical.subjectName,
                status: newPractical.status,
                fileUrl: newPractical.cloudinaryFile.url,
            }
        });

    } catch (error) {
        console.error('Submission error:', error);
        
        // If Cloudinary failed, handle it separately
        if (error.http_code === 400 || error.message.includes('upload')) {
             return res.status(500).json({ message: 'File upload failed. Please try again.', error: error.message });
        }
        
        // Generic server error
        res.status(500).json({ message: 'Server error during submission.', error: error.message });
    }
};

const getStudentPracticals = async (req, res) => {
    const studentId = req.user._id;

    try {
        // Find all practicals submitted by this student.
        // Populate the Class and Teacher details for better context.
        const practicals = await Practical.find({ student: studentId })
            .populate('class', 'className classCode') // Only select class name and code
            .populate('teacherAssigned', 'name email'); // Only select teacher name and email

        if (!practicals || practicals.length === 0) {
            return res.status(200).json({ message: 'No practical submissions found.', data: [] });
        }

        // Structure the response data for clarity
        const formattedPracticals = practicals.map(p => ({
            practicalId: p._id,
            class: p.class.className,
            classCode: p.class.classCode,
            subject: p.subjectName,
            practicalNumber: p.practicalNumber,
            status: p.status,
            rejectionReason: p.rejectionReason,
            submittedOn: p.createdAt,
            lastUpdated: p.updatedAt,
            teacherAssigned: p.teacherAssigned.name,
            fileUrl: p.cloudinaryFile.url,
        }));

        res.status(200).json({
            message: 'Practical submissions retrieved successfully.',
            data: formattedPracticals,
        });

    } catch (error) {
        console.error('Error fetching student practicals:', error);
        res.status(500).json({ message: 'Server error while fetching practicals.', error: error.message });
    }
};
// @desc    Get subjects for all classes a student has joined
// @route   GET /api/student/my-subjects
// @access  Private/Student
const getStudentSubjects = async (req, res) => {
    const studentId = req.user._id;

    try {
        // Fetch the student with populated classes → subjects included
        const student = await User.findById(studentId)
            .populate({
                path: 'classes',
                select: 'className classCode subjects',
            });

        if (!student || student.classes.length === 0) {
            return res.status(200).json({
                message: 'No enrolled classes found.',
                data: [],
            });
        }

        // Format response
        const classList = student.classes.map(cls => ({
            classId: cls._id,
            className: cls.className,
            classCode: cls.classCode,
            subjects: cls.subjects.map(sub => ({
                subjectId: sub._id,
                name: sub.name,
            })),
        }));

        res.status(200).json({
            message: 'Subjects loaded successfully.',
            data: classList,
        });

    } catch (error) {
        console.error("Error fetching student subjects:", error);
        res.status(500).json({
            message: "Server error while fetching subjects.",
            error: error.message,
        });
    }
};

export {
    joinClass,
    uploadPractical,
    getStudentPracticals, 
    getStudentSubjects,
};