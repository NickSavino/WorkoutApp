import { ExerciseRowModel } from "../exercise/ExerciseRowModel";

export interface WorkoutUpdateModel {
    name: string;
    userId: number;
    exercises: ExerciseRowModel[];
}