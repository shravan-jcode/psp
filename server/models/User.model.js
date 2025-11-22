import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/.+@.+\..+/, 'Please fill a valid email address'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long'],
        select: false, // Important: Don't return password hash by default
    },
    collegeName: {
        type: String,
        required: [true, 'College name is required'],
        trim: true,
    },
    role: {
        type: String,
        enum: ['Student', 'Teacher'],
        required: [true, 'Role is required'],
    },
    // Required only for students
    rollNumber: {
        type: String,
        trim: true,
        // We will add a custom validation later to ensure this exists if role is Student
    },
    // References to classes joined (for Student) or created/assigned (for Teacher)
    classes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
    }],
}, {
    timestamps: true,
});

// --- Pre-Save Middleware: Hash Password ---
userSchema.pre('save', async function(next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) {
        return next();
    }

    // Hash password with a salt factor of 10
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// --- Instance Method: Compare Password ---
userSchema.methods.matchPassword = async function(enteredPassword) {
    // 'this.password' will contain the hashed password from the database
    // since we use findById/findOne in the controller which explicitly selects the password.
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;