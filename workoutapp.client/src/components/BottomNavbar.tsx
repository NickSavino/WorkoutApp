import React from "react";
import { FaList } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const BottomNav: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-darkBlue text-white flex justify-around py-3 shadow-lg">
      <NavLink
        to="/home"
        className={({ isActive }) =>
          `transition ${isActive ? "text-white" : "text-babyBlue hover:text-white"}`
        }
      >
        Home
      </NavLink>
      <NavLink
        to="/profile"
        className={({ isActive }) =>
          `transition ${isActive ? "text-white" : "text-babyBlue hover:text-white"}`
        }
      >
        Profile
      </NavLink>
      <NavLink
        to="/exercises"
        className={({ isActive }) =>
          `flex flex-col items-center transition ${
            isActive ? "text-white" : "text-gray-500 hover:text-white"
          }`
        }
      >
        <FaList className="text-lg mb-1" />
        Exercises
      </NavLink>
      <NavLink
        to="/stats"
        className={({ isActive }) =>
          `transition ${isActive ? "text-white" : "text-babyBlue hover:text-white"}`
        }
      >
        Stats
      </NavLink>
      <NavLink
        to="/settings"
        className={({ isActive }) =>
          `transition ${isActive ? "text-white" : "text-babyBlue hover:text-white"}`
        }
      >
        Settings
      </NavLink>
    </div>
  );
};

export default BottomNav;