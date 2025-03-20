import { ProfileStatsModel } from "../dtos/profile/ProfileStatsModel";

class ProfileService {
    private apiUrl: string;

    constructor() {
        this.apiUrl = "webappapi-a9c4fpcqdtbzb5an.westus-01.azurewebsites.net/api/profile";
    }

    async getProfileStats(userId: number) {
        const response = await fetch(`${this.apiUrl}/stats/${userId}`);

        if (!response.ok) {
            throw new Error("Failed to fetch profile stats");
        }

        return response.json() as Promise<ProfileStatsModel>;
    }
}

export default new ProfileService();
