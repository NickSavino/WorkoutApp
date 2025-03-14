import React from "react";
import { useAuth } from "../context/AuthContext";

const Navbar: React.FC = () => {
    const { logout } = useAuth();

    return (
        <nav className="bg-midnightBlue text-white py-4 px-6 flex justify-between items-center shadow-md">
            <h1 className="text-xl font-bold tracking-wide">Jym</h1>

            <button 
                onClick={logout} 
                className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-md transition"
            >
                Logout
            </button>
        </nav>
    );
};

export default Navbar;
