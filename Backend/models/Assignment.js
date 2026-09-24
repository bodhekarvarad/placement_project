import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: 1,
      maxlength: 200,
    },

    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
      minlength: 1,
      maxlength: 100,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },

    deadline: {
      type: Date,
      required: [true, "Deadline is required"],
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Creator is required"],
    },
  },
  {
    timestamps: true,
  },
);

const Assignment = mongoose.model("Assignment", assignmentSchema);

export default Assignment;
