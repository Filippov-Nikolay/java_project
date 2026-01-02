package com.nikolay.onlinediary.service.api;

import com.nikolay.onlinediary.dto.AssessmentDto;
import java.util.List;

public interface IAssessmentService {
    List<AssessmentDto> findAll();

    AssessmentDto getById(Long id);

    List<AssessmentDto> findBySubmissionId(Long submissionId);

    AssessmentDto create(AssessmentDto dto);

    AssessmentDto update(Long id, AssessmentDto dto);

    void delete(Long id);
}