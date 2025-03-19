import { ExerciseType } from "../../enums/ExerciseType";

export interface ExerciseRowModel {
    id: number;
    name: string;
    type: ExerciseType;
    description?: string;
}