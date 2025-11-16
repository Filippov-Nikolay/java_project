package com.nikolay.onlinediary.service.api;

import com.nikolay.onlinediary.domain.Subject;
import com.nikolay.onlinediary.dto.SubjectDto;

import java.util.List;

public interface ISubjectService {
    List<Subject> findAll();

    Subject getById(Long id);

    Subject create(SubjectDto dto);

    Subject update(Long id, SubjectDto dto);

    void delete(Long id);
}
