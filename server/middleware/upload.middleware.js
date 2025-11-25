// middlewares/upload.middleware.js
import multer from 'multer';

// 1. Configure Multer to store the file in memory
// Storing as a buffer allows us to upload directly to Cloudinary without saving locally first.
const storage = multer.memoryStorage();

// 2. File Filter to allow only specific file types (PDF and DOCX)
const fileFilter = (req, file, cb) => {
    const allowed = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/msword' // .doc (older MS Word)
    ];

    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only PDF and DOC/DOCX files are allowed.'), false);
    }
};


// 3. Initialize the Multer upload instance
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 70 // 10 MB limit per file
    }
});

// We export the configured upload middleware
// .single('practicalFile') will expect the file field name in the form data to be 'practicalFile'
const uploadPracticalFile = upload.single('practicalFile'); 

export default uploadPracticalFile;