import { useState, useEffect } from "react";
import { Subject } from "./types";
import { subjectApi } from "../api/subjectApi";

export const useSubjects = () => {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchSubjects = async () => {
        setIsLoading(true);
        try {
            const data = await subjectApi.getAllSubjects();
            setSubjects(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSubjects();
    }, []);

    return { subjects, isLoading, error, refetch: fetchSubjects };
};