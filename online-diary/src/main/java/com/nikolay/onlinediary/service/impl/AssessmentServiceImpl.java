package com.nikolay.onlinediary.service.impl;

import com.nikolay.onlinediary.domain.Assessment;
import com.nikolay.onlinediary.dto.AssessmentDto;
import com.nikolay.onlinediary.exception.NotFoundException;
import com.nikolay.onlinediary.repository.AssessmentRepository;
import com.nikolay.onlinediary.service.api.IAssessmentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AssessmentServiceImpl implements IAssessmentService {

    private final AssessmentRepository repository;

    @Override
    @Transactional(readOnly = true)
    public List<AssessmentDto> findAll() {
        return repository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public AssessmentDto getById(Long id) {
        return repository.findById(id)
                .map(this::mapToDto)
                .orElseThrow(() -> new NotFoundException("Завдання", id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<AssessmentDto> findBySubmissionId(Long submissionId) {
        // Логіка пошуку за submissionId (якщо додасте метод в репозиторій)
        return List.of();
    }

    @Override
    @Transactional
    public AssessmentDto create(AssessmentDto dto) {
        log.info("Creating assessment: {}", dto.getTitle());
        Assessment assessment = Assessment.builder()
                .title(dto.getTitle())
                .deadline(dto.getAssessedAt())
                .pointsMax(dto.getGrade())
                .type("REGULAR")
                .build();

        return mapToDto(repository.save(assessment));
    }

    @Override
    @Transactional
    public AssessmentDto update(Long id, AssessmentDto dto) {
        log.info("Updating assessment ID: {}", id);
        Assessment assessment = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Завдання", id));

        assessment.setTitle(dto.getTitle());
        assessment.setDeadline(dto.getAssessedAt());

        return mapToDto(repository.save(assessment));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        log.warn("Deleting assessment ID: {}", id);
        if (!repository.existsById(id)) throw new NotFoundException("Завдання", id);
        repository.deleteById(id);
    }

    private AssessmentDto mapToDto(Assessment a) {
        return AssessmentDto.builder()
                .id(a.getId())
                .title(a.getTitle())
                .assessedAt(a.getDeadline())
                .grade(a.getPointsMax() != null ? a.getPointsMax() : 0)
                .build();
    }
}