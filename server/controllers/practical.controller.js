import Practical from '../models/Practical.model.js';
import Class from '../models/Class.model.js';
import { cloudinary } from '../config/cloudinary.js';

// @desc    Get all practical submissions assigned to the logged-in teacher
// @route   GET /api/teacher/submissions
// @access  Private/Teacher
const getTeacherSubmissions = async (req, res) => {
    const teacherId = req.user._id;

    try {
        // Find all practicals assigned to this teacher where the status is 'Pending'.
        const pendingPracticals = await Practical.find({ 
            teacherAssigned: teacherId,
            status: 'Pending' 
        })
        .populate('student', 'name email rollNumber') // Get student details
        .populate('class', 'className classCode college') // Get class and college reference
        .sort({ createdAt: 1 }); // Oldest submissions first

        if (!pendingPracticals || pendingPracticals.length === 0) {
            return res.status(200).json({ message: 'No pending practicals to check.', data: [] });
        }

        // Structure the response data for the teacher's dashboard
        const formattedSubmissions = pendingPracticals.map(p => ({
            practicalId: p._id,
            studentName: p.student.name,
            studentRollNumber: p.student.rollNumber,
            className: p.class.className,
            classCode: p.class.classCode,
            subject: p.subjectName,
            practicalNumber: p.practicalNumber,
            submittedOn: p.createdAt,
            // The file URL is crucial for viewing (front-end will embed this)
            fileUrl: p.cloudinaryFile.url, 
            submissionCount: p.submissionCount,
        }));

        res.status(200).json({
            message: `Found ${formattedSubmissions.length} pending practicals.`,
            data: formattedSubmissions,
        });

    } catch (error) {
        console.error('Error fetching teacher submissions:', error);
        res.status(500).json({ message: 'Server error while fetching submissions.', error: error.message });
    }
};

const checkPractical = async (req, res) => {
    const { practicalId } = req.params;
    const teacherId = req.user._id;
    // Expected body: { status: 'Approved' | 'Rejected', rejectionReason: String (optional) }
    const { status, rejectionReason } = req.body;

    // 1. Basic Input Validation
    if (!status || !['Approved', 'Rejected'].includes(status)) {
        return res.status(400).json({ message: 'Invalid or missing status provided.' });
    }

    // If rejected, a reason is mandatory for the student's feedback
    if (status === 'Rejected' && (!rejectionReason || rejectionReason.trim() === '')) {
        return res.status(400).json({ message: 'Rejection reason is mandatory when rejecting a practical.' });
    }

    try {
        // 2. Find Practical and Authorization Check
        const practical = await Practical.findById(practicalId);

        if (!practical) {
            return res.status(404).json({ message: 'Practical submission not found.' });
        }

        // Ensure the logged-in teacher is the one assigned to check this specific practical
        if (!practical.teacherAssigned.equals(teacherId)) {
            return res.status(403).json({ message: 'Forbidden. You are not assigned to check this submission.' });
        }
        
        // Prevent checking an already-approved submission (unless explicit re-evaluation is needed, 
        // which we'll skip for this initial scope)
        if (practical.status !== 'Pending' && practical.status !== 'Re-uploaded') {
             return res.status(400).json({ message: `Practical status is already set to ${practical.status}.` });
        }


        // 3. Update Status Logic
        practical.status = status;
        
        if (status === 'Rejected') {
            practical.rejectionReason = rejectionReason.trim();
        } else {
            // Clear rejection reason if approved
            practical.rejectionReason = undefined; 
        }

        await practical.save();


        // 4. Success Response
        res.status(200).json({
            message: `Practical status updated to ${status}.`,
            data: {
                practicalId: practical._id,
                status: practical.status,
                rejectionReason: practical.rejectionReason,
                student: practical.student,
            }
        });

    } catch (error) {
        console.error('Error checking practical:', error);
        res.status(500).json({ message: 'Server error while checking practical.', error: error.message });
    }
};

export {
    getTeacherSubmissions,
    checkPractical, // Export the new function
};