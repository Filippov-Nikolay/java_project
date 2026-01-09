package com.nikolay.onlinediary.service.impl;

import com.nikolay.onlinediary.domain.Group;
import com.nikolay.onlinediary.domain.Subject;
import com.nikolay.onlinediary.domain.User;
import com.nikolay.onlinediary.domain.enums.Role;
import com.nikolay.onlinediary.dto.SubjectDto;
import com.nikolay.onlinediary.dto.AssignTeacherDto;
import com.nikolay.onlinediary.dto.UserResponseDto;
import com.nikolay.onlinediary.exception.NotFoundException;
import com.nikolay.onlinediary.repository.GroupRepository;
import com.nikolay.onlinediary.repository.SubjectRepository;
import com.nikolay.onlinediary.repository.UserRepository;
import com.nikolay.onlinediary.service.api.ISubjectService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class SubjectServiceImpl implements ISubjectService {

    private final SubjectRepository subjectRepository;
    private final GroupRepository groupRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public List<SubjectDto> findAll() {
        return subjectRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public SubjectDto getById(Long id) {
        return subjectRepository.findById(id)
                .map(this::mapToDto)
                .orElseThrow(() -> new NotFoundException("Предмет", id));
    }

    @Override
    public SubjectDto create(SubjectDto dto) {
        log.info("Creating subject: {}", dto.getName());
        Subject subject = Subject.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .build();

        Subject savedSubject = subjectRepository.save(subject);
        return mapToDto(savedSubject);
    }

    @Override
    public SubjectDto update(Long id, SubjectDto dto) {
        log.info("Updating subject ID: {}", id);
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Предмет", id));

        subject.setName(dto.getName());
        subject.setDescription(dto.getDescription());

        Subject updatedSubject = subjectRepository.save(subject);
        return mapToDto(updatedSubject);
    }

    @Override
    public void delete(Long id) {
        log.warn("Deleting subject ID: {}", id);
        if (!subjectRepository.existsById(id)) {
            throw new NotFoundException("Предмет", id);
        }
        subjectRepository.deleteById(id);
    }

    @Override
    public void linkToGroup(Long subjectId, Long groupId) {
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new NotFoundException("Предмет", subjectId));
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new NotFoundException("Група", groupId));

        group.getSubjects().add(subject);
        groupRepository.save(group);
    }

    @Override
    @Transactional
    public void assignTeacherToSubject(AssignTeacherDto dto) {

        if (dto.getTeacherId() == null || dto.getSubjectId() == null || dto.getGroupId() == null) {
            log.error("Assignment failed: One of the IDs is null. DTO: {}", dto);
            throw new IllegalArgumentException("Вчитель, предмет та група мають бути обрані");
        }

        User teacher = userRepository.findById(dto.getTeacherId())
                .orElseThrow(() -> new NotFoundException("Вчитель", dto.getTeacherId()));

        if (teacher.getRole() != Role.TEACHER) {
            throw new IllegalArgumentException("Користувач не є викладачем");
        }

        Subject subject = subjectRepository.findById(dto.getSubjectId())
                .orElseThrow(() -> new NotFoundException("Предмет", dto.getSubjectId()));

        Group group = groupRepository.findById(dto.getGroupId())
                .orElseThrow(() -> new NotFoundException("Група", dto.getGroupId()));

        teacher.getSubjects().add(subject);
        group.getSubjects().add(subject);

        userRepository.save(teacher);
        groupRepository.save(group);

        log.info("Successfully assigned teacher {} to subject {} for group {}",
                teacher.getLastName(), subject.getName(), group.getName());
    }

    @Override
    @Transactional(readOnly = true)
    public List<SubjectDto> findByTeacherLogin(String login) {
        log.info("Finding subjects for teacher login: {}", login);

        return subjectRepository.findByTeachers_Login(login).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResponseDto> getTeachersBySubject(Long subjectId) {
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new NotFoundException("Предмет", subjectId));

        return subject.getTeachers().stream()
                .filter(User::isEnabled)
                .map(this::mapUserToDto)
                .collect(Collectors.toList());
    }

    private UserResponseDto mapUserToDto(User u) {
        return UserResponseDto.builder()
                .id(u.getId())
                .firstName(u.getFirstName())
                .lastName(u.getLastName())
                .role(u.getRole())
                .build();
    }

    private SubjectDto mapToDto(Subject subject) {
        return SubjectDto.builder()
                .id(subject.getId())
                .name(subject.getName())
                .description(subject.getDescription())
                .build();
    }
}