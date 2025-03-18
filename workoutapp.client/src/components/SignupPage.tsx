import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserService from "../services/UserService";
import { useAuth } from "../context/AuthContext";

const SignupPage: React.FC = () => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const { user, login } = useAuth();

    useEffect(() => {
        if (user) {
            navigate("/home");
        }
    }, [user, navigate]);

    const handleSignup = async () => {
        try {
            const user = await UserService.registerUser(email, username, password);
            login(user);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Unknown error registering! Please try again.");
            }
            throw err;
        }
    };


    return (
        <div className="min-h-screen bg-[#C3E0E5] flex flex-col items-center justify-center">
            <div className="absolute top-2 left-2">
                <Link to="/home">
                    <div className="w-fit flex justify-between space-x-4 rounded-xl px-4 py-2 hover:underline hover:bg-[#96B8BF]">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
                        </svg>
                        <p>
                            Back to home
                        </p>
                    </div>
                </Link>
            </div>
            <div className="w-[90%] lg:w-[40%] bg-white shadow-[0_0px_35px_rgba(38,69,93,0.4)] rounded-xl flex flex-col items-center px-20 py-10">
                <h1 className="text-3xl font-bold text-darkBlue mb-6 ">Register to Jym</h1>
                <div className=" w-full h-full pb-8 flex flex-col space-y-6">
                    <div className="flex h-fit space-x-2 border-b-2 border-[#26455D] items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                        </svg>
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email here"
                            className="w-full rounded-md text-darkBlue outline-none"
                        />
                    </div>
                    <div className="flex h-fit space-x-2 border-b-2 border-[#26455D]">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                        </svg>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username here"
                            className="w-full rounded-md text-darkBlue outline-none"
                        />
                    </div>
                    <div className="flex h-fit space-x-2 border-b-2 border-[#26455D]">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                        </svg>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password here"
                            className="w-full rounded-md text-darkBlue outline-none"
                        />
                    </div>
                </div>
                {error && <p className="text-red-500 pb-2">{error}</p>}

                <button onClick={handleSignup} className="bg-[#26455D] hover:translate-y-0.5 hover:cursor-pointer hover:shadow-lg text-white shadow-md px-6 py-3 rounded-xl transition">
                    Sign Up
                </button>


                <Link to="/login" className="underline font-bold mt-6">
                    Already have and account? Login here!
                </Link>
            </div>
        </div>
    );
};

export default SignupPage;
