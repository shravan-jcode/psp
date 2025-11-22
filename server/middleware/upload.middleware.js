// middlewares/upload.middleware.js
import multer from 'multer';

// 1. Configure Multer to store the file in memory
// Storing as a buffer allows us to upload directly to Cloudinary without saving locally first.
const storage = multer.memoryStorage();

// 2. File Filter to allow only specific file types (PDF and DOCX)
const fileFilter = (req, file, cb) => {
    // Check if the file MIME type is PDF or Word document (docx)
    if (file.mimetype === 'application/pdf' || 
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        cb(null, true); // Accept the file
    } else {
        // Reject the file and pass an error
        cb(new Error('Invalid file type. Only PDF and DOCX files are allowed.'), false);
    }
};

// 3. Initialize the Multer upload instance
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 10 // 10 MB limit per file
    }
});

// We export the configured upload middleware
// .single('practicalFile') will expect the file field name in the form data to be 'practicalFile'
const uploadPracticalFile = upload.single('practicalFile'); 

export default uploadPracticalFile;