import React, { useState } from 'react';

interface Exercise {
  name: string;
  description: string;
  muscleGroup: string;
}

const AddExercisePage: React.FC = () => {
  const [exercise, setExercise] = useState<Exercise>({
    name: '',
    description: '',
    muscleGroup: '',
  });
  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setExercise(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/exercises', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(exercise),
      });
      if (!response.ok) {
        throw new Error('Failed to add exercise');
      }
      setMessage('Exercise added successfully!');
      // Optionally reset the form
      setExercise({ name: '', description: '', muscleGroup: '' });
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage('An unknown error occurred');
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-4 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Add Exercise</h1>
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
  <select
    id="muscleGroup"
    name="muscleGroup"
    value={exercise.muscleGroup}
    onChange={handleChange}
    className="mt-1 block w-full border border-gray-300 rounded p-2 bg-white"
    required
  >
    <option value="" disabled>Select a muscle group</option>
    <option value="chest">Chest</option>
    <option value="back">Back</option>
    <option value="legs">Legs</option>
    <option value="shoulders">Shoulders</option>
    <option value="bicep">Bicep</option>
    <option value="tricep">Tricep</option>
  </select>
</div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Add Exercise
        </button>
      </form>
    </div>
  );
};

export default AddExercisePage;
