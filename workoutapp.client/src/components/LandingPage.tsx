import React from "react";
import BottomNav from "./BottomNavbar";
import Navbar from "./Navbar";

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#C3E0E5]">
        <Navbar/>
      <BottomNav />
    </div>
  );
};

export default LandingPage;
