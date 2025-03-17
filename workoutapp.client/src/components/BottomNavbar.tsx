import React from "react";
import { useNavigate } from "react-router-dom";

const BottomNav: React.FC = () => {
  const navigate = useNavigate();

  return (
    <nav className="bg-[#26455D] text-white flex justify-around items-center p-4">
      <button onClick={() => navigate("/home")}>Home</button>
      <button onClick={() => console.log("Profile")}>Profile</button>
      <button onClick={() => console.log("Workout")}>Workout</button>
      <button onClick={() => console.log("Stats")}>Stats</button>
      <button onClick={() => console.log("Settings")}>Settings</button>
    </nav>
  );
};

export default BottomNav;