// routes/teacher.routes.js
import express from "express";
import { protect, restrictTo } from "../middleware/auth.middleware.js";
import { createClass, getTeacherClasses } from "../controllers/college.controller.js";
import { getTeacherSubmissions, checkPractical } from "../controllers/practical.controller.js";

const router = express.Router();

router.use(protect, restrictTo("Teacher"));

router.post("/classes", createClass);
router.get("/classes", getTeacherClasses);

router.get("/submissions", getTeacherSubmissions);
router.put("/submissions/:practicalId", checkPractical);

export default router;
