import React from "react";
import { useAuth } from "../context/AuthContext";

const Navbar: React.FC = () => {
  const { logout } = useAuth();

  return (
    <header className="bg-[#26455D] text-white p-4">
      <div className="flex justify-between items-start">
        <h2 className="text-2xl font-bold">Jym</h2>
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-md transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;