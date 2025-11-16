package com.nikolay.onlinediary.service.impl;

import com.nikolay.onlinediary.domain.Assessment;
import com.nikolay.onlinediary.dto.AssessmentDto;
import com.nikolay.onlinediary.exception.NotFoundException;
import com.nikolay.onlinediary.repository.AssessmentRepository;
import com.nikolay.onlinediary.service.api.IAssessmentService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class AssessmentServiceImpl implements IAssessmentService {

    private final AssessmentRepository assessmentRepository;

    public AssessmentServiceImpl(AssessmentRepository assessmentRepository) {
        this.assessmentRepository = assessmentRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Assessment> findAll() {
        return assessmentRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Assessment getById(Long id) {
        return assessmentRepository.findById(id).orElseThrow(() -> new NotFoundException("Оценка", id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Assessment> findBySubmissionId(Long submissionId) {
        return assessmentRepository.findBySubmissionId(submissionId);
    }

    @Override
    public Assessment create(AssessmentDto dto) {
        Assessment assessment = new Assessment();
        assessment.setSubmissionId(dto.getSubmissionId());
        assessment.setTeacherId(dto.getTeacherId());
        assessment.setGrade(dto.getGrade());
        assessment.setComment(dto.getComment());
        assessment.setAssessedAt(dto.getAssessedAt() != null ? dto.getAssessedAt() : LocalDateTime.now());
        return assessmentRepository.create(assessment);
    }

    @Override
    public Assessment update(Long id, AssessmentDto dto) {
        Assessment assessment = getById(id);
        assessment.setSubmissionId(dto.getSubmissionId());
        assessment.setTeacherId(dto.getTeacherId());
        assessment.setGrade(dto.getGrade());
        assessment.setComment(dto.getComment());
        assessment.setAssessedAt(dto.getAssessedAt() != null ? dto.getAssessedAt() : LocalDateTime.now());
        assessmentRepository.update(assessment);
        return assessment;
    }

    @Override
    public void delete(Long id) {
        if (!assessmentRepository.deleteById(id)) {
            throw new NotFoundException("Оценка", id);
        }
    }
}
