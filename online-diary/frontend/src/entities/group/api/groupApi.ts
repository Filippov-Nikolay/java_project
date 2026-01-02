const BASE_URL = "/api/groups";

export const groupApi = {
    async getAll() {
        const res = await fetch(BASE_URL);
        if (!res.ok) throw new Error("Failed to fetch groups");
        return res.json(); 
    }
};