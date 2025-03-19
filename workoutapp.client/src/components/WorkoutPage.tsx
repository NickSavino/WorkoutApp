import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import BottomNav from "./BottomNavbar";
//import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Sample data for muscle groups with images
const muscleGroups = [
  { id: 1, name: "Arms", image: "/src/images/arms.jpg", exercises: [] },
  { id: 2, name: "Chest", image: "/src/images/chest.jpg", exercises: [] },
  { id: 3, name: "Back", image: "/src/images/back.jpg", exercises: [] },
  { id: 4, name: "Legs", image: "/src/images/legs.jpg", exercises: [] },
  { id: 5, name: "Shoulders", image: "/src/images/shoulders.jpg", exercises: [] },
  { id: 6, name: "Core", image: "/src/images/core.jpg", exercises: [] },
];

// Extended sample exercises data with more examples
const sampleExercises = {
  1: [ // Arms exercises
    { id: 101, name: "Bicep Curl", description: "Curl the weight towards your shoulder", sets: 3, reps: 12 },
    { id: 102, name: "Tricep Extension", description: "Extend your arm to work the tricep", sets: 3, reps: 12 },
    { id: 103, name: "Hammer Curls", description: "Curl with neutral grip for brachialis", sets: 3, reps: 10 },
    { id: 104, name: "Skull Crushers", description: "Lying tricep extension exercise", sets: 3, reps: 12 },
    { id: 105, name: "Preacher Curls", description: "Bicep curls with arm supported on pad", sets: 3, reps: 10 },
  ],
  2: [ // Chest exercises
    { id: 201, name: "Bench Press", description: "Press the weight upward from your chest", sets: 4, reps: 8 },
    { id: 202, name: "Push-ups", description: "Standard push-up exercise", sets: 3, reps: 15 },
    { id: 203, name: "Incline Press", description: "Bench press on an inclined bench", sets: 3, reps: 10 },
    { id: 204, name: "Chest Fly", description: "Bring weights together in an arc", sets: 3, reps: 12 },
    { id: 205, name: "Decline Press", description: "Bench press on a declined bench", sets: 3, reps: 10 },
  ],
  3: [ // Back exercises
    { id: 301, name: "Pull-ups", description: "Pull your body up to the bar", sets: 3, reps: 10 },
    { id: 302, name: "Bent-over Rows", description: "Row the weight towards your hip", sets: 3, reps: 12 },
    { id: 303, name: "Lat Pulldown", description: "Pull bar down to chest level", sets: 3, reps: 12 },
    { id: 304, name: "Deadlift", description: "Full-body pull movement", sets: 3, reps: 8 },
    { id: 305, name: "T-Bar Row", description: "Row using a T-bar setup", sets: 3, reps: 10 },
  ],
  4: [ // Legs exercises
    { id: 401, name: "Squats", description: "Squat down with weight on shoulders", sets: 4, reps: 8 },
    { id: 402, name: "Lunges", description: "Step forward into a lunge position", sets: 3, reps: 10 },
    { id: 403, name: "Leg Press", description: "Push weight away with legs", sets: 3, reps: 12 },
    { id: 404, name: "Calf Raises", description: "Raise heels to work calves", sets: 3, reps: 15 },
    { id: 405, name: "Leg Extensions", description: "Extend legs to straight position", sets: 3, reps: 12 },
  ],
  5: [ // Shoulders exercises
    { id: 501, name: "Shoulder Press", description: "Press weight upward from shoulders", sets: 3, reps: 10 },
    { id: 502, name: "Lateral Raises", description: "Raise weights outward to the side", sets: 3, reps: 12 },
    { id: 503, name: "Front Raises", description: "Raise weights forward", sets: 3, reps: 12 },
    { id: 504, name: "Reverse Fly", description: "Raise weights to sides while bent over", sets: 3, reps: 12 },
    { id: 505, name: "Shrugs", description: "Lift shoulders towards ears", sets: 3, reps: 15 },
  ],
  6: [ // Core exercises
    { id: 601, name: "Crunches", description: "Standard abdominal crunch", sets: 3, reps: 15 },
    { id: 602, name: "Plank", description: "Hold plank position", sets: 3, reps: "30 seconds" },
    { id: 603, name: "Russian Twist", description: "Rotate torso while seated", sets: 3, reps: 20 },
    { id: 604, name: "Leg Raises", description: "Raise legs from lying position", sets: 3, reps: 12 },
    { id: 605, name: "Mountain Climbers", description: "Alternating knee drives in plank", sets: 3, reps: 20 },
  ],
};

// Sample routines - will be replaced by actual user data from backend
const sampleRoutines = [
  { 
    id: 1, 
    name: "Upper Body Power", 
    exercises: [
      { ...sampleExercises[2][0], routineNotes: "Focus on form" }, // Bench Press
      { ...sampleExercises[3][0], routineNotes: "Wide grip" }, // Pull-ups
      { ...sampleExercises[5][0], routineNotes: "Seated" }, // Shoulder Press
    ]
  },
  { 
    id: 2, 
    name: "Leg Day", 
    exercises: [
      { ...sampleExercises[4][0], routineNotes: "Go deep" }, // Squats
      { ...sampleExercises[4][2], routineNotes: "High foot position" }, // Leg Press
    ]
  }
];

type Routine = {
  id: number;
  name: string;
  exercises: any[];
};

// Mock user for testing without authentication
const MOCK_USER = {
  id: 999,
  name: "Test User",
  email: "test@example.com"
};

//const API_URL = "/api"; // Update with your actual API base URL

const WorkoutPage: React.FC = () => {
  // Use the real auth context, but provide a fallback mock user for testing
  const authContext = useAuth();
  const [mockUser] = useState(MOCK_USER);
  // Use real user from auth if available, otherwise use mock user
  const user = authContext.user || mockUser;
  
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<number | null>(null);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [isCreatingRoutine, setIsCreatingRoutine] = useState(false);
  const [newRoutineName, setNewRoutineName] = useState("");
  const [selectedRoutineExercises, setSelectedRoutineExercises] = useState<any[]>([]);
  const [editingRoutineId, setEditingRoutineId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  //const navigate = useNavigate();

  // TEMPORARILY DISABLED: Redirect to login if not authenticated
  // useEffect(() => {
  //   if (!user) {
  //     navigate("/login");
  //   }
  // }, [user, navigate]);

  // Load user routines on component mount
  useEffect(() => {
    const loadUserRoutines = async () => {
      try {
        setIsLoading(true);
        
        // This will be replaced with an actual API call in the future
        // For now, we'll use sample data
        console.log("Would load routines for user:", user);
        setRoutines(sampleRoutines);
      } catch (error) {
        console.error("Error loading routines:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserRoutines();
  }, [user]);

  // Save routines when they change
  useEffect(() => {
    const saveUserRoutines = async () => {
      if (isLoading) return;
      
      try {
        // This would call API in the future
        console.log("Would save routines for user:", user.id);
      } catch (error) {
        console.error("Error saving routines:", error);
      }
    };
    
    // Debounce routine saves to avoid too many API calls
    const timeoutId = setTimeout(saveUserRoutines, 500);
    return () => clearTimeout(timeoutId);
  }, [routines, user, isLoading]);

  const handleMuscleGroupClick = (id: number) => {
    setSelectedMuscleGroup(id);
  };

  const handleBackToGroups = () => {
    setSelectedMuscleGroup(null);
  };

  const startNewRoutine = () => {
    setIsCreatingRoutine(true);
    setNewRoutineName("");
    setSelectedRoutineExercises([]);
    setEditingRoutineId(null);
  };

  const cancelNewRoutine = () => {
    setIsCreatingRoutine(false);
    setNewRoutineName("");
    setSelectedRoutineExercises([]);
    setEditingRoutineId(null);
  };

  const saveNewRoutine = async () => {
    if (!newRoutineName.trim() || selectedRoutineExercises.length === 0) {
      alert("Please provide a routine name and add at least one exercise");
      return;
    }

    try {
      if (editingRoutineId !== null) {
        // Update existing routine
        setRoutines(routines.map(routine => 
          routine.id === editingRoutineId 
            ? { ...routine, name: newRoutineName, exercises: selectedRoutineExercises }
            : routine
        ));

        // In future, this would call the API to update the routine
      } else {
        // Create new routine
        const newRoutine: Routine = {
          id: Date.now(), // In the future, this ID would come from the backend
          name: newRoutineName,
          exercises: selectedRoutineExercises
        };
        setRoutines([...routines, newRoutine]);

        // In future, this would call the API to create the routine
      }

      setIsCreatingRoutine(false);
      setNewRoutineName("");
      setSelectedRoutineExercises([]);
      setEditingRoutineId(null);
    } catch (error) {
      console.error("Error saving routine:", error);
      alert("Failed to save routine. Please try again.");
    }
  };

  const editRoutine = (routine: Routine) => {
    setIsCreatingRoutine(true);
    setNewRoutineName(routine.name);
    setSelectedRoutineExercises(routine.exercises);
    setEditingRoutineId(routine.id);
  };

  const deleteRoutine = async (routineId: number) => {
    if (confirm("Are you sure you want to delete this routine?")) {
      try {
        setRoutines(routines.filter(routine => routine.id !== routineId));
        
        // In future, this would call the API to delete the routine
      } catch (error) {
        console.error("Error deleting routine:", error);
        alert("Failed to delete routine. Please try again.");
      }
    }
  };

  const addExerciseToRoutine = (exercise: any) => {
    // Check if already added
    if (!selectedRoutineExercises.some(ex => ex.id === exercise.id)) {
      setSelectedRoutineExercises([...selectedRoutineExercises, { 
        ...exercise, 
        routineNotes: "" 
      }]);
    }
  };

  const removeExerciseFromRoutine = (exerciseId: number) => {
    setSelectedRoutineExercises(
      selectedRoutineExercises.filter(exercise => exercise.id !== exerciseId)
    );
  };

  const updateExerciseNotes = (exerciseId: number, notes: string) => {
    setSelectedRoutineExercises(
      selectedRoutineExercises.map(exercise => 
        exercise.id === exerciseId 
          ? { ...exercise, routineNotes: notes }
          : exercise
      )
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#C3E0E5]">
        <p className="text-xl font-medium text-[#26455D]">Loading your workouts...</p>
      </div>
    );
  }

  // Removed the conditional return when no user is present

  return (
    <div className="min-h-screen flex flex-col bg-[#C3E0E5]">
      <Navbar />
      <div className="flex-1 p-4 pb-20">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#26455D]">Exercises</h1>
          <div className="text-gray-600 text-sm">
            Hi, {user.name || 'User'}
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
                      {sampleExercises[group.id as keyof typeof sampleExercises].length} exercises
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Routines Section */}
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-[#26455D]">Your Routines</h2>
                <button 
                  onClick={startNewRoutine}
                  className="bg-[#26455D] hover:bg-opacity-90 text-white px-4 py-2 rounded-md"
                >
                  Create New Routine
                </button>
              </div>

              {isCreatingRoutine ? (
                <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                  <h3 className="text-xl font-semibold text-[#26455D] mb-3">
                    {editingRoutineId ? "Edit Routine" : "New Routine"}
                  </h3>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Routine Name
                    </label>
                    <input
                      type="text"
                      value={newRoutineName}
                      onChange={(e) => setNewRoutineName(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="Enter routine name..."
                    />
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium text-[#26455D] mb-2">Selected Exercises</h4>
                    {selectedRoutineExercises.length > 0 ? (
                      <div className="space-y-3">
                        {selectedRoutineExercises.map((exercise) => (
                          <div key={exercise.id} className="bg-gray-50 p-3 rounded-md">
                            <div className="flex justify-between items-start">
                              <div>
                                <h5 className="font-medium">{exercise.name}</h5>
                                <p className="text-sm text-gray-600">
                                  Sets: {exercise.sets} • Reps: {exercise.reps}
                                </p>
                              </div>
                              <button 
                                onClick={() => removeExerciseFromRoutine(exercise.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                Remove
                              </button>
                            </div>
                            <div className="mt-2">
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Notes for this exercise
                              </label>
                              <input
                                type="text"
                                value={exercise.routineNotes || ""}
                                onChange={(e) => updateExerciseNotes(exercise.id, e.target.value)}
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
                            {sampleExercises[group.id as keyof typeof sampleExercises].map((exercise) => (
                              <div 
                                key={exercise.id} 
                                className="flex justify-between items-center p-1 hover:bg-gray-100 rounded cursor-pointer"
                              >
                                <span className="text-sm">{exercise.name}</span>
                                <button
                                  onClick={() => addExerciseToRoutine(exercise)}
                                  className="text-xs bg-[#26455D] text-white px-2 py-1 rounded"
                                  disabled={selectedRoutineExercises.some(ex => ex.id === exercise.id)}
                                >
                                  {selectedRoutineExercises.some(ex => ex.id === exercise.id) ? 'Added' : 'Add'}
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
                      onClick={cancelNewRoutine}
                      className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={saveNewRoutine}
                      className="px-4 py-2 bg-[#26455D] text-white rounded-md hover:bg-opacity-90"
                      disabled={!newRoutineName.trim() || selectedRoutineExercises.length === 0}
                    >
                      Save Routine
                    </button>
                  </div>
                </div>
              ) : null}

              {routines.length > 0 ? (
                <div className="space-y-4">
                  {routines.map((routine) => (
                    <div key={routine.id} className="bg-white rounded-lg shadow-md p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-xl font-semibold text-[#26455D]">{routine.name}</h3>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => editRoutine(routine)}
                            className="text-[#26455D] hover:text-opacity-70 text-sm font-medium"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => deleteRoutine(routine.id)}
                            className="text-red-500 hover:text-red-700 text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {routine.exercises.map((exercise) => (
                          <div key={exercise.id} className="bg-gray-50 p-3 rounded-md">
                            <h4 className="font-medium">{exercise.name}</h4>
                            <p className="text-sm text-gray-600">
                              Sets: {exercise.sets} • Reps: {exercise.reps}
                            </p>
                            {exercise.routineNotes && (
                              <p className="text-xs italic mt-1 text-gray-500">
                                Note: {exercise.routineNotes}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <p className="text-gray-600 mb-4">You haven't created any routines yet.</p>
                  <button 
                    onClick={startNewRoutine}
                    className="bg-[#26455D] hover:bg-opacity-90 text-white px-4 py-2 rounded-md"
                  >
                    Create Your First Routine
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
              {sampleExercises[selectedMuscleGroup as keyof typeof sampleExercises].map((exercise) => (
                <div key={exercise.id} className="bg-white rounded-lg shadow-md p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-medium text-[#26455D]">{exercise.name}</h3>
                      <p className="text-gray-600">{exercise.description}</p>
                      <div className="mt-2 text-sm text-gray-500">
                        Sets: {exercise.sets} • Reps: {exercise.reps}
                      </div>
                    </div>
                    {isCreatingRoutine && (
                      <button 
                        onClick={() => addExerciseToRoutine(exercise)}
                        className={`text-sm font-medium px-3 py-1 rounded ${
                          selectedRoutineExercises.some(ex => ex.id === exercise.id)
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'bg-[#26455D] text-white'
                        }`}
                        disabled={selectedRoutineExercises.some(ex => ex.id === exercise.id)}
                      >
                        {selectedRoutineExercises.some(ex => ex.id === exercise.id) ? 'Added to Routine' : 'Add to Routine'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {isCreatingRoutine && (
              <div className="fixed bottom-16 inset-x-0 bg-white p-4 shadow-md">
                <div className="flex justify-between items-center">
                  <span className="font-medium">
                    Creating: {newRoutineName || "New Routine"}
                  </span>
                  <div className="flex space-x-2">
                    <span className="text-sm text-gray-600">
                      {selectedRoutineExercises.length} exercises added
                    </span>
                    <button 
                      onClick={saveNewRoutine}
                      className="bg-[#26455D] text-white px-3 py-1 rounded-md text-sm"
                      disabled={!newRoutineName.trim() || selectedRoutineExercises.length === 0}
                    >
                      Save Routine
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default WorkoutPage; 