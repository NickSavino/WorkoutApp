import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { useAuth } from "../context/AuthContext";
import { ExerciseRowModel } from "../dtos/exercise/ExerciseRowModel";
import { WorkoutUpdateModel } from "../dtos/workout/WorkoutUpdateModel";
import WorkoutService from "../services/WorkoutService";
import ExerciseService from "../services/ExerciseService";
import { ExerciseType } from "../enums/ExerciseType";
import { WorkoutExerciseRowModel } from "../dtos/workout/WorkoutExerciseRowModel";
import { ExerciseUpdateModel } from "../dtos/exercise/ExerciseUpdateModel";
import { Link, useNavigate } from "react-router-dom";


const WorkoutPage: React.FC = () => {
  const authContext = useAuth();
  const user = authContext.user;
  const navigate = useNavigate();
  
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<number | null>(null);
  const [workouts, setWorkouts] = useState<WorkoutUpdateModel[]>([]);
  const [exercises, setExercises] = useState<ExerciseRowModel[]>([]);
  const [isCreatingWorkout, setIsCreatingWorkout] = useState(false);
  const [newWorkoutName, setNewWorkoutName] = useState("");
  const [selectedWorkoutExercises, setSelectedWorkoutExercises] = useState<WorkoutExerciseRowModel[]>([]);
  const [editingWorkoutId, setEditingWorkoutId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [editingExercise, setEditingExercise] = useState<ExerciseUpdateModel | null>(null);
  const [exerciseName, setExerciseName] = useState("");
  const [exerciseDescription, setExerciseDescription] = useState("");
  const [exerciseType, setExerciseType] = useState<ExerciseType>(ExerciseType.Arms);


  // Load user workouts on component mount
  useEffect(() => {
    fetchWorkoutsAndExercises();
  }, [user]);

  const muscleGroups = [
    { id: 1, name: "Arms", image: "/src/images/arms.jpg", exercises: exercises.filter(ex => ex.type === ExerciseType.Arms) },
    { id: 2, name: "Chest", image: "/src/images/chest.jpg", exercises: exercises.filter(ex => ex.type === ExerciseType.Chest) },
    { id: 3, name: "Back", image: "/src/images/back.jpg", exercises: exercises.filter(ex => ex.type === ExerciseType.Back) },
    { id: 4, name: "Legs", image: "/src/images/legs.jpg", exercises: exercises.filter(ex => ex.type === ExerciseType.Legs) },
    { id: 5, name: "Shoulders", image: "/src/images/shoulders.jpg", exercises: exercises.filter(ex => ex.type === ExerciseType.Shoulders) },
    { id: 6, name: "Core", image: "/src/images/core.jpg", exercises: exercises.filter(ex => ex.type === ExerciseType.Core) },
    { id: 7, name: "Cardio", image: "/src/images/cardio.jpg", exercises: exercises.filter(ex => ex.type === ExerciseType.Cardio) },
  ];

  const fetchWorkoutsAndExercises = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const [userWorkouts, allExercises] = await Promise.all([
        WorkoutService.getWorkoutsByUserId(user.id),
        ExerciseService.getAllExercises()
      ]);
      setWorkouts(userWorkouts);
      setExercises(allExercises);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMuscleGroupClick = (id: number) => {
    setSelectedMuscleGroup(id);
  };

  const handleBackToGroups = () => {
    setSelectedMuscleGroup(null);
  };

  const startNewWorkout = () => {
    setIsCreatingWorkout(true);
    setNewWorkoutName("");
    setSelectedWorkoutExercises([]);
    setEditingWorkoutId(null);
  };

  const cancelNewWorkout = () => {
    setIsCreatingWorkout(false);
    setNewWorkoutName("");
    setSelectedWorkoutExercises([]);
    setEditingWorkoutId(null);
  };

  const saveNewWorkout = async () => {
    if (!newWorkoutName.trim() || selectedWorkoutExercises.length === 0) {
      alert("Please provide a workout name and add at least one exercise");
      return;
    }

    try {
      const newWorkout: WorkoutUpdateModel = {
        id: editingWorkoutId ?? 0,
        name: newWorkoutName,
        userId: user?.id ?? 0,
        workoutExercises: selectedWorkoutExercises,
      };

      if (editingWorkoutId !== null) {
        // Update existing workout
        await WorkoutService.updateWorkout(newWorkout);
      } else {
        // Create new workout
        await WorkoutService.createWorkout(newWorkout);
        
      }

      fetchWorkoutsAndExercises();
      setIsCreatingWorkout(false);
      setNewWorkoutName("");
      setSelectedWorkoutExercises([]);
      setEditingWorkoutId(null);
    } catch (error) {
      console.error("Error saving workout:", error);
      alert("Failed to save workout. Please try again.");
    }
  };

  const editWorkout = (workout: WorkoutUpdateModel) => {
    setIsCreatingWorkout(true);
    setNewWorkoutName(workout.name);
    setSelectedWorkoutExercises(workout.workoutExercises);
    setEditingWorkoutId(workout.id);
  };

  const deleteWorkout = async (workoutId: number) => {
    if (confirm("Are you sure you want to delete this workout?")) {
      try {
        await WorkoutService.deleteWorkout(workoutId);
        setWorkouts(workouts.filter(workout => workout.id !== workoutId));
      } catch (error) {
        console.error("Error deleting workout:", error);
        alert("Failed to delete workout. Please try again.");
      }
    }
  };

  const addExerciseToWorkout = (exercise: ExerciseRowModel) => {
    const workoutExerciseToAdd: WorkoutExerciseRowModel = {
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      reps: 0,
      sets: 0,
      type: exercise.type,
      notes: "",
      weight: 0,
    }

    // Check if already added
    if (!selectedWorkoutExercises.some(ex => ex.exerciseId === workoutExerciseToAdd.exerciseId)) {
      setSelectedWorkoutExercises([...selectedWorkoutExercises, workoutExerciseToAdd]);
    }
  };

const updateWorkoutExercise = (exerciseId: number, field: keyof WorkoutExerciseRowModel, value: string | number) => {
  setSelectedWorkoutExercises((prevExercises) =>
    prevExercises.map((exercise) =>
      exercise.exerciseId === exerciseId
        ? { ...exercise, [field]: value }
        : exercise
    )
  );
};

  const removeExerciseFromWorkout = (exerciseId: number) => {
    setSelectedWorkoutExercises((prevExercises) => {
      const updatedExercises = prevExercises.filter(exercise => exercise.exerciseId !== exerciseId);

      if (updatedExercises.length === 0 && editingWorkoutId !== null) {
        setEditingWorkoutId(editingWorkoutId);
      }

      return updatedExercises;
    });
  };

  const handleAddOrUpdateExercise = async () => {
    if (!exerciseName.trim()) {
        alert("Please enter a valid exercise name");
        return;
    }

    try {
        const exerciseToSave: ExerciseUpdateModel = {
            id: editingExercise?.id ?? 0,
            name: exerciseName,
            type: exerciseType,
            description: exerciseDescription,
        };

        await ExerciseService.addOrUpdateExercise(exerciseToSave);
        await fetchWorkoutsAndExercises();

        setEditingExercise(null);
        setExerciseName("");
        setExerciseDescription("");
    } catch (error) {
        console.error("Error saving exercise:", error);
        alert("Failed to save exercise.");
    }
  };

  const handleDeleteExercise = async (id: number) => {
    if (confirm("Are you sure you want to delete this exercise?")) {
        try {
            await ExerciseService.deleteExercise(id);
            await fetchWorkoutsAndExercises();
        } catch (error) {
            console.error("Error deleting exercise:", error);
            alert("Failed to delete exercise.");
        }
    }
  };


  const cancelEditExercise = () => {
    setEditingExercise(null);
    setExerciseName("");
    setExerciseDescription("");
};

  const startWorkoutTimer = (workout: WorkoutUpdateModel) => {
    navigate("/workout/timer", { state: { workout } });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#C3E0E5]">
        <div className="absolute top-2 left-2">
              <Link to="/home">
                  <div className="w-fit flex justify-between space-x-4 rounded-xl px-4 py-2 hover:underline hover:bg-[#96B8BF]">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
                      </svg>
                      <p>
                          Back to home
                      </p>
                  </div>
              </Link>
          </div>
        <p className="text-xl font-medium text-[#26455D]">Loading your workouts...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#C3E0E5]">
      <Navbar />
      <div className="flex-1 mx-2 md:mx-8 pb-20 ">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#26455D]">Exercises</h1>
          <div className="text-gray-600 text-sm">
            Hi, {user?.name || 'User'}
            {!authContext.user && <span className="ml-2 text-amber-500">(Test Mode)</span>}
          </div>
        </div>
        
        {selectedMuscleGroup === null ? (
          // Show muscle group grid
          <div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-3 mb-8">
              {muscleGroups.map((group) => (
                <div 
                  key={group.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleMuscleGroupClick(group.id)}
                >
                  <img 
                    src={group.image} 
                    alt={group.name} 
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h2 className="text-xl font-semibold text-[#26455D]">{group.name}</h2>
                    <p className="text-sm text-gray-500">
                      {group.exercises.length} exercises
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Add or Edit Exercise Form */}
            <div className="bg-white rounded-lg shadow-md p-4 mt-6">
              <h3 className="text-xl font-semibold text-[#26455D] mb-3">
                  {editingExercise ? "Edit Exercise" : "Add New Exercise"}
              </h3>

              <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Exercise Name</label>
                  <input
                      type="text"
                      value={exerciseName}
                      onChange={(e) => setExerciseName(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="Enter exercise name..."
                  />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Exercise Type</label>
                <select
                  value={exerciseType}
                  onChange={(e) => setExerciseType(parseInt(e.target.value) as ExerciseType)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  {Object.values(ExerciseType)
                    .filter((type) => typeof type === "number")
                    .map((type) => (
                      <option key={type} value={type}>
                        {ExerciseType[type as unknown as keyof typeof ExerciseType]}
                      </option>
                    ))}
                </select>
              </div>


              <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input
                      type="text"
                      value={exerciseDescription}
                      onChange={(e) => setExerciseDescription(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="Enter description..."
                  />
              </div>

              <div className="flex space-x-2">
                  <button 
                      onClick={handleAddOrUpdateExercise}
                      className="px-4 py-2 bg-[#26455D] text-white rounded-md hover:bg-opacity-90"
                  >
                      {editingExercise ? "Update Exercise" : "Add Exercise"}
                  </button>
                  {editingExercise && (
                      <button onClick={cancelEditExercise} className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100">
                          Cancel
                      </button>
                  )}
              </div>
            </div>

            {/* Workouts Section */}
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-[#26455D]">Your Workouts</h2>
                <button 
                  onClick={startNewWorkout}
                  className="bg-[#26455D] hover:bg-opacity-90 text-white px-4 py-2 rounded-md"
                >
                  Create New Workout
                </button>
              </div>

              {isCreatingWorkout ? (
                <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                  <h3 className="text-xl font-semibold text-[#26455D] mb-3">
                    {editingWorkoutId ? "Edit Workout" : "New Workout"}
                  </h3>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Workout Name
                    </label>
                    <input
                      type="text"
                      value={newWorkoutName}
                      onChange={(e) => setNewWorkoutName(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="Enter workout name..."
                    />
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium text-[#26455D] mb-2">Selected Exercises</h4>
                    {selectedWorkoutExercises.length > 0 ? (
                      <div className="space-y-3">
                        {selectedWorkoutExercises.map((exercise) => (
                          <div key={exercise.exerciseId} className="bg-gray-50 p-3 rounded-md">
                            <div className="flex justify-between items-start">
                              <span className="font-medium">{exercise.exerciseName}</span>

                              <button 
                                onClick={() => removeExerciseFromWorkout(exercise.exerciseId)}
                                className="text-red-500 hover:text-red-700"
                              >
                                Remove
                              </button>
                            </div>

                            <div className="flex justify-between items-center mt-2">
                              {/* Sets Input */}
                              <div className="flex items-center space-x-2">
                                <label className="text-xs font-medium text-gray-700">Sets:</label>
                                <input
                                  type="number"
                                  min="1"
                                  value={exercise.sets}
                                  onChange={(e) => updateWorkoutExercise(exercise.exerciseId, "sets", parseInt(e.target.value) || 0)}
                                  className="w-12 p-1 text-sm border border-gray-300 rounded-md"
                                />
                              </div>

                              {/* Reps Input */}
                              <div className="flex items-center space-x-2">
                                <label className="text-xs font-medium text-gray-700">Reps:</label>
                                <input
                                  type="number"
                                  min="1"
                                  value={exercise.reps}
                                  onChange={(e) => updateWorkoutExercise(exercise.exerciseId, "reps", parseInt(e.target.value) || 0)}
                                  className="w-12 p-1 text-sm border border-gray-300 rounded-md"
                                />
                              </div>

                              {/* Weight Input */}
                              <div className="flex items-center space-x-2">
                                <label className="text-xs font-medium text-gray-700">Weight:</label>
                                <input
                                  type="number"
                                  min="0"
                                  value={exercise.weight ?? 0}
                                  onChange={(e) => updateWorkoutExercise(exercise.exerciseId, "weight", parseFloat(e.target.value) || 0)}
                                  className="w-14 p-1 text-sm border border-gray-300 rounded-md"
                                />
                              </div>
                            </div>

                            {/* Notes Input */}
                            <div className="mt-2">
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Notes for this exercise
                              </label>
                              <input
                                type="text"
                                value={exercise.notes || ""}
                                onChange={(e) => updateWorkoutExercise(exercise.exerciseId, "notes", e.target.value)}
                                className="w-full p-1 text-sm border border-gray-300 rounded-md"
                                placeholder="Add notes..."
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm italic">
                        No exercises added. Select exercises below.
                      </p>
                    )}
                  </div>

                  <div>
                    <h4 className="font-medium text-[#26455D] mb-2">Add Exercises</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {muscleGroups.map((group) => (
                        <div key={group.id} className="mb-3">
                          <h5 className="font-medium text-[#26455D] mb-1">{group.name}</h5>
                          <div className="max-h-40 overflow-y-auto bg-gray-50 p-2 rounded-md">
                            {group.exercises.map((exercise) => (
                              <div 
                                key={exercise.id} 
                                className="flex justify-between items-center p-1 hover:bg-gray-100 rounded cursor-pointer"
                              >
                                <span className="text-sm">{exercise.name}</span>
                                <button
                                  onClick={() => addExerciseToWorkout(exercise)}
                                  className="text-xs bg-[#26455D] text-white px-2 py-1 rounded"
                                  disabled={selectedWorkoutExercises.some(ex => ex.exerciseId === exercise.id)}
                                >
                                  {selectedWorkoutExercises.some(ex => ex.exerciseId === exercise.id) ? 'Added' : 'Add'}
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end mt-4 space-x-2">
                    <button 
                      onClick={cancelNewWorkout}
                      className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => saveNewWorkout()}
                      className="px-4 py-2 bg-[#26455D] text-white rounded-md hover:bg-opacity-90"
                      disabled={!newWorkoutName.trim() || selectedWorkoutExercises.length === 0}
                    >
                      Save Workout
                    </button>
                  </div>
                </div>
              ) : null}

              {workouts.length > 0 ? (
                <div className="space-y-4">
                  {workouts.map((workout) => (
                    <div key={workout.id} className="bg-white rounded-lg shadow-md p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-xl font-semibold text-[#26455D]">{workout.name}</h3>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => editWorkout(workout)}
                            className="text-[#26455D] hover:text-opacity-70 text-sm font-medium"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => deleteWorkout(workout.id)}
                            className="text-red-500 hover:text-red-700 text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {workout.workoutExercises && Array.isArray(workout.workoutExercises) ? (
                          workout.workoutExercises.map((exercise) => (
                            <div key={exercise.exerciseId} className="bg-gray-50 p-3 rounded-md">
                              <h4 className="font-medium">{exercise.exerciseName}</h4>
                              <p className="text-sm text-gray-600">
                                Sets: {exercise.sets} • Reps: {exercise.reps} • Weight: {exercise.weight}
                              </p>
                              {exercise.notes && (
                                <p className="text-xs italic mt-1 text-gray-500">
                                  Note: {exercise.notes}
                                </p>
                              )}
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500 italic">No exercises found.</p>
                        )}
                      </div>
                      <div className="mt-4">
                        <button 
                          onClick={() => startWorkoutTimer(workout)}
                          className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium"
                        >
                          Start Workout
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <p className="text-gray-600 mb-4">You haven't created any workouts yet.</p>
                  <button 
                    onClick={startNewWorkout}
                    className="bg-[#26455D] hover:bg-opacity-90 text-white px-4 py-2 rounded-md"
                  >
                    Create Your First workout
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Show exercises for selected muscle group
          <div>
            <button 
              className="mb-4 flex items-center text-[#26455D] font-medium"
              onClick={handleBackToGroups}
            >
              <span className="mr-1">←</span> Back to Categories
            </button>
            
            <h2 className="text-2xl font-semibold text-[#26455D] mb-4">
              {muscleGroups.find(g => g.id === selectedMuscleGroup)?.name} Exercises
            </h2>
            
            <div className="space-y-4">
              {muscleGroups.find(g => g.id === selectedMuscleGroup)?.exercises.map((exercise) => (
                <div key={exercise.id} className="bg-white rounded-lg shadow-md p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-medium text-[#26455D]">{exercise.name}</h3>
                      <p className="text-gray-600">{exercise.description}</p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleDeleteExercise(exercise.id)}
                        className="text-sm font-medium text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </div>

                    {isCreatingWorkout && (
                      <button 
                        onClick={() => addExerciseToWorkout(exercise)}
                        className={`text-sm font-medium px-3 py-1 rounded ${
                          selectedWorkoutExercises.some(ex => ex.exerciseId === exercise.id)
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'bg-[#26455D] text-white'
                        }`}
                        disabled={selectedWorkoutExercises.some(ex => ex.exerciseId === exercise.id)}
                      >
                        {selectedWorkoutExercises.some(ex => ex.exerciseId === exercise.id) ? 'Added to Workout' : 'Add to Workout'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {isCreatingWorkout && (
              <div className="fixed bottom-16 inset-x-0 bg-white p-4 shadow-md">
                <div className="flex justify-between items-center">
                  <span className="font-medium">
                    Creating: {newWorkoutName || "New Workout"}
                  </span>
                  <div className="flex space-x-2">
                    <span className="text-sm text-gray-600">
                      {selectedWorkoutExercises.length} exercises added
                    </span>
                    <button 
                      onClick={() => saveNewWorkout()}
                      className="bg-[#26455D] text-white px-3 py-1 rounded-md text-sm"
                      disabled={!newWorkoutName.trim() || selectedWorkoutExercises.length === 0}
                    >
                      Save Workout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutPage; 