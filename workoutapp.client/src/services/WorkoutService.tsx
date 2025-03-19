import { WorkoutUpdateModel } from "../dtos/workout/WorkoutUpdateModel";

class WorkoutService {
    private apiUrl: string;

    constructor() {
        this.apiUrl = "https://localhost:7053/api/workout";
    }

    async getWorkoutsByUserId(userId: number) {
        const response = await fetch(`${this.apiUrl}/get/userid/${userId}`);
        if (!response.ok) {
            throw new Error("Failed to fetch workouts");
        }
        return response.json() as Promise<WorkoutUpdateModel[]>;
    }

    async createWorkout(workout: WorkoutUpdateModel) {
        const response = await fetch(`${this.apiUrl}/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(workout),
        });

        if (!response.ok) {
            throw new Error("Failed to create workout");
        }

        return response.json() as Promise<WorkoutUpdateModel>;
    }

    async deleteWorkout(workoutId: number) {
        const response = await fetch(`${this.apiUrl}/delete/${workoutId}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error("Failed to delete workout");
        }
    }

    async updateWorkout(workout: WorkoutUpdateModel) {
        const response = await fetch(`${this.apiUrl}/update`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(workout),
        });
    
        if (!response.ok) {
          throw new Error("Failed to update workout");
        }
    
        return response.json() as Promise<WorkoutUpdateModel>;
      }
}

export default new WorkoutService();
