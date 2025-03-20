import { UserLoginRequestModel } from "../dtos/UserLoginRequestModel";
import { UserRegisterRequestModel } from "../dtos/UserRegisterRequestModel";
import { User } from "../models/User";

class UserService {
    private apiUrl: string;

    constructor() {
        this.apiUrl = import.meta.env.VITE_API_BASE_URL + "/api/user";
    }

    async loginUser(model: UserLoginRequestModel) {
        const response = await fetch(`${this.apiUrl}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(model),
        });

        if (!response.ok) {
            throw new Error("Invalid credentials");
        }

        return response.json() as Promise<User>;
    }

    async registerUser(model: UserRegisterRequestModel) {
        const response = await fetch(`${this.apiUrl}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(model),
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
