import { ExerciseType } from "../../enums/ExerciseType"

export interface ExerciseUpdateModel {
    id: number,
    name: string,
    type: ExerciseType
    description?: string
}