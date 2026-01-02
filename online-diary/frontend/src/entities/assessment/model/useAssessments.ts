import { useState, useEffect } from "react";
import { Assessment } from "./types";
import { assessmentApi } from "../api/assessmentApi";

export const useAssessments = (subjectId?: number, groupId?: number) => {
    const [data, setData] = useState<Assessment[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (subjectId && groupId) {
            setIsLoading(true);
            assessmentApi.getBySubject(subjectId, groupId)
                .then(setData)
                .finally(() => setIsLoading(false));
        }
    }, [subjectId, groupId]);

    return { assessments: data, isLoading };
};