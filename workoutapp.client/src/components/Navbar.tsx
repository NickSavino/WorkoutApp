import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const { logout } = useAuth();
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
        <nav className="flex items-center space-x-2">
          <button onClick={() => console.log("Profile")}>Profile</button>
          <button onClick={() => console.log("Workout")}>Workout</button>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-md transition"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;