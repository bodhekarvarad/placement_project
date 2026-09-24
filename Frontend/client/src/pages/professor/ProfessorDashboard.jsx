import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../../components/Navbar.jsx";
import AssignmentCard from "../../components/AssignmentCard.jsx";

import {
  getAssignments,
  deleteAssignment,
} from "../../services/assignmentService.js";

const ProfessorDashboard = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAssignments();

      setAssignments(data.assignments);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load assignments."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this assignment?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteAssignment(id);

      setAssignments((previous) =>
        previous.filter(
          (assignment) => assignment._id !== id
        )
      );
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to delete assignment."
      );
    }
  };

  return (
    <>
      <Navbar />

      <main className="dashboard">
        <div className="dashboard-header">
          <div>
            <h1>Professor Dashboard</h1>
            <p>
              Manage your assignments and submissions.
            </p>
          </div>

          <Link
            to="/professor/assignments/create"
            className="button primary-button"
          >
            + Create Assignment
          </Link>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {loading ? (
          <p>Loading assignments...</p>
        ) : assignments.length === 0 ? (
          <div className="empty-state">
            <h2>No assignments yet</h2>

            <p>
              Create your first assignment to get started.
            </p>

            <Link
              to="/professor/assignments/create"
              className="button primary-button"
            >
              Create Assignment
            </Link>
          </div>
        ) : (
          <div className="assignment-grid">
            {assignments.map((assignment) => (
              <AssignmentCard
                key={assignment._id}
                assignment={assignment}
                role="professor"
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>
    </>
  );
};

export default ProfessorDashboard;

