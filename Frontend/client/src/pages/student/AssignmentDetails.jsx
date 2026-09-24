import { useEffect, useState } from "react";
import {
  Link,
  useParams,
} from "react-router-dom";

import Navbar from "../../components/Navbar.jsx";

import {
  getAssignmentById,
} from "../../services/assignmentService.js";

import {
  getMySubmission,
} from "../../services/submissionService.js";

const AssignmentDetails = () => {
  const { id } = useParams();

  const [assignment, setAssignment] = useState(null);
  const [submission, setSubmission] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);

        const assignmentResponse =
          await getAssignmentById(id);

        setAssignment(
          assignmentResponse.assignment
        );

        try {
          const submissionResponse =
            await getMySubmission(id);

          setSubmission(
            submissionResponse.submission || null
          );
        } catch (submissionError) {
          // 404 means the student has not submitted yet.
          if (
            submissionError.response?.status !== 404
          ) {
            throw submissionError;
          }

          setSubmission(null);
        }
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Failed to load assignment."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

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

  if (error) {
    return (
      <>
        <Navbar />

        <main className="form-page">
          <div className="error-message">
            {error}
          </div>

          <Link to="/student/dashboard">
            ← Back to Dashboard
          </Link>
        </main>
      </>
    );
  }

  if (!assignment) {
    return null;
  }

  const deadline = new Date(
    assignment.deadline
  );

  const isDeadlinePassed =
    new Date() > deadline;

  let status = "Pending";

  if (submission?.status) {
    status = submission.status;
  } else if (isDeadlinePassed) {
    status = "Missing";
  }

  return (
    <>
      <Navbar />

      <main className="form-page">
        <div className="details-container">
          <Link to="/student/dashboard">
            ← Back to Dashboard
          </Link>

          <div className="details-header">
            <div>
              <span className="assignment-subject">
                {assignment.subject}
              </span>

              <h1>{assignment.title}</h1>
            </div>

            <div
              className={`status-badge status-${status
                .toLowerCase()
                .replace(" ", "-")}`}
            >
              {status}
            </div>
          </div>

          <div className="assignment-details">
            <h3>Description</h3>

            <p>
              {assignment.description ||
                "No description provided."}
            </p>

            <div className="deadline-box">
              <strong>Deadline</strong>

              <span>
                {deadline.toLocaleString()}
              </span>
            </div>
          </div>

          {submission ? (
            <div className="submission-box">
              <h2>Your Submission</h2>

              <p>
                <strong>Submitted At:</strong>{" "}
                {new Date(
                  submission.submittedAt
                ).toLocaleString()}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {submission.status}
              </p>

              <div className="submission-content">
                <strong>Content:</strong>

                <p>{submission.content}</p>
              </div>
            </div>
          ) : status === "Pending" ? (
            <div className="submit-section">
              <p>
                You have not submitted this assignment
                yet.
              </p>

              <Link
                to={`/student/assignments/${id}/submit`}
                className="button primary-button"
              >
                Submit Assignment
              </Link>
            </div>
          ) : (
            <div className="missing-section">
              <p>
                The deadline has passed and no
                submission was recorded.
              </p>

              <span className="status-badge status-missing">
                Missing
              </span>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default AssignmentDetails;

