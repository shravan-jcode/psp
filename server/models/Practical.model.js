// models/Practical.model.js
import mongoose from 'mongoose';

const practicalSchema = new mongoose.Schema({
    // Student who submitted the practical
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    // The class this practical belongs to
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
        required: true,
    },
    // Subject for which the practical was submitted
    subjectName: {
        type: String,
        required: true,
        trim: true,
    },
    // The practical number/title entered by the student
    practicalNumber: {
        type: String,
        required: true,
        trim: true,
    },
    // The teacher currently assigned to check this practical
    // This will be set on submission, usually based on the subject's teacher list.
    teacherAssigned: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    // File storage details from Cloudinary
    cloudinaryFile: {
        url: { // The secure URL to view the file
            type: String,
            required: true,
        },
        publicId: { // Cloudinary public ID for deletion/management
            type: String,
            required: true,
        },
    },
    // Status tracking
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected', 'Re-uploaded'],
        default: 'Pending',
    },
    // Reason required if the practical is rejected
    rejectionReason: {
        type: String,
        default: null,
    },
    // Optional: Tracking for re-upload attempts
    submissionCount: {
        type: Number,
        default: 1,
    }
}, {
    timestamps: true,
});

const Practical = mongoose.model('Practical', practicalSchema);
export default Practical;