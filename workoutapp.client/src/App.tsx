import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import LoginPage from "./components/LoginPage";
import ExerciseListPage from "./components/ExerciseListPage";
import AddExercisePage from "./components/AddExercisePage";
import UpdateExercisePage from "./components/UpdateExercisePage";
import DeleteExercisePage from "./components/DeleteExercisePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/home" element={<LandingPage />} />
      <Route path="/exercises" element={<ExerciseListPage />} />
      <Route path="/add-exercise" element={<AddExercisePage />} />
      <Route path="/update-exercise/:id" element={<UpdateExercisePage />} />
      <Route path="/delete-exercise/:id" element={<DeleteExercisePage />} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}

export default App;
