export const getHomeworksRequest = async (token: string | null) => {
    if (!token) throw new Error("No token found");

    const response = await fetch('http://localhost:8080/api/assessments', {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch homeworks');
    }

    return response.json();
};