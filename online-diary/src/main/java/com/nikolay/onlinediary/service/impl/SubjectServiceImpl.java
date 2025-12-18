package com.nikolay.onlinediary.service.impl;

import com.nikolay.onlinediary.domain.Subject;
import com.nikolay.onlinediary.dto.SubjectDto;
import com.nikolay.onlinediary.exception.NotFoundException;
import com.nikolay.onlinediary.repository.SubjectRepository;
import com.nikolay.onlinediary.service.api.ISubjectService;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service layer for subjects with caching of the catalog.
 */
@Service
@Transactional
public class SubjectServiceImpl implements ISubjectService {

    private final SubjectRepository subjectRepository;

    public SubjectServiceImpl(SubjectRepository subjectRepository) {
        this.subjectRepository = subjectRepository;
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(cacheNames = "subjects")
    public List<Subject> findAll() {
        return subjectRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Subject getById(Long id) {
        return subjectRepository.findById(id).orElseThrow(() -> new NotFoundException("DY¥?DæD'D¬Dæ¥,", id));
    }

    @Override
    @CacheEvict(cacheNames = "subjects", allEntries = true)
    public Subject create(SubjectDto dto) {
        Subject subject = new Subject();
        subject.setName(dto.getName());
        subject.setDescription(dto.getDescription());
        return subjectRepository.create(subject);
    }

    @Override
    @CacheEvict(cacheNames = "subjects", allEntries = true)
    public Subject update(Long id, SubjectDto dto) {
        Subject subject = getById(id);
        subject.setName(dto.getName());
        subject.setDescription(dto.getDescription());
        subjectRepository.update(subject);
        return subject;
    }

    @Override
    @CacheEvict(cacheNames = "subjects", allEntries = true)
    public void delete(Long id) {
        if (!subjectRepository.deleteById(id)) {
            throw new NotFoundException("DY¥?DæD'D¬Dæ¥,", id);
        }
    }
}
