package com.nikolay.onlinediary.service.api;

import com.nikolay.onlinediary.domain.Assessment;
import com.nikolay.onlinediary.dto.AssessmentDto;

import java.util.List;

/**
 * Business operations around assessments.
 */
public interface IAssessmentService {
    List<Assessment> findAll();

    Assessment getById(Long id);

    List<Assessment> findBySubmissionId(Long submissionId);

    Assessment create(AssessmentDto dto);

    Assessment update(Long id, AssessmentDto dto);

    void delete(Long id);
}
