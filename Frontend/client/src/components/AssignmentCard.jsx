import { Link } from "react-router-dom";

const AssignmentCard = ({
  assignment,
  role,
  onEdit,
  onDelete,
}) => {
  const deadline = new Date(
    assignment.deadline
  ).toLocaleString();

  return (
    <div className="assignment-card">
      <div className="assignment-card-header">
        <h3>{assignment.title}</h3>

        <span className="assignment-subject">
          {assignment.subject}
        </span>
      </div>

      <p className="assignment-description">
        {assignment.description || "No description provided."}
      </p>

      <div className="assignment-info">
        <p>
          <strong>Deadline:</strong>{" "}
          {deadline}
        </p>

        {assignment.createdBy && (
          <p>
            <strong>Professor:</strong>{" "}
            {assignment.createdBy.name}
          </p>
        )}
      </div>

      <div className="assignment-actions">
        {role === "student" && (
          <Link
            to={`/student/assignments/${assignment._id}`}
            className="button primary-button"
          >
            View Assignment
          </Link>
        )}

        {role === "professor" && (
          <>
            <Link
              to={`/professor/assignments/${assignment._id}/edit`}
              className="button edit-button"
            >
              Edit
            </Link>

            <button
              onClick={() => onDelete(assignment._id)}
              className="button delete-button"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AssignmentCard;

