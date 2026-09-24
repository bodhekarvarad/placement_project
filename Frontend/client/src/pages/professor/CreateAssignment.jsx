import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Navbar from "../../components/Navbar.jsx";
import {
  createAssignment,
} from "../../services/assignmentService.js";

const CreateAssignment = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    description: "",
    deadline: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (
      !formData.title.trim() ||
      !formData.subject.trim() ||
      !formData.deadline
    ) {
      setError(
        "Title, subject and deadline are required."
      );

      return;
    }

    const selectedDeadline = new Date(
      formData.deadline
    );

    if (selectedDeadline <= new Date()) {
      setError(
        "Deadline must be in the future."
      );

      return;
    }

    try {
      setLoading(true);

      await createAssignment({
        title: formData.title.trim(),
        subject: formData.subject.trim(),
        description: formData.description.trim(),
        deadline: selectedDeadline.toISOString(),
      });

      navigate("/professor/dashboard");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to create assignment."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="form-page">
        <div className="form-container">
          <div className="form-header">
            <h1>Create Assignment</h1>

            <Link to="/professor/dashboard">
              ← Back to Dashboard
            </Link>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="assignment-form"
          >
            <div className="form-group">
              <label htmlFor="title">
                Title *
              </label>

              <input
                id="title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. React Assignment"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">
                Subject *
              </label>

              <input
                id="subject"
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="e.g. Web Development"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">
                Description
              </label>

              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the assignment..."
                rows="5"
              />
            </div>

            <div className="form-group">
              <label htmlFor="deadline">
                Deadline *
              </label>

              <input
                id="deadline"
                type="datetime-local"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-actions">
              <Link
                to="/professor/dashboard"
                className="button secondary-button"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={loading}
                className="button primary-button"
              >
                {loading
                  ? "Creating..."
                  : "Create Assignment"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
};

export default CreateAssignment;

