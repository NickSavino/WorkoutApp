import React from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-[#26455D] text-white p-4">
      <div className="flex justify-between items-center">
        <h2
          className="text-2xl font-bold cursor-pointer"
          onClick={() => navigate("/home")}
        >
          Jym
        </h2>
        <nav className="flex items-center space-x-4 pr-2">
          <button
            onClick={() => navigate("/profile")}
            className="hover:cursor-pointer hover:underline"
          >
            Profile-(TEST)
          </button>
          <button
            onClick={() => navigate("/workout")}
            className="hover:cursor-pointer hover:underline"
          >
            Workout
          </button>
          {user ? (
            <button onClick={logout} className="hover:text-red-500 text-white">
              Logout
            </button>
          ) : (
            <Link to="/login" className="hover:underline text-white rounded-md">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
