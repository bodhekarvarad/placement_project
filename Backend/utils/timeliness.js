export const calculateTimelinessStatus = ({
  submittedAt,
  deadline,
  currentTime = new Date(),
}) => {
  const deadlineTime = new Date(deadline);
  const current = new Date(currentTime);

  // No submission
  if (!submittedAt) {
    if (current <= deadlineTime) {
      return "Pending";
    }

    return "Missing";
  }

  const submissionTime = new Date(submittedAt);

  // Submitted exactly at or before deadline
  if (submissionTime <= deadlineTime) {
    return "On Time";
  }

  // Submitted after deadline
  return "Late";
};
