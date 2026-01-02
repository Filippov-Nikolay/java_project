package com.nikolay.onlinediary.repository;

import com.nikolay.onlinediary.domain.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    List<Submission> findByStudentIdOrderBySubmittedAtDesc(Long studentId);
    List<Submission> findBySubjectId(Long subjectId);
}