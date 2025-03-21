import React, { useEffect } from "react";
import Navbar from "./Navbar";
import { useState } from "react";
import { ProfileStatsModel } from "../dtos/profile/ProfileStatsModel";
import { useAuth } from "../context/AuthContext";
import ProfileService from "../services/ProfileService";
import WorkoutService from "../services/WorkoutService";
import { WorkoutUpdateModel } from "../dtos/workout/WorkoutUpdateModel";
import ProfilePageModal from "./ProfilePageModal";
import ProfilePageWorkoutComponent from "./ProfilePageWorkoutComponent";

const ProfilePage: React.FC = () => {
  const authContext = useAuth();
  const user = authContext.user;
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileStats, setProfileStats] = useState<ProfileStatsModel | null>(
    null
  );
  const [workouts, setWorkouts] = useState<WorkoutUpdateModel[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const stats = await ProfileService.getProfileStats(user.id);
        const userWorkouts = await WorkoutService.getWorkoutsByUserId(user.id);
        setProfileStats(stats);
        setWorkouts(userWorkouts);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#C3E0E5]">
        <p className="text-xl font-medium text-[#26455D]">
          Loading your profile...
        </p>
      </div>
    );
  }

  if (!profileStats) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#C3E0E5]">
        <p className="text-xl font-medium text-[#26455D]">
          No profile data available.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#C3E0E5]">
      <Navbar />
      <main className="p-6 flex-1">
        {/* Only show profile and stats sections if user is not a guest */}
        {user?.name !== "Guest" && (
          <>
            <section className="bg-white shadow rounded-lg p-6 mb-6">
              <h2 className="text-2xl text-[#26455D] font-bold mb-4">Profile</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold">Username:</p>
                  <p>{user?.name}</p>
                </div>
                <div>
                  <p className="font-semibold">Email:</p>
                  <p>{user?.email}</p>
                </div>
                <div>
                  <p className="font-semibold">Member Since:</p>
                  <p>{new Date().toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="font-semibold">Last Update:</p>
                  <p>{new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </section>

            {/* Workout Stats Card */}
            <section className="bg-white shadow rounded-lg p-6 mb-6">
              <h2 className="text-2xl text-[#26455D] font-bold mb-4">
                Workout Stats
              </h2>
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-1">
                  <p className="font-semibold">Total Workouts</p>
                  <p className="text-xl">{profileStats.totalWorkouts}</p>
                </div>
                <div className="flex-1">
                  <p className="font-semibold">Total Exercises</p>
                  <p className="text-xl">{profileStats.totalExercises}</p>
                </div>
                <div className="flex-1">
                  <p className="font-semibold">Total Reps</p>
                  <p className="text-xl">{profileStats.totalReps}</p>
                </div>
                <div className="flex-1">
                  <p className="font-semibold">Average Weight per Workout</p>
                  <p className="text-xl">{profileStats.averageWeight.toFixed(2)}</p>
                </div>
              </div>
            </section>
          </>
        )}
        
        {/* Show a message for guest users */}
        {user?.name === "Guest" && (
          <section className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-2xl text-[#26455D] font-bold mb-4">Guest Mode</h2>
            <p className="mb-2">You are currently using Jym as a guest.</p>
            <p>Your workouts will not be saved after you log out.</p>
          </section>
        )}

        {/* Workouts List */}
        <section className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl text-[#26455D] font-bold mb-4">
            Your Workouts
          </h2>
          <div className="max-h-96 overflow-y-auto space-y-4">
            {workouts.map((workout, index) => (
              <ProfilePageWorkoutComponent
                key={index}
                index={index}
                workoutModel={workout}
                loading={loading}
                setAiResponse={setAiResponse}
                setShowModal={setShowModal}
                setLoading={setLoading}
              />
            ))}
          </div>
        </section>
      </main>
      {/* Modal for AI Response */}
      <ProfilePageModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="AI Validation"
      >
        {aiResponse}
      </ProfilePageModal>
    </div>
  );
};

export default ProfilePage;
