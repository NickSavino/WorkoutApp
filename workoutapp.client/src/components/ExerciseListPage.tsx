import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface Exercise {
  id: number;
  name: string;
  description: string;
  muscleGroup: string;
}

const ExerciseListPage: React.FC = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await fetch('/api/exercises');
        if (!response.ok) {
          throw new Error('Failed to fetch exercises');
        }
        const data: Exercise[] = await response.json();
        setExercises(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchExercises();
  }, []);

  if (loading) {
    return <div className="text-center mt-8">Loading exercises...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 p-4 bg-white rounded shadow">
      <h1 className="text-3xl font-bold mb-4">Exercises</h1>
      <Link
        to="/add-exercise"
        className="mb-4 inline-block bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Add New Exercise
      </Link>
      <ul>
        {exercises.map(exercise => (
          <li key={exercise.id} className="border p-4 mb-2 rounded">
            <h2 className="text-xl font-semibold">{exercise.name}</h2>
            <p>{exercise.description}</p>
            <p className="italic">Muscle Group: {exercise.muscleGroup}</p>
            <div className="mt-2">
              <Link
                to={`/update-exercise/${exercise.id}`}
                className="mr-2 bg-green-500 text-white p-1 rounded hover:bg-green-600"
              >
                Update
              </Link>
              <Link
                to={`/delete-exercise/${exercise.id}`}
                className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
              >
                Delete
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExerciseListPage;
