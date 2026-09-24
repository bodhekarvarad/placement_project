import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    assignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: [true, "Assignment reference is required"],
    },

    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Student reference is required"],
    },

    content: {
      type: String,
      required: [true, "Submission content is required"],
      trim: true,
      minlength: 1,
      maxlength: 10000,
    },

    submittedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

// Prevent duplicate submissions for the same student + assignment
submissionSchema.index(
  {
    assignmentId: 1,
    studentId: 1,
  },
  {
    unique: true,
  },
);

const Submission = mongoose.model("Submission", submissionSchema);

export default Submission;
