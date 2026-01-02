package com.nikolay.onlinediary.service.api;

import com.nikolay.onlinediary.dto.SubjectDto;
import com.nikolay.onlinediary.dto.AssignTeacherDto;
import com.nikolay.onlinediary.dto.UserResponseDto;

import java.util.List;

public interface ISubjectService {
    List<SubjectDto> findAll();

    SubjectDto getById(Long id);

    SubjectDto create(SubjectDto dto);

    SubjectDto update(Long id, SubjectDto dto);

    void delete(Long id);

    void linkToGroup(Long subjectId, Long groupId);

    void assignTeacherToSubject(AssignTeacherDto dto);

    List<UserResponseDto> getTeachersBySubject(Long subjectId);
}