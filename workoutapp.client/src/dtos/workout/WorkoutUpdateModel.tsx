import { WorkoutExerciseRowModel } from "./WorkoutExerciseRowModel";

export interface WorkoutUpdateModel {
    id: number
    name: string;
    userId: number;
    workoutExercises: WorkoutExerciseRowModel[];
}