import React from "react";
import { FaPlus } from "react-icons/fa";

const BottomNav: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-darkBlue text-white flex justify-around py-3 shadow-lg">
      <button className="text-babyBlue hover:text-white transition">Home</button>
      <button className="text-babyBlue hover:text-white transition">Profile</button>
      <button className="text-gray-500 flex flex-col items-center">
        <FaPlus className="text-lg mb-1" />
        New Workout
      </button>
      <button className="text-babyBlue hover:text-white transition">Stats</button>
      <button className="text-babyBlue hover:text-white transition">Settings</button>
    </div>
  );
};

export default BottomNav;