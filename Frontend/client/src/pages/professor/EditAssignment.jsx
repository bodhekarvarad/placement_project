import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import Navbar from "../../components/Navbar.jsx";

import {
  getAssignmentById,
  updateAssignment,
} from "../../services/assignmentService.js";

const EditAssignment = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    description: "",
    deadline: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const data = await getAssignmentById(id);

        const assignment = data.assignment;

        const localDeadline = new Date(
          assignment.deadline
        );

        const formattedDeadline = new Date(
          localDeadline.getTime() -
            localDeadline.getTimezoneOffset() * 60000
        )
          .toISOString()
          .slice(0, 16);

        setFormData({
          title: assignment.title,
          subject: assignment.subject,
          description: assignment.description || "",
          deadline: formattedDeadline,
        });
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Failed to load assignment."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAssignment();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const deadline = new Date(
      formData.deadline
    );

    if (deadline <= new Date()) {
      setError(
        "Deadline must be in the future."
      );

      return;
    }

    try {
      setSaving(true);

      await updateAssignment(id, {
        title: formData.title.trim(),
        subject: formData.subject.trim(),
        description: formData.description.trim(),
        deadline: deadline.toISOString(),
      });

      navigate("/professor/dashboard");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to update assignment."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="form-page">
          <p>Loading assignment...</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="form-page">
        <div className="form-container">
          <div className="form-header">
            <h1>Edit Assignment</h1>

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
                disabled={saving}
                className="button primary-button"
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
};

export default EditAssignment;

