import { useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import Navbar from "../../components/Navbar.jsx";

import {
  submitAssignment,
} from "../../services/submissionService.js";

const SubmitAssignment = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!content.trim()) {
      setError(
        "Submission content is required."
      );

      return;
    }

    try {
      setLoading(true);

      await submitAssignment(
        id,
        content.trim()
      );

      navigate(
        `/student/assignments/${id}`
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to submit assignment."
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
            <div>
              <h1>Submit Assignment</h1>

              <p>
                Submit your solution below.
              </p>
            </div>

            <Link
              to={`/student/assignments/${id}`}
            >
              ← Back
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
              <label htmlFor="content">
                Submission *
              </label>

              <textarea
                id="content"
                value={content}
                onChange={(e) =>
                  setContent(e.target.value)
                }
                placeholder="Enter your solution or paste a URL..."
                rows="12"
                maxLength={10000}
                required
              />

              <small>
                {content.length}/10000 characters
              </small>
            </div>

            <div className="submission-note">
              <strong>Important:</strong>

              <p>
                Your submission timestamp will be
                recorded automatically by the server.
                You cannot manually change the
                submission time.
              </p>
            </div>

            <div className="form-actions">
              <Link
                to={`/student/assignments/${id}`}
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
                  ? "Submitting..."
                  : "Submit Assignment"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
};

export default SubmitAssignment;

