package com.nikolay.onlinediary.service.impl;

import com.nikolay.onlinediary.domain.Submission;
import com.nikolay.onlinediary.dto.SubmissionDto;
import com.nikolay.onlinediary.exception.NotFoundException;
import com.nikolay.onlinediary.repository.SubmissionRepository;
import com.nikolay.onlinediary.service.api.ISubmissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubmissionServiceImpl implements ISubmissionService {

    private final SubmissionRepository repository;

    @Override
    @Transactional(readOnly = true)
    public List<SubmissionDto> findAll() {
        return repository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public SubmissionDto getById(Long id) {
        return repository.findById(id).map(this::mapToDto).orElseThrow(() -> new NotFoundException("Робота", id));
    }

    @Override
    @Transactional
    public SubmissionDto create(SubmissionDto dto) {
        Submission submission = Submission.builder()
                .studentId(dto.getStudentId())
                .subjectId(dto.getSubjectId())
                .content(dto.getContent())
                .submittedAt(LocalDateTime.now())
                .status("TODO")
                .build();
        return mapToDto(repository.save(submission));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        repository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SubmissionDto> findByStudentId(Long studentId) {
        return repository.findByStudentIdOrderBySubmittedAtDesc(studentId).stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<SubmissionDto> findBySubjectId(Long subjectId) {
        return repository.findBySubjectId(subjectId).stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public SubmissionDto update(Long id, SubmissionDto dto) {
        Submission s = repository.findById(id).orElseThrow(() -> new NotFoundException("Робота", id));
        s.setContent(dto.getContent());
        return mapToDto(repository.save(s));
    }

    private SubmissionDto mapToDto(Submission s) {
        return SubmissionDto.builder()
                .id(s.getId())
                .studentId(s.getStudentId())
                .subjectId(s.getSubjectId())
                .content(s.getContent())
                .submittedAt(s.getSubmittedAt())
                .status(s.getStatus())
                .points(s.getPoints())
                .build();
    }
}