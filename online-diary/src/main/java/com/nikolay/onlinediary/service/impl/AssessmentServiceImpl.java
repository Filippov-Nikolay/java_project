package com.nikolay.onlinediary.service.impl;

import com.nikolay.onlinediary.domain.*;
import com.nikolay.onlinediary.domain.enums.SubmissionStatus;
import com.nikolay.onlinediary.dto.AssessmentDto;
import com.nikolay.onlinediary.dto.SubmissionResponseDto;
import com.nikolay.onlinediary.exception.NotFoundException;
import com.nikolay.onlinediary.repository.*;
import com.nikolay.onlinediary.service.api.IAssessmentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import com.nikolay.onlinediary.domain.enums.Role;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;



@Slf4j
@Service
@RequiredArgsConstructor
public class AssessmentServiceImpl implements IAssessmentService {

    private final AssessmentRepository repository;
    private final SubjectRepository subjectRepository;
    private final GroupRepository groupRepository;
    private final UserRepository userRepository;
    private final SubmissionStudentRepository submissionStudentRepository;

    private final String UPLOAD_PATH = "uploads/submissions";
    private final String ICON_PATH = "uploads/icons";

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
    public List<AssessmentDto> findByFilter(Long subjectId, Long groupId) {
        return repository.findBySubjectIdAndGroupId(subjectId, groupId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public AssessmentDto create(AssessmentDto dto, MultipartFile file, MultipartFile icon) {
        String login = SecurityContextHolder.getContext().getAuthentication().getName();
        User teacher = userRepository.findByLoginAndEnabledTrue(login)
                .orElseThrow(() -> new NotFoundException("Teacher not found", 0L));

        String savedIconName = null;
        String savedFileName = null;

        try {

            if (icon != null && !icon.isEmpty()) {
                savedIconName = "icon_" + System.currentTimeMillis() + "_" + icon.getOriginalFilename();
                Path iconPath = Paths.get(ICON_PATH);
                if (!Files.exists(iconPath)) Files.createDirectories(iconPath);
                Files.write(iconPath.resolve(savedIconName), icon.getBytes());
            }

            if (file != null && !file.isEmpty()) {

                savedFileName = file.getOriginalFilename();
                Path filePath = Paths.get(UPLOAD_PATH);
                if (!Files.exists(filePath)) Files.createDirectories(filePath);

                Files.write(filePath.resolve(savedFileName), file.getBytes());
            }
        } catch (IOException e) {
            log.error("Помилка при збереженні файлів завдання: {}", e.getMessage());
            throw new RuntimeException("Не вдалося зберегти файли завдання на сервері", e);
        }

        Assessment assessment = Assessment.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .type(dto.getType() != null ? dto.getType() : "HOMEWORK")
                .deadline(dto.getDeadline())
                .pointsMax(12)
                .subject(subjectRepository.findById(dto.getSubjectId()).orElseThrow())
                .group(groupRepository.findById(dto.getGroupId()).orElseThrow())
                .teacher(teacher)
                .fileName(savedFileName)
                .iconFileName(savedIconName)
                .build();

        return mapToDto(repository.save(assessment));
    }

    @Override
    @Transactional
    public AssessmentDto update(Long id, AssessmentDto dto) {
        Assessment assessment = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Завдання", id));
        assessment.setTitle(dto.getTitle());
        assessment.setDeadline(dto.getDeadline());
        assessment.setDescription(dto.getDescription());
        return mapToDto(repository.save(assessment));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) throw new NotFoundException("Завдання", id);
        repository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AssessmentDto> findByTeacherLogin(String login) {
        return repository.findByTeacherLogin(login).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<SubmissionResponseDto> getAssessmentSubmissions(Long assessmentId) {
        Assessment assessment = repository.findById(assessmentId)
                .orElseThrow(() -> new NotFoundException("Завдання", assessmentId));

        // ВИПРАВЛЕНО: Замість assessment.getGroup().getStudents() використовуємо твій репозиторій
        // Це відфільтрує видалених (enabled=false) та відсортує за прізвищем
        List<User> students = userRepository.findByGroupIdAndRoleAndEnabledTrueOrderByLastNameAsc(
                assessment.getGroup().getId(),
                Role.STUDENT
        );

        List<SubmissionStudent> submissions = submissionStudentRepository.findByAssessmentId(assessmentId);

        return students.stream().map(student -> {
            Optional<SubmissionStudent> submission = submissions.stream()
                    .filter(s -> s.getStudent().getId().equals(student.getId()))
                    .findFirst();

            return SubmissionResponseDto.builder()
                    .studentId(student.getId())
                    .studentName(student.getLastName() + " " + student.getFirstName())
                    .submitted(submission.isPresent())
                    .submittedAt(submission.map(SubmissionStudent::getSubmittedAt).orElse(null))
                    .fileName(submission.map(SubmissionStudent::getFileName).orElse(null))
                    .studentComment(submission.map(SubmissionStudent::getStudentComment).orElse(null))
                    .grade(submission.map(SubmissionStudent::getGrade).orElse(null))
                    .feedback(submission.map(SubmissionStudent::getFeedback).orElse(null))
                    // Можна додати прапорець для фронта, хоча тут будуть лише активні
                    .build();
        }).collect(Collectors.toList());
    }

    @Transactional
    public void gradeSubmission(Long assessmentId, Long studentId, Integer grade, String feedback) {
        SubmissionStudent submission = submissionStudentRepository
                .findByAssessmentIdAndStudentId(assessmentId, studentId)
                .orElseThrow(() -> new NotFoundException("Відповідь студента не знайдена", studentId));

        Assessment assessment = submission.getAssessment();

        boolean isOverdue = LocalDateTime.now().isAfter(assessment.getDeadline());

        if (grade != null) {
            if (isOverdue && grade > 10) {
                throw new IllegalArgumentException("Максимальна оцінка за прострочене завдання — 10 балів");
            }
            if (grade < 0 || grade > 12) {
                throw new IllegalArgumentException("Оцінка повинна бути в діапазоні від 0 до 12");
            }
        }

        submission.setGrade(grade);
        submission.setFeedback(feedback);
        submissionStudentRepository.save(submission);
    }

    @Override
    @Transactional
    public void submitWork(Long id, String login, MultipartFile[] files, String comment) {
        Assessment assessment = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Завдання не знайдено"));

        User student = userRepository.findByLoginAndEnabledTrue(login)
                .orElseThrow(() -> new RuntimeException("Студент не знайдений"));

        SubmissionStudent submission = submissionStudentRepository
                .findByAssessmentIdAndStudentId(id, student.getId())
                .orElse(new SubmissionStudent());

        submission.setAssessment(assessment);
        submission.setStudent(student);
        submission.setStudentComment(comment);
        submission.setSubmittedAt(LocalDateTime.now());

        if (files != null && files.length > 0) {
            try {
                String groupName = student.getGroup() != null ? student.getGroup().getName() : "Unknown";
                String zipFileName = String.format("%s_%s_%s.zip",
                        student.getLastName(), student.getFirstName(), groupName);

                ByteArrayOutputStream baos = new ByteArrayOutputStream();
                try (ZipOutputStream zos = new ZipOutputStream(baos)) {
                    for (MultipartFile file : files) {
                        if (file.isEmpty()) continue;
                        ZipEntry entry = new ZipEntry(file.getOriginalFilename());
                        zos.putNextEntry(entry);
                        zos.write(file.getBytes());
                        zos.closeEntry();
                    }
                }

                Path root = Paths.get(UPLOAD_PATH);
                if (!Files.exists(root)) {
                    Files.createDirectories(root);
                }
                Files.write(root.resolve(zipFileName), baos.toByteArray());


                submission.setFileName(zipFileName);
                log.info("File {} saved to disk for student {}", zipFileName, login);

            } catch (IOException e) {
                log.error("Failed to save submission file", e);
                throw new RuntimeException("Помилка при збереженні файлів", e);
            }
        }
        submissionStudentRepository.save(submission);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AssessmentDto> getHomeworksForStudent(String login) {
        User student = userRepository.findByLoginAndEnabledTrue(login)
                .orElseThrow(() -> new NotFoundException("Учня не знайдено", 0L));

        List<Assessment> assessments = repository.findByGroupId(student.getGroup().getId());

        return assessments.stream().map(a -> {
            Optional<SubmissionStudent> sub = submissionStudentRepository
                    .findByAssessmentIdAndStudentId(a.getId(), student.getId());

            SubmissionStatus status = SubmissionStatus.TODO;
            Integer grade = null;
            String feedback = null;
            String studentFile = null;

            if (sub.isPresent()) {
                SubmissionStudent s = sub.get();
                grade = s.getGrade();
                feedback = s.getFeedback();
                studentFile = s.getFileName();
                status = (grade != null) ? SubmissionStatus.DONE : SubmissionStatus.PENDING;
            }

            return AssessmentDto.builder()
                    .id(a.getId())
                    .title(a.getTitle())
                    .description(a.getDescription())
                    .pointsMax(a.getPointsMax())
                    .deadline(a.getDeadline())
                    .createdAt(a.getCreatedAt())
                    .subjectName(a.getSubject().getName())
                    .teacherName(a.getTeacher().getLastName() + " " + a.getTeacher().getFirstName())
                    .status(status.name().toLowerCase())
                    .grade(grade)
                    .feedback(feedback)
                    .submissionFileName(studentFile) 

                    .iconFileName(a.getIconFileName())
                    .fileName(a.getFileName())    

                    .build();
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteSubmission(Long assessmentId, String login) {
        User student = userRepository.findByLoginAndEnabledTrue(login)
                .orElseThrow(() -> new NotFoundException("Студент не знайдений", 0L));
        submissionStudentRepository.deleteByAssessmentIdAndStudentId(assessmentId, student.getId());
    }

    private AssessmentDto mapToDto(Assessment a) {
        String teacherFullName = (a.getTeacher() != null)
                ? a.getTeacher().getLastName() + " " + a.getTeacher().getFirstName()
                : "Не вказано";

        return AssessmentDto.builder()
                .id(a.getId())
                .title(a.getTitle())
                .description(a.getDescription())
                .type(a.getType())
                .deadline(a.getDeadline())
                .createdAt(a.getCreatedAt())
                .pointsMax(a.getPointsMax() != null ? a.getPointsMax() : 0)
                .subjectId(a.getSubject().getId())
                .subjectName(a.getSubject().getName())
                .groupId(a.getGroup().getId())
                .groupName(a.getGroup().getName())
                .teacherName(teacherFullName)

                .iconFileName(a.getIconFileName())

                .submissionCount(a.getSubmissions() != null ? a.getSubmissions().size() : 0)
                .totalStudents(a.getGroup() != null && a.getGroup().getStudents() != null
                        ? a.getGroup().getStudents().size() : 0)
                .build();
    }
}