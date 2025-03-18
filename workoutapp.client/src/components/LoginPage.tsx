import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserService from "../services/UserService";
import { useAuth } from "../context/AuthContext";

const LoginPage: React.FC = () => {
    const [input, setInput] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const { user, login } = useAuth();

    useEffect(() => {
        if (user) {
            navigate("/home");
        }
    }, [user, navigate]);

    const handleLogin = async () => {
        try {
            const user = await UserService.loginUser(input);
            login(user);
        } catch (err) {
            setError("Invalid Credentials");
            throw err;
        }
    };

    const handleGuestLogin = () => {
        navigate("/home");
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-babyBlue">
            <h1 className="text-3xl font-bold text-darkBlue mb-6">Login to Jym</h1>

            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter username or email"
                className="p-3 mb-4 border rounded-md text-darkBlue"
            />

            {error && <p className="text-red-500">{error}</p>}

            <button
                onClick={handleLogin}
                className="bg-blueGray hover:bg-midnightBlue text-white shadow-md px-6 py-3 rounded-full transition"
            >
                Sign In
            </button>

            <p className="mt-4 text-darkBlue">or</p>

            <button
                onClick={handleGuestLogin}
                className="bg-gray-500 hover:bg-gray-700 text-white shadow-md px-6 py-3 rounded-full transition">
                Sign in as Guest
            </button>
        </div>
    );
};

export default LoginPage;
