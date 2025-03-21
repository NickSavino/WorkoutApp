import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import { WorkoutUpdateModel } from "../dtos/workout/WorkoutUpdateModel";
import { WorkoutExerciseRowModel } from "../dtos/workout/WorkoutExerciseRowModel";

const WorkoutTimerPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const workout = location.state?.workout as WorkoutUpdateModel;
  
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isWorkoutComplete, setIsWorkoutComplete] = useState(false);
  const [exerciseResults, setExerciseResults] = useState<{exerciseId: number, time: number}[]>([]);
  const [setsCompleted, setSetsCompleted] = useState<{ [exerciseId: number]: number }>({});

  useEffect(() => {
    // Redirect if no workout was passed
    if (!workout) {
      navigate("/workout");
    } else {
      // Initialize sets completed
      const initialSets = workout.workoutExercises.reduce((acc, exercise) => {
        acc[exercise.exerciseId] = 0;
        return acc;
      }, {} as { [exerciseId: number]: number });
      setSetsCompleted(initialSets);
    }
  }, [workout, navigate]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  const startSet = () => {
    setIsTimerRunning(true);
  };

  const completeSet = () => {
    setIsTimerRunning(false);
    
    if (workout && workout.workoutExercises[currentExerciseIndex]) {
      const exerciseId = workout.workoutExercises[currentExerciseIndex].exerciseId;
      // Record the result
      setExerciseResults(prev => [...prev, { exerciseId, time: timer }]);
      
      // Increment sets completed
      setSetsCompleted(prev => ({
        ...prev,
        [exerciseId]: (prev[exerciseId] || 0) + 1
      }));
    }
    
    // Reset timer for next set
    setTimer(0);
  };

  const resetTimer = () => {
    setTimer(0);
  };

  const selectExercise = (index: number) => {
    if (isTimerRunning) {
      if (confirm("Changing exercises will stop the current timer. Continue?")) {
        setIsTimerRunning(false);
        setCurrentExerciseIndex(index);
        setTimer(0);
      }
    } else {
      setCurrentExerciseIndex(index);
      setTimer(0);
    }
  };

  const completeWorkout = () => {
    setIsWorkoutComplete(true);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!workout) {
    return <div className="min-h-screen bg-[#C3E0E5] flex items-center justify-center">Loading...</div>;
  }

  const currentExercise = workout.workoutExercises[currentExerciseIndex];
  const remainingSets = currentExercise ? currentExercise.sets - (setsCompleted[currentExercise.exerciseId] || 0) : 0;

  return (
    <div className="min-h-screen flex flex-col bg-[#C3E0E5]">
      <Navbar />
      
      <div className="flex-1 p-4 container mx-auto max-w-4xl">
        <button 
          className="mb-4 flex items-center text-[#26455D] font-medium"
          onClick={() => navigate("/workout")}
        >
          <span className="mr-1">←</span> Back to Workouts
        </button>
        
        <h1 className="text-3xl font-bold text-[#26455D] mb-2">{workout.name}</h1>
        
        {isWorkoutComplete ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-green-600 mb-6">Workout Complete! 🎉</h2>
            
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-[#26455D]">Exercise Results:</h3>
              
              {workout.workoutExercises.map((exercise) => {
                const completedSets = setsCompleted[exercise.exerciseId] || 0;
                const results = exerciseResults.filter(r => r.exerciseId === exercise.exerciseId);
                const averageTime = results.length > 0 
                  ? Math.floor(results.reduce((sum, r) => sum + r.time, 0) / results.length)
                  : 0;
                
                return (
                  <div key={exercise.exerciseId} className="bg-gray-50 p-4 rounded-md">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">{exercise.exerciseName}</h4>
                      <span className="text-[#26455D] font-bold">
                        {results.length > 0 
                          ? `Avg: ${formatTime(averageTime)}` 
                          : "Not completed"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {completedSets} of {exercise.sets} sets completed
                      {exercise.weight ? ` @ ${exercise.weight}lbs` : ''}
                    </p>
                    
                    {results.length > 0 && (
                      <div className="mt-2">
                        <h5 className="text-xs font-medium text-gray-700 mb-1">Set Times:</h5>
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                          {results.map((result, index) => (
                            <div key={index} className="bg-[#C3E0E5] rounded-md p-2 text-center">
                              <span className="text-xs text-gray-600">Set {index + 1}</span>
                              <div className="font-medium text-[#26455D]">{formatTime(result.time)}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            <button 
              className="mt-6 bg-[#26455D] text-white px-6 py-3 rounded-md font-medium w-full"
              onClick={() => navigate("/workout")}
            >
              Finish
            </button>
          </div>
        ) : (
          <>
            {/* Exercise selection tabs */}
            <div className="flex overflow-x-auto mb-4 bg-white rounded-t-lg p-2">
              {workout.workoutExercises.map((exercise, index) => {
                const isActive = index === currentExerciseIndex;
                const completedAllSets = (setsCompleted[exercise.exerciseId] || 0) >= exercise.sets;
                
                return (
                  <button
                    key={exercise.exerciseId}
                    onClick={() => selectExercise(index)}
                    className={`px-4 py-2 rounded-md mr-2 whitespace-nowrap flex-shrink-0
                      ${isActive 
                        ? 'bg-[#26455D] text-white' 
                        : completedAllSets 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-700'}`}
                  >
                    {exercise.exerciseName}
                    {completedAllSets && " ✓"}
                  </button>
                );
              })}
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="mb-2 text-sm text-gray-500">
                Exercise {currentExerciseIndex + 1} of {workout.workoutExercises.length}
              </div>
              <h2 className="text-2xl font-bold text-[#26455D] mb-4">{currentExercise.exerciseName}</h2>
              
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="bg-[#C3E0E5] rounded-md px-4 py-2">
                  <span className="block text-sm text-gray-600">Sets</span>
                  <span className="text-xl font-bold">
                    {remainingSets} {remainingSets === 1 ? 'set' : 'sets'} remaining
                  </span>
                </div>
                
                <div className="bg-[#C3E0E5] rounded-md px-4 py-2">
                  <span className="block text-sm text-gray-600">Reps</span>
                  <span className="text-xl font-bold">{currentExercise.reps}</span>
                </div>
                
                {currentExercise.weight && (
                  <div className="bg-[#C3E0E5] rounded-md px-4 py-2">
                    <span className="block text-sm text-gray-600">Weight</span>
                    <span className="text-xl font-bold">{currentExercise.weight} lbs</span>
                  </div>
                )}
              </div>
              
              {currentExercise.notes && (
                <div className="bg-gray-50 p-3 rounded-md mb-6">
                  <h3 className="text-sm font-medium mb-1">Notes:</h3>
                  <p className="text-gray-600">{currentExercise.notes}</p>
                </div>
              )}
              
              <div className="text-center mb-8">
                <div className="text-6xl font-bold mb-4 text-[#26455D]">{formatTime(timer)}</div>
                
                <div className="flex justify-center space-x-4">
                  {!isTimerRunning ? (
                    <button 
                      onClick={startSet}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium"
                      disabled={remainingSets === 0}
                    >
                      {remainingSets === 0 ? "All Sets Completed" : "Start Set"}
                    </button>
                  ) : (
                    <button 
                      onClick={completeSet}
                      className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium"
                    >
                      Complete Set
                    </button>
                  )}
                  
                  {timer > 0 && !isTimerRunning && (
                    <button 
                      onClick={resetTimer}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>
              
              <button 
                onClick={completeWorkout}
                className="bg-[#26455D] text-white px-6 py-3 rounded-md font-medium w-full"
              >
                Complete Workout
              </button>
            </div>
            
            {/* Progress display */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="font-medium text-[#26455D] mb-2">Workout Progress</h3>
              <div className="space-y-3">
                {workout.workoutExercises.map((exercise) => {
                  const completedSets = setsCompleted[exercise.exerciseId] || 0;
                  const progress = Math.min(100, (completedSets / exercise.sets) * 100);
                  
                  return (
                    <div key={exercise.exerciseId} className="bg-gray-50 p-3 rounded-md">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">{exercise.exerciseName}</span>
                        <span className="text-xs text-gray-500">
                          {completedSets}/{exercise.sets} sets
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WorkoutTimerPage; 