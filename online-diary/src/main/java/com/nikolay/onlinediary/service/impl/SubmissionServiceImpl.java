package com.nikolay.onlinediary.service.impl;

import com.nikolay.onlinediary.domain.Submission;
import com.nikolay.onlinediary.dto.SubmissionDto;
import com.nikolay.onlinediary.exception.NotFoundException;
import com.nikolay.onlinediary.repository.SubmissionRepository;
import com.nikolay.onlinediary.service.api.ISubmissionService;
import com.nikolay.onlinediary.service.factory.SubmissionFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class SubmissionServiceImpl implements ISubmissionService {

    private final SubmissionRepository submissionRepository;
    private final SubmissionFactory submissionFactory;

    public SubmissionServiceImpl(SubmissionRepository submissionRepository, SubmissionFactory submissionFactory) {
        this.submissionRepository = submissionRepository;
        this.submissionFactory = submissionFactory;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Submission> findAll() {
        return submissionRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Submission getById(Long id) {
        return submissionRepository.findById(id).orElseThrow(() -> new NotFoundException("Отправка", id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Submission> findByStudentId(Long studentId) {
        return submissionRepository.findByStudentId(studentId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Submission> findBySubjectId(Long subjectId) {
        return submissionRepository.findBySubjectId(subjectId);
    }

    @Override
    public Submission create(SubmissionDto dto) {
        Submission submission = submissionFactory.createFromDto(dto);
        return submissionRepository.create(submission);
    }

    @Override
    public Submission update(Long id, SubmissionDto dto) {
        Submission submission = getById(id);
        submissionFactory.applyDto(dto, submission);
        submissionRepository.update(submission);
        return submission;
    }

    @Override
    public void delete(Long id) {
        if (!submissionRepository.deleteById(id)) {
            throw new NotFoundException("Отправка", id);
        }
    }
}
