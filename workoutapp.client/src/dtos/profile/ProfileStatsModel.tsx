export interface ProfileStatsModel {
    totalWorkouts: number;
    totalExercises: number;
    totalReps: number;
    totalSets: number;
    averageWeight: number;
    muscleGroupCounts: { [key: string]: number };
    workoutStreak: number;
}