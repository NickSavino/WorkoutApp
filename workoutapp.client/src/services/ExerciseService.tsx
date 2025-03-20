import { ExerciseRowModel } from "../dtos/exercise/ExerciseRowModel";
import { ExerciseUpdateModel } from "../dtos/exercise/ExerciseUpdateModel";
import { ExerciseType } from "../enums/ExerciseType";

class ExerciseService {
    private apiUrl: string;

    constructor() {
        this.apiUrl = "https://localhost:7053/api/exercise";
    }

    async getAllExercises(): Promise<ExerciseRowModel[]> {
        const response = await fetch(`${this.apiUrl}/get`);
        if (!response.ok) throw new Error("Failed to fetch exercises");
        return response.json();
    }

    async addOrUpdateExercise(exercise: ExerciseUpdateModel) {
            const response = await fetch(`${this.apiUrl}/addOrUpdate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(exercise),
            });

            if (!response.ok) {
                const errorData = await response.json();

                    throw new Error(errorData || "Cannot enter a duplicate or blank exercise name");
                }

            return await response.json();
    }


    async deleteExercise(id: number) {
        const response = await fetch(`${this.apiUrl}/delete/${id}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error("Failed to delete exercise");
        }
    }

    async getExercisesByType(type: ExerciseType): Promise<ExerciseRowModel[]> {
        const response = await fetch(`${this.apiUrl}/get/type/${type}`);
        if (!response.ok) throw new Error("Failed to fetch exercises by type");
        return response.json();
    }
}

export default new ExerciseService();
