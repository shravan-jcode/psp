import mongoose from 'mongoose';

const classSchema = new mongoose.Schema({
    className: {
        type: String,
        required: [true, 'Class name (e.g., FYCS, SYBCOM) is required.'],
        trim: true,
    },
    // Unique code for students to join the class
    classCode: {
        type: String,
        required: [true, 'Class code is required.'],
        unique: true,
        uppercase: true,
        trim: true,
    },
    // Reference to the college this class belongs to
    college: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'College',
        required: true,
    },
    // Array of subjects taught in this class
    subjects: [{
        name: {
            type: String,
            required: true,
            trim: true,
        },
        // An array of Teacher IDs assigned to this specific subject
        teachers: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Role will be 'Teacher'
        }],
        // Optional: Reference to files uploaded by the teacher for this subject
        optionalFile: {
            url: String,
            publicId: String,
        }
    }],
    // Array of students who have joined this class
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Role will be 'Student'
    }],
}, {
    timestamps: true,
});

const Class = mongoose.model('Class', classSchema);
export default Class;