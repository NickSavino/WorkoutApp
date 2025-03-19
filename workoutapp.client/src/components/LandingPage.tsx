import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { useAuth } from "../context/AuthContext";
import WorkoutService from "../services/WorkoutService";

const LandingPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [displayedWorkout, setDisplayedWorkout] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const getWorkouts = async () => {
      try {
        setLoading(true);
        if (user) {
          const workouts = await WorkoutService.getWorkoutsByUserId(user.id);
          if (workouts.length > 0) {
            console.log("Workouts found");
            setDisplayedWorkout(workouts[0].name);
          } else {
            console.log("No workouts found");
            setDisplayedWorkout(null);
          }
        }
      } catch (err) {
        setLoading(false);
        console.error(err);
      }
      setLoading(false);
    };

    if (user) {
      console.log("User found, getting workouts...");
      getWorkouts();
    }
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col bg-[#C3E0E5]">
      <Navbar />
      <div className="flex-1 flex flex-col justify-center px-8">
        <div className="flex justify-between items-start">
          <h1 className="text-4xl font-bold text-[#26455D]">Welcome to Jym</h1>
          <div>
            <p className="text-xl text-[#26455D]">Last Workout:</p>
            {loading ? (
              <text className="text-xl text-[#26455D]">Loading...</text>
            ) : displayedWorkout ? (
              <text className="text-4xl font-bold text-[#26455D]">{displayedWorkout}</text>
            ) : (
              <text className="text-xl text-[#26455D]">No workouts found</text>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
