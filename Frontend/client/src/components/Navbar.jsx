import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link
          to={
            user.role === "professor"
              ? "/professor/dashboard"
              : "/student/dashboard"
          }
          className="navbar-brand"
        >
          Assignment Manager
        </Link>

        <div className="navbar-right">
          <span className="navbar-user">
            {user.name}
          </span>

          <span className="navbar-role">
            {user.role}
          </span>

          <button
            onClick={handleLogout}
            className="logout-button"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

