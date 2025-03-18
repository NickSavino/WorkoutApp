import { User } from "../models/User";

class UserService {
    private readonly apiUrl: string;

    constructor() {
        this.apiUrl = "https://localhost:7053/api/user";
    }

    async loginUser(nameOrEmail: string) {
        const response = await fetch(`${this.apiUrl}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nameOrEmail),
        });

        if (!response.ok) {
            throw new Error("Invalid credentials");
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
