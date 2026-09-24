import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider, useAuth } from "./context/AuthContext.jsx";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

import ProfessorDashboard from "./pages/professor/ProfessorDashboard.jsx";
import CreateAssignment from "./pages/professor/CreateAssignment.jsx";
import EditAssignment from "./pages/professor/EditAssignment.jsx";

import StudentDashboard from "./pages/student/StudentDashboard.jsx";
import AssignmentDetails from "./pages/student/AssignmentDetails.jsx";
import SubmitAssignment from "./pages/student/SubmitAssignment.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx";

const HomeRedirect = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === "professor") {
    return (
      <Navigate
        to="/professor/dashboard"
        replace
      />
    );
  }

  return (
    <Navigate
      to="/student/dashboard"
      replace
    />
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* Home */}
          <Route path="/" element={<HomeRedirect />} />

          {/* Authentication */}
          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          {/* ========================= */}
          {/* PROFESSOR ROUTES */}
          {/* ========================= */}

          <Route
            path="/professor/dashboard"
            element={
              <ProtectedRoute role="professor">
                <ProfessorDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/professor/assignments/create"
            element={
              <ProtectedRoute role="professor">
                <CreateAssignment />
              </ProtectedRoute>
            }
          />

          <Route
            path="/professor/assignments/:id/edit"
            element={
              <ProtectedRoute role="professor">
                <EditAssignment />
              </ProtectedRoute>
            }
          />

          {/* ========================= */}
          {/* STUDENT ROUTES */}
          {/* ========================= */}

          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute role="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/assignments/:id"
            element={
              <ProtectedRoute role="student">
                <AssignmentDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/assignments/:id/submit"
            element={
              <ProtectedRoute role="student">
                <SubmitAssignment />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route
            path="*"
            element={<HomeRedirect />}
          />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;

