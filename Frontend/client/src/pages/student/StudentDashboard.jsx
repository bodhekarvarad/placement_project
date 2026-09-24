import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar.jsx";
import AssignmentCard from "../../components/AssignmentCard.jsx";
import { getAssignments } from "../../services/assignmentService.js";

const StudentDashboard = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);

        const data = await getAssignments();

        setAssignments(data.assignments || []);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Failed to load assignments."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  return (
    <>
      <Navbar />

      <main className="dashboard">
        <div className="dashboard-header">
          <div>
            <h1>Student Dashboard</h1>
            <p>
              View assignments and submit your work.
            </p>
          </div>
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
            <h2>No assignments available</h2>
            <p>
              There are currently no assignments.
            </p>
          </div>
        ) : (
          <div className="assignment-grid">
            {assignments.map((assignment) => (
              <AssignmentCard
                key={assignment._id}
                assignment={assignment}
                role="student"
              />
            ))}
          </div>
        )}
      </main>
    </>
  );
};

export default StudentDashboard;

