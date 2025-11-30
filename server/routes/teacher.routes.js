// routes/teacher.routes.js
import express from "express";
import { protect, restrictTo } from "../middleware/auth.middleware.js";
import { createClass, getTeacherClasses } from "../controllers/college.controller.js";
import { getTeacherSubmissions, checkPractical, getSingleSubmission, getApprovedSubmissions } from "../controllers/practical.controller.js";

const router = express.Router();

router.use(protect, restrictTo("Teacher"));

router.post("/classes", createClass);
router.get("/classes", getTeacherClasses);

router.get("/submissions", getTeacherSubmissions);
router.put("/submissions/:practicalId", checkPractical);
// routes/teacher.routes.js
router.get('/submissions/:id', getSingleSubmission);

router.get("/approved-submissions", getApprovedSubmissions);

export default router;
