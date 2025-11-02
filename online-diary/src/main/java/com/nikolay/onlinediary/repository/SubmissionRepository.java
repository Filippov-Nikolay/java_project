package com.nikolay.onlinediary.repository;

import com.nikolay.onlinediary.domain.Submission;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface SubmissionRepository {
	 Submission create(Submission submission);

    Optional<Submission> findById(Long id);

    List<Submission> findAll();

    List<Submission> findByStudentId(Long studentId);

    List<Submission> findBySubjectId(Long subjectId);

    boolean update(Submission submission);

    boolean deleteById(Long id);

    int deleteOlderThan(LocalDateTime threshold);
}
