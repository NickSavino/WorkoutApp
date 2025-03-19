import React from "react";
import Navbar from "./Navbar";
import OpenAI from "openai";
import { useState } from "react";

const ProfilePage: React.FC = () => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY ?? "";
  const openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true,
  });

  const workoutDummyData = [
    {
      name: "Leg Day",
      created_at: "2021-10-19T00:00:00.000Z",
      updated_at: "2022-10-19T00:00:00.000Z",
      exercise: [
        {
          name: "Squats",
          sets: 4,
          reps: 12,
          weight: 135,
          created_at: "2021-10-19T00:00:00.000Z",
          updated_at: "2022-10-19T00:00:00.000Z",
        },
        {
          name: "Lunges",
          sets: 4,
          reps: 12,
          weight: 135,
          created_at: "2021-10-19T00:00:00.000Z",
          updated_at: "2022-10-19T00:00:00.000Z",
        },
        {
          name: "Leg Press",
          sets: 4,
          reps: 12,
          weight: 135,
          created_at: "2021-10-19T00:00:00.000Z",
          updated_at: "2022-10-19T00:00:00.000Z",
        },
      ],
    },
    {
      name: "Chest Day",
      created_at: "2021-10-19T00:00:00.000Z",
      updated_at: "2022-10-19T00:00:00.000Z",
      exercise: [
        {
          name: "Bench Press",
          sets: 4,
          reps: 12,
          weight: 135,
          created_at: "2021-10-19T00:00:00.000Z",
          updated_at: "2022-10-19T00:00:00.000Z",
        },
        {
          name: "Incline Bench Press",
          sets: 4,
          reps: 12,
          weight: 135,
          created_at: "2021-10-19T00:00:00.000Z",
          updated_at: "2022-10-19T00:00:00.000Z",
        },
      ],
    },
    {
      name: "Chest Day 2",
      created_at: "2021-10-19T00:00:00.000Z",
      updated_at: "2022-10-19T00:00:00.000Z",
      exercise: [
        {
          name: "Bench Press",
          sets: 4,
          reps: 12,
          weight: 135,
          created_at: "2021-10-19T00:00:00.000Z",
          updated_at: "2022-10-19T00:00:00.000Z",
        },
        {
          name: "Incline Bench Press",
          sets: 4,
          reps: 12,
          weight: 135,
          created_at: "2021-10-19T00:00:00.000Z",
          updated_at: "2022-10-19T00:00:00.000Z",
        },
      ],
    },
  ];

  const userDummyData = {
    username: "testuser",
    email: "test@jym.com",
    created_at: "2021-10-19T00:00:00.000Z",
    updated_at: "2022-10-19T00:00:00.000Z",
  };

  // Calculate some workout stats
  const totalWorkouts = workoutDummyData.length;
  const totalExercises = workoutDummyData.reduce(
    (sum, workout) => sum + workout.exercise.length,
    0
  );
  const avgExercisesPerWorkout = (totalExercises / totalWorkouts).toFixed(2);

  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const getBotResponse = async (
    workout: {
      name: string;
      created_at: string;
      updated_at: string;
      exercise: {
        name: string;
        sets: number;
        reps: number;
        weight: number;
        created_at: string;
        updated_at: string;
      }[];
    },
    setAiResponse: (response: string) => void,
    setShowModal: (show: boolean) => void
  ) => {
    setLoading(true);
    const prompt = `This is a workout a user built: ${JSON.stringify(
      workout
    )}. Act as a professional trainer and give feedback on whether this workout is good or bad and why. Give response in paragraph form and brief.`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
      });

      if (response.choices[0].message.content) {
        setAiResponse(response.choices[0].message.content);
      } else {
        setAiResponse("No content received from AI.");
      }
      setShowModal(true);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching response:", error);
      setAiResponse("An error occurred while validating the workout.");
      setShowModal(true);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#C3E0E5]">
      <Navbar />
      <main className="p-6 flex-1">
        {/* User Profile Card */}
        <section className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-2xl text-[#26455D] font-bold mb-4">Profile</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Username:</p>
              <p>{userDummyData.username}</p>
            </div>
            <div>
              <p className="font-semibold">Email:</p>
              <p>{userDummyData.email}</p>
            </div>
            <div>
              <p className="font-semibold">Member Since:</p>
              <p>{new Date(userDummyData.created_at).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="font-semibold">Last Update:</p>
              <p>{new Date(userDummyData.updated_at).toLocaleDateString()}</p>
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
              <p className="text-xl">{totalWorkouts}</p>
            </div>
            <div className="flex-1">
              <p className="font-semibold">Total Exercises</p>
              <p className="text-xl">{totalExercises}</p>
            </div>
            <div className="flex-1">
              <p className="font-semibold">Average Exercises per Workout</p>
              <p className="text-xl">{avgExercisesPerWorkout}</p>
            </div>
          </div>
        </section>

        {/* Workouts List */}
        <section className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl text-[#26455D] font-bold mb-4">
            Your Workouts
          </h2>
          <div className="max-h-96 overflow-y-auto space-y-4">
            {workoutDummyData.map((workout, index) => (
              <div
                key={index}
                className="border border-gray-300 rounded-lg p-4"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-bold">{workout.name}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(workout.created_at).toLocaleDateString()}
                  </p>
                </div>
                <ul className="list-disc pl-5 space-y-1">
                  {workout.exercise.map((ex, exIndex) => (
                    <li key={exIndex}>
                      <span className="font-semibold">{ex.name}:</span>{" "}
                      {ex.sets} sets of {ex.reps} reps @ {ex.weight} lbs
                    </li>
                  ))}
                </ul>
                <button
                  className="mt-4 bg-[#26455D] text-white px-4 py-2 rounded-lg cursor-pointer"
                  onClick={() =>
                    getBotResponse(workout, setAiResponse, setShowModal)
                  }
                  disabled={loading}
                >
                  <text>{loading ? "Loading..." : "Get AI Validation"}</text>
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
      {/* Modal for AI Response */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center p-4 bg-opacity-50 backdrop-blur-md">
          <div className="bg-[#C3E0E5] p-6 rounded-lg shadow-lg max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-2">AI Validation</h2>
            <div className="bg-white text-gray-800 max-h-[60vh] overflow-y-auto p-2 border border-gray-300 rounded">
              {aiResponse}
            </div>
            <button
              className="mt-4 bg-[#26455D] text-white px-4 py-2 rounded-lg w-full cursor-pointer"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
