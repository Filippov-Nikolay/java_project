
export const createHomeworkRequest = async (token: string | null, formData: FormData) => {
    if (!token) throw new Error("No token found");

    const response = await fetch('/api/assessments', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,

        },
        body: formData
    });

    if (!response.ok) throw new Error('Failed to create homework');
    return response.json();
};

export const getHomeworksRequest = async (token: string | null) => {
    if (!token) throw new Error("No token found");

    const response = await fetch('/api/assessments', {
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

export const getTeacherAssessmentsRequest = async (token: string | null) => {
    if (!token) throw new Error("No token found");

    const response = await fetch('/api/assessments/my', {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) throw new Error('Failed to fetch teacher assessments');
    return response.json();
};

export const getSubmissionsRequest = async (token: string | null, assessmentId: string | number) => {
    if (!token) throw new Error("Токен не знайдено");


    const response = await fetch(`/api/assessments/${assessmentId}/submissions`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Не вдалося завантажити список відповідей');
    }

    return response.json();
};


export const gradeSubmissionRequest = async (
    token: string | null, 
    assessmentId: string | number, 
    studentId: number, 
    data: { grade: number; feedback: string }
) => {
    if (!token) throw new Error("Токен не знайдено");

    const response = await fetch(`/api/assessments/${assessmentId}/submissions/${studentId}/grade`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },

        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error('Не вдалося зберегти оцінку');
    }

    return true;
};

export const deleteHomeworkRequest = async (token: string | null, id: number | string) => {
    if (!token) throw new Error("Токен не знайдено");

    const response = await fetch(`/api/assessments/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    });

    if (!response.ok) throw new Error('Не вдалося видалити завдання');
    return true;
};

export const deleteSubmissionRequest = async (token: string | null, id: number | string) => {
    if (!token) throw new Error("Токен не знайдено");

    const response = await fetch(`/api/assessments/${id}/submission`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    });

    if (!response.ok) throw new Error('Не вдалося скасувати здачу');
    return true;
};