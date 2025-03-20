import React from "react";
import { WorkoutUpdateModel } from "../dtos/workout/WorkoutUpdateModel";
import { getBotResponse } from "../helperFunctions/AiFunctions";

interface WorkoutComponentProps {
  index: number;
  workoutModel: WorkoutUpdateModel;
  loading: boolean;
  setAiResponse: (response: string) => void;
  setShowModal: (show: boolean) => void;
  setLoading: (loading: boolean) => void;
}

const ProfilePageWorkoutComponent: React.FC<WorkoutComponentProps> = ({
  index,
  workoutModel,
  loading,
  setAiResponse,
  setShowModal,
  setLoading,
}) => {
  return (
    <div key={index} className="border border-gray-300 rounded-lg p-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-bold">{workoutModel.name}</h3>
        <p className="text-sm text-gray-600">
          {new Date().toLocaleDateString()}
        </p>
      </div>
      <ul className="list-disc pl-5 space-y-1">
        {workoutModel.workoutExercises.map((ex, exIndex) => (
          <li key={exIndex}>
            <span className="font-semibold">{ex.exerciseName}:</span> {ex.sets}{" "}
            sets of {ex.reps} reps @ {ex.weight} lbs
          </li>
        ))}
      </ul>
      <button
        className="mt-4 bg-[#26455D] text-white px-4 py-2 rounded-lg cursor-pointer"
        onClick={() =>
          getBotResponse(workoutModel, setAiResponse, setShowModal, setLoading)
        }
        disabled={loading}
      >
        <text>{loading ? "Loading..." : "Get AI Validation"}</text>
      </button>
    </div>
  );
};

export default ProfilePageWorkoutComponent;
