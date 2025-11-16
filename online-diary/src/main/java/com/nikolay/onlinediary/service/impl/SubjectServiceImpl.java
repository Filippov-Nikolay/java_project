package com.nikolay.onlinediary.service.impl;

import com.nikolay.onlinediary.domain.Subject;
import com.nikolay.onlinediary.dto.SubjectDto;
import com.nikolay.onlinediary.exception.NotFoundException;
import com.nikolay.onlinediary.repository.SubjectRepository;
import com.nikolay.onlinediary.service.api.ISubjectService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class SubjectServiceImpl implements ISubjectService {

    private final SubjectRepository subjectRepository;

    public SubjectServiceImpl(SubjectRepository subjectRepository) {
        this.subjectRepository = subjectRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Subject> findAll() {
        return subjectRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Subject getById(Long id) {
        return subjectRepository.findById(id).orElseThrow(() -> new NotFoundException("Предмет", id));
    }

    @Override
    public Subject create(SubjectDto dto) {
        Subject subject = new Subject();
        subject.setName(dto.getName());
        subject.setDescription(dto.getDescription());
        return subjectRepository.create(subject);
    }

    @Override
    public Subject update(Long id, SubjectDto dto) {
        Subject subject = getById(id);
        subject.setName(dto.getName());
        subject.setDescription(dto.getDescription());
        subjectRepository.update(subject);
        return subject;
    }

    @Override
    public void delete(Long id) {
        if (!subjectRepository.deleteById(id)) {
            throw new NotFoundException("Предмет", id);
        }
    }
}
