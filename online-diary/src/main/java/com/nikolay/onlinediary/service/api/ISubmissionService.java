package com.nikolay.onlinediary.service.api;

import com.nikolay.onlinediary.domain.Submission;
import com.nikolay.onlinediary.dto.SubmissionDto;

import java.util.List;

public interface ISubmissionService {
    List<Submission> findAll();

    Submission getById(Long id);

    List<Submission> findByStudentId(Long studentId);

    List<Submission> findBySubjectId(Long subjectId);

    Submission create(SubmissionDto dto);

    Submission update(Long id, SubmissionDto dto);

    void delete(Long id);
}
