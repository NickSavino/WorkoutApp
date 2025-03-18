import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface Exercise {
  id: number;
  name: string;
}

const DeleteExercisePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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
      } catch (error) {
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

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/exercises/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete exercise');
      }
      setMessage('Exercise deleted successfully!');
      // Optionally redirect after a brief delay
      setTimeout(() => {
        navigate('/exercises');
      }, 2000);
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
      <h1 className="text-2xl font-bold mb-4">Delete Exercise</h1>
      {message && <p className="mb-4 text-red-600">{message}</p>}
      <p className="mb-4">
        Are you sure you want to delete the exercise <strong>{exercise.name}</strong>?
      </p>
      <div className="flex justify-between">
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
        >
          Delete
        </button>
        <button
          onClick={() => navigate('/exercises')}
          className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default DeleteExercisePage;
