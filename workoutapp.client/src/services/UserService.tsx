import { User } from "../models/User";

class UserService {
    private apiUrl: string;

    constructor() {
        this.apiUrl = "https://localhost:7053/api/user";
    }

    async loginUser(nameOrEmail: string, password: string) {
        const response = await fetch(`${this.apiUrl}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nameOrEmail, password }),
        });

        if (!response.ok) {
            throw new Error("Invalid credentials");
        }

        return response.json() as Promise<User>;
    }

    async registerUser(username: string, email: string, password: string) {
        const response = await fetch(`${this.apiUrl}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password }),
        });
    
        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage || "Failed to sign up");
        }
    
        return response.json() as Promise<User>;
    }
    

    async getAllUsers() {
        const response = await fetch(`${this.apiUrl}/get`);
        if (!response.ok) {
            throw new Error("Failed to fetch users");
        }
        return response.json() as Promise<User[]>;
    }
}

export default new UserService();
