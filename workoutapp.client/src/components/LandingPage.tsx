import React from "react";
import Navbar from "./Navbar";
import BottomNav from "./BottomNavbar";

const LandingPage: React.FC = () => {
  const workoutDummyData = {
    name: "Leg Day",
    created_at: "2021-10-19T00:00:00.000Z",
    updated_at: "2022-10-19T00:00:00.000Z",
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#C3E0E5]">
      <Navbar />
      <div className="flex-1 flex flex-col justify-center px-8">
        <div className="flex justify-between items-start">
          <h1 className="text-4xl font-bold text-[#26455D]">Welcome to Jym</h1>
          <div>
            <p className="text-xl text-[#26455D]">Last Workout:</p>
            <button
              onClick={() => console.log("Go to workout")}
              className="bg-[#26455D] hover:bg-red-700 text-white px-4 py-2 rounded-md transition"
            >
              {workoutDummyData.name}
            </button>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default LandingPage;
