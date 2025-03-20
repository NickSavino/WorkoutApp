import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserService from "../services/UserService";
import { useAuth } from "../context/AuthContext";
import { UserLoginRequestModel } from "../dtos/UserLoginRequestModel";
import { User } from "../models/User";

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const navigate = useNavigate();

    const { user, login } = useAuth();

    useEffect(() => {
        if (user) {
            navigate("/home");
        }
    }, [user, navigate]);

    const validateUsername = (value: string) => {
        if (!value.trim()) {
            setUsernameError("Username or email is required");
            return false;
        }
        setUsernameError("");
        return true;
    };

    const validatePassword = (value: string) => {
        if (!value) {
            setPasswordError("Password is required");
            return false;
        }
        setPasswordError("");
        return true;
    };

    const handleLogin = async () => {
        setError("");
        
        const isUsernameValid = validateUsername(username);
        const isPasswordValid = validatePassword(password);
        
        if (!isUsernameValid || !isPasswordValid) {
            return;
        }
        
        try {
            const model: UserLoginRequestModel = { nameOrEmail: username, password }
            const user = await UserService.loginUser(model);
            login(user);
        } catch (err) {
            setError("Invalid Credentials! Please try again.");
            console.error(err);
        }
    };

    const handleGuestLogin = async () => {
        try {
            // Use the guest account credentials
            const model: UserLoginRequestModel = { 
                nameOrEmail: "Guest", 
                password: "Guest" 
            };
            
            // Login using the service like a normal user
            const user = await UserService.loginUser(model);
            login(user);
            
        } catch (err) {
            setError("Failed to login as guest. Please try again.");
            console.error(err);
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
            <div className="w-[90%] md:w-[70%] lg:w-[50%] flex flex-col items-center flex flex-col space-y-6">
                <div className="w-full bg-white shadow-[0_0px_35px_rgba(38,69,93,0.4)] rounded-xl flex flex-col items-center px-20 py-10">
                    <h1 className="text-3xl font-bold text-darkBlue mb-6 ">Login to Jym</h1>
                    <div className="w-full h-full pb-8 flex flex-col space-y-6">
                        <div className="flex flex-col w-full">
                            <div className="flex h-fit space-x-2 border-b-2 border-[#26455D] items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                                </svg>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => {
                                        setUsername(e.target.value);
                                        validateUsername(e.target.value);
                                    }}
                                    placeholder="Enter your email or username here"
                                    className="w-full rounded-md text-darkBlue outline-none"
                                />
                            </div>
                            {usernameError && <p className="text-red-500 text-sm mt-1">{usernameError}</p>}
                        </div>
                        
                        <div className="flex flex-col w-full">
                            <div className="flex h-fit space-x-2 border-b-2 border-[#26455D]">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                                </svg>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        validatePassword(e.target.value);
                                    }}
                                    placeholder="Enter your password here"
                                    className="w-full rounded-md text-darkBlue outline-none"
                                />
                            </div>
                            {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
                        </div>
                    </div>
                    {error && <p className="text-red-500 pb-2">{error}</p>}

                    <button onClick={handleLogin} className="bg-[#26455D] hover:translate-y-0.5 hover:cursor-pointer hover:shadow-lg text-white shadow-md px-6 py-3 rounded-xl transition">
                        Sign In
                    </button>

                    <p className="my-4 text-darkBlue">or</p>

                    <Link to="/signup" className="underline font-bold">
                        Sign up to Jym here!
                    </Link>
                </div>
                <button onClick={handleGuestLogin} className="w-[40%] md:w-[30%] bg-[#dae2e8] shadow-[0_0px_35px_rgba(38,69,93,0.2)] hover:translate-y-0.5 hover:cursor-pointer px-5 py-5 rounded-xl transition">
                        Use Jym as a guest
                </button>
            </div>
        </div>
    );
};

export default LoginPage;
