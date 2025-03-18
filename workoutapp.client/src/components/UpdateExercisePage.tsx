import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

interface Exercise {
  id: number;
  name: string;
  description: string;
  muscleGroup: string;
}

const UpdateExercisePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchExercise = async () => {
      try {
        const response = await fetch(`/api/exercises/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch exercise');
        }
        const data: Exercise = await response.json();
        setExercise(data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setMessage(error.message);
        } else {
          setMessage('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchExercise();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (exercise) {
      setExercise({
        ...exercise,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!exercise) return;
    try {
      const response = await fetch(`/api/exercises/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(exercise),
      });
      if (!response.ok) {
        throw new Error('Failed to update exercise');
      }
      setMessage('Exercise updated successfully!');
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage('An unknown error occurred');
      }
    }
  };

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (!exercise) {
    return <div className="text-center mt-8">Exercise not found.</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-4 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Update Exercise</h1>
      {message && <p className="mb-4 text-green-600">{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700">Name</label>
          <input
            id="name"
            type="text"
            name="name"
            value={exercise.name}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded p-2"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700">Description</label>
          <textarea
            id="description"
            name="description"
            value={exercise.description}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded p-2"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="muscleGroup" className="block text-gray-700">Muscle Group</label>
          <input
            type="text"
            name="muscleGroup"
            value={exercise.muscleGroup}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded p-2"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          Update Exercise
        </button>
      </form>
    </div>
  );
};

export default UpdateExercisePage;
