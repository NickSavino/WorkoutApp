import { ExerciseType } from "../../enums/ExerciseType";

export interface WorkoutExerciseRowModel {
    exerciseId: number;
    exerciseName: string;   
    type: ExerciseType;
    sets: number;
    reps: number;   
    weight?: number;
    notes?: string;
}
