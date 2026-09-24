import express from "express";

import {
  createSubmission,
  getMySubmission,
  getAssignmentSubmissions,
} from "../controllers/submissionController.js";

import { protect } from "../middleware/auth.js";
import { authorize } from "../middleware/role.js";

const router = express.Router();

// Student submits an assignment
router.post(
  "/assignments/:assignmentId",
  protect,
  authorize("student"),
  createSubmission,
);

// Student views their own submission
router.get(
  "/assignments/:assignmentId/my",
  protect,
  authorize("student"),
  getMySubmission,
);

// Professor views submissions for an assignment
router.get(
  "/assignments/:assignmentId",
  protect,
  authorize("professor"),
  getAssignmentSubmissions,
);

export default router;
