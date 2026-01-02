package com.nikolay.onlinediary.service.api;

import com.nikolay.onlinediary.dto.SubmissionDto;
import java.util.List;

public interface ISubmissionService {
    List<SubmissionDto> findAll();

    SubmissionDto getById(Long id);

    List<SubmissionDto> findByStudentId(Long studentId);

    List<SubmissionDto> findBySubjectId(Long subjectId);

    SubmissionDto create(SubmissionDto dto);

    SubmissionDto update(Long id, SubmissionDto dto);

    void delete(Long id);
}