package com.nikolay.onlinediary.repository;

import com.nikolay.onlinediary.domain.SubmissionStudent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface SubmissionStudentRepository extends JpaRepository<SubmissionStudent, Long> {
    List<SubmissionStudent> findByAssessmentId(Long assessmentId);
    Optional<SubmissionStudent> findByAssessmentIdAndStudentId(Long assessmentId, Long studentId);

    void deleteByAssessmentIdAndStudentId(Long assessmentId, Long id);

    List<SubmissionStudent> findByStudentId(Long studentId);
}