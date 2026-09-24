import api from "./api.js";

// Submit assignment
export const submitAssignment = async (assignmentId, content) => {
  const response = await api.post(`/submissions/assignments/${assignmentId}`, {
    content,
  });

  return response.data;
};

// Get current student's submission
export const getMySubmission = async (assignmentId) => {
  const response = await api.get(`/submissions/assignments/${assignmentId}/my`);

  return response.data;
};

// Get all submissions for an assignment
// Professor only
export const getAssignmentSubmissions = async (assignmentId) => {
  const response = await api.get(`/submissions/assignments/${assignmentId}`);

  return response.data;
};
