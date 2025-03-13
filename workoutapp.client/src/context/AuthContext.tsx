import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "../models/User";

interface AuthContextType {
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadUserFromCache = async () => {
            const cache = await caches.open("auth-cache");
            const cachedResponse = await cache.match("/user");

            if (cachedResponse) {
                const cachedUser = await cachedResponse.json();
                setUser(cachedUser);
            }
        };

        loadUserFromCache();
    }, []);

    const login = async (userData: User) => {
        setUser(userData);

        const cache = await caches.open("auth-cache");
        await cache.put("/user", new Response(JSON.stringify(userData)));

        navigate("/home");
    };

    const logout = async () => {
        setUser(null);

        const cache = await caches.open("auth-cache");
        await cache.delete("/user");

        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};
