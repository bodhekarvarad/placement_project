import Assignment from "../models/Assignment.js";
import Submission from "../models/Submission.js";
import { calculateTimelinessStatus } from "../utils/timeliness.js";

// Student submits assignment
export const createSubmission = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Submission content is required",
      });
    }

    const assignment = await Assignment.findById(assignmentId);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    // Prevent duplicate submissions
    const existingSubmission = await Submission.findOne({
      assignmentId,
      studentId: req.user._id,
    });

    if (existingSubmission) {
      return res.status(409).json({
        success: false,
        message: "You have already submitted this assignment",
      });
    }

    // Server timestamp
    const submittedAt = new Date();

    // Calculate status automatically
    const status = calculateTimelinessStatus({
      submittedAt,
      deadline: assignment.deadline,
    });

    const submission = await Submission.create({
      assignmentId,
      studentId: req.user._id,
      content: content.trim(),
      submittedAt,
    });

    res.status(201).json({
      success: true,
      message: "Assignment submitted successfully",
      submission: {
        id: submission._id,
        assignmentId: submission.assignmentId,
        studentId: submission.studentId,
        content: submission.content,
        submittedAt: submission.submittedAt,
        status,
      },
    });
  } catch (error) {
    console.error("Create submission error:", error);

    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You have already submitted this assignment",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Student views their own submission
export const getMySubmission = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    const assignment = await Assignment.findById(assignmentId);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    const submission = await Submission.findOne({
      assignmentId,
      studentId: req.user._id,
    });

    // No submission
    if (!submission) {
      const status = calculateTimelinessStatus({
        submittedAt: null,
        deadline: assignment.deadline,
      });

      return res.status(200).json({
        success: true,
        submission: null,
        status,
      });
    }

    const status = calculateTimelinessStatus({
      submittedAt: submission.submittedAt,
      deadline: assignment.deadline,
    });

    res.status(200).json({
      success: true,
      submission: {
        id: submission._id,
        assignmentId: submission.assignmentId,
        content: submission.content,
        submittedAt: submission.submittedAt,
        status,
      },
    });
  } catch (error) {
    console.error("Get my submission error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Professor views submissions for an assignment
export const getAssignmentSubmissions = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    const assignment = await Assignment.findById(assignmentId);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    // Only assignment creator can view submissions
    if (assignment.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only view submissions for your assignments",
      });
    }

    const submissions = await Submission.find({
      assignmentId,
    })
      .populate("studentId", "name email")
      .sort({ submittedAt: 1 });

    const submissionsWithStatus = submissions.map((submission) => ({
      id: submission._id,
      student: submission.studentId,
      content: submission.content,
      submittedAt: submission.submittedAt,
      status: calculateTimelinessStatus({
        submittedAt: submission.submittedAt,
        deadline: assignment.deadline,
      }),
    }));

    res.status(200).json({
      success: true,
      assignment: {
        id: assignment._id,
        title: assignment.title,
        deadline: assignment.deadline,
      },
      submissions: submissionsWithStatus,
    });
  } catch (error) {
    console.error("Get submissions error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
