package com.nikolay.onlinediary.repository;

import com.nikolay.onlinediary.domain.Assessment;

import java.util.List;
import java.util.Optional;

public interface AssessmentRepository {
	Assessment create(Assessment assessment);

    Optional<Assessment> findById(Long id);

    List<Assessment> findAll();

    List<Assessment> findBySubmissionId(Long submissionId);

    boolean update(Assessment assessment);

    boolean deleteById(Long id);
}
