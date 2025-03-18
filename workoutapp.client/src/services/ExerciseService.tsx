import { Exercise } from "../models/Exercise";

class ExerciseService {
    private readonly apiUrl: string;

    constructor() {
        this.apiUrl = "https://localhost:7053/api/exercise";
    }

    async getAllExercises() {
        const response = await fetch(`${this.apiUrl}/get`);
        if (!response.ok) {
            throw new Error("Failed to fetch exercises");
        }
        return response.json() as Promise<Exercise[]>;
    }

    async getExerciseById(id: number) {
        const response = await fetch(`${this.apiUrl}/get/${id}`);
        if (!response.ok) {
            throw new Error("Failed to fetch exercise");
        }
        return response.json() as Promise<Exercise>;
    }

    async addExercise(exercise: Exercise) {
        const response = await fetch(`${this.apiUrl}/add`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(exercise),
        });

        if (!response.ok) {
            throw new Error("Failed to add exercise");
        }

        return response.json() as Promise<Exercise>;
    }

    async updateExercise(id: number, exercise: Exercise) {
        const response = await fetch(`${this.apiUrl}/update/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(exercise),
        });

        if (!response.ok) {
            throw new Error("Failed to update exercise");
        }

        return response.json() as Promise<Exercise>;
    }

    async deleteExercise(id: number) {
        const response = await fetch(`${this.apiUrl}/delete/${id}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error("Failed to delete exercise");
        }

        return response.json() as Promise<void>;
    }
}

export default new ExerciseService();
