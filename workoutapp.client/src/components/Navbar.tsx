import React from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-[#26455D] text-white p-4">
      <div className="flex justify-between items-start">
        <h2 className="text-2xl font-bold">Jym</h2>
        {user ? (
          <button onClick={logout} className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-md transition">
            Logout
          </button>
          ):(
          <Link to="/login" className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition">
            Login
          </Link>
          )}
        </div>
    </header>
  );
};

export default Navbar;