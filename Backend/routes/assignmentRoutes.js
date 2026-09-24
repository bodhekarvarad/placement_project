import express from "express";

import {
  createAssignment,
  getAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
} from "../controllers/assignmentController.js";

import { protect } from "../middleware/auth.js";
import { authorize } from "../middleware/role.js";

const router = express.Router();

// Get all assignments
// Professor + Student
router.get("/", protect, authorize("professor", "student"), getAssignments);

// Get single assignment
// Professor + Student
router.get(
  "/:id",
  protect,
  authorize("professor", "student"),
  getAssignmentById,
);

// Create assignment
// Professor only
router.post("/", protect, authorize("professor"), createAssignment);

// Update assignment
// Professor only
router.patch("/:id", protect, authorize("professor"), updateAssignment);

// Delete assignment
// Professor only
router.delete("/:id", protect, authorize("professor"), deleteAssignment);

export default router;
