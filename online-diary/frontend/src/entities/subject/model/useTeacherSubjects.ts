"use client";
import { useState, useEffect } from "react";
import { getMySubjectsRequest } from "../api/subjectApi";
import { Subject } from "./types";

export const useTeacherSubjects = () => {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        getMySubjectsRequest(token)
            .then(setSubjects)
            .catch(err => console.error("Error loading teacher subjects:", err))
            .finally(() => setIsLoading(false));
    }, []);

    return { subjects, isLoading };
};