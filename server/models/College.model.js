import mongoose from 'mongoose';

const collegeSchema = new mongoose.Schema({
    // The college name provided by the first user from that college
    name: {
        type: String,
        required: [true, 'College name is required.'],
        unique: true,
        trim: true,
    },
    // Optional: Keep track of teachers and students associated with this college
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
}, {
    timestamps: true,
});

const College = mongoose.model('College', collegeSchema);
export default College;