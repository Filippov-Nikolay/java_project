package com.nikolay.onlinediary.service.impl;

import com.nikolay.onlinediary.domain.Assessment;
import com.nikolay.onlinediary.dto.AssessmentDto;
import com.nikolay.onlinediary.exception.NotFoundException;
import com.nikolay.onlinediary.repository.AssessmentRepository;
import com.nikolay.onlinediary.service.api.IAssessmentService;
import com.nikolay.onlinediary.service.factory.AssessmentFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service layer orchestrating assessment persistence and mapping rules.
 */
@Service
@Transactional
public class AssessmentServiceImpl implements IAssessmentService {

    private final AssessmentRepository assessmentRepository;
    private final AssessmentFactory assessmentFactory;

    public AssessmentServiceImpl(AssessmentRepository assessmentRepository, AssessmentFactory assessmentFactory) {
        this.assessmentRepository = assessmentRepository;
        this.assessmentFactory = assessmentFactory;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Assessment> findAll() {
        return assessmentRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Assessment getById(Long id) {
        return assessmentRepository.findById(id).orElseThrow(() -> new NotFoundException("Dz¥+DæD«D§Dø", id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Assessment> findBySubmissionId(Long submissionId) {
        return assessmentRepository.findBySubmissionId(submissionId);
    }

    @Override
    public Assessment create(AssessmentDto dto) {
        Assessment assessment = assessmentFactory.createFromDto(dto);
        return assessmentRepository.create(assessment);
    }

    @Override
    public Assessment update(Long id, AssessmentDto dto) {
        Assessment assessment = getById(id);
        assessmentFactory.applyDto(dto, assessment);
        assessmentRepository.update(assessment);
        return assessment;
    }

    @Override
    public void delete(Long id) {
        if (!assessmentRepository.deleteById(id)) {
            throw new NotFoundException("Dz¥+DæD«D§Dø", id);
        }
    }
}
