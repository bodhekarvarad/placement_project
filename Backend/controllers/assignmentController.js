import Assignment from "../models/Assignment.js";

// Create assignment
export const createAssignment = async (req, res) => {
  try {
    const { title, subject, description, deadline } = req.body;

    // Required fields
    if (!title || !subject || !deadline) {
      return res.status(400).json({
        success: false,
        message: "Title, subject and deadline are required",
      });
    }

    const deadlineDate = new Date(deadline);

    // Validate date
    if (Number.isNaN(deadlineDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid deadline",
      });
    }

    // Deadline must be in the future
    if (deadlineDate <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Deadline must be in the future",
      });
    }

    const assignment = await Assignment.create({
      title: title.trim(),
      subject: subject.trim(),
      description: description?.trim() || "",
      deadline: deadlineDate,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Assignment created successfully",
      assignment,
    });
  } catch (error) {
    console.error("Create assignment error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get all assignments
export const getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .populate("createdBy", "name email")
      .sort({ deadline: 1 });

    res.status(200).json({
      success: true,
      count: assignments.length,
      assignments,
    });
  } catch (error) {
    console.error("Get assignments error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get assignment by ID
export const getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id).populate(
      "createdBy",
      "name email",
    );

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    res.status(200).json({
      success: true,
      assignment,
    });
  } catch (error) {
    console.error("Get assignment error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Update assignment
export const updateAssignment = async (req, res) => {
  try {
    const { title, subject, description, deadline } = req.body;

    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    // Only creator can edit
    if (assignment.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only edit your own assignments",
      });
    }

    if (deadline !== undefined) {
      const deadlineDate = new Date(deadline);

      if (Number.isNaN(deadlineDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid deadline",
        });
      }

      if (deadlineDate <= new Date()) {
        return res.status(400).json({
          success: false,
          message: "Deadline must be in the future",
        });
      }

      assignment.deadline = deadlineDate;
    }

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({
          success: false,
          message: "Title cannot be empty",
        });
      }

      assignment.title = title.trim();
    }

    if (subject !== undefined) {
      if (!subject.trim()) {
        return res.status(400).json({
          success: false,
          message: "Subject cannot be empty",
        });
      }

      assignment.subject = subject.trim();
    }

    if (description !== undefined) {
      assignment.description = description.trim();
    }

    await assignment.save();

    res.status(200).json({
      success: true,
      message: "Assignment updated successfully",
      assignment,
    });
  } catch (error) {
    console.error("Update assignment error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Delete assignment
export const deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    // Only creator can delete
    if (assignment.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own assignments",
      });
    }

    await Assignment.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Assignment deleted successfully",
    });
  } catch (error) {
    console.error("Delete assignment error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
