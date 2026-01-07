import { useState, useEffect } from "react";

export const useGroups = () => {
    const [groups, setGroups] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        fetch('http://localhost:8080/api/groups', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(setGroups)
        .catch(console.error);
    }, []);

    return { groups, isLoading };
};