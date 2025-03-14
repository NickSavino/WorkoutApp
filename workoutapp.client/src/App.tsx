import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import LoginPage from "./components/LoginPage";
import { useAuth } from "./context/AuthContext";

function App() {

    const { user } = useAuth();

    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/home" element={<LandingPage />} />
            <Route path="*" element={<Navigate to={user ? "/home" : "/login"} replace />} />
        </Routes>
    );
}

export default App;
