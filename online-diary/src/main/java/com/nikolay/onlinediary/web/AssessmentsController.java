package com.nikolay.onlinediary.web;

import com.nikolay.onlinediary.dto.AssessmentDto;
import com.nikolay.onlinediary.dto.GradeRequestDto;
import com.nikolay.onlinediary.dto.SubmissionResponseDto;
import com.nikolay.onlinediary.service.api.IAssessmentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/assessments")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AssessmentsController {

    private final IAssessmentService assessmentService;

    @GetMapping
    public List<AssessmentDto> getAll() {
        String login = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication().getName();

        var auth = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication();

        boolean isTeacher = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_TEACHER"));

        boolean isStudent = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_STUDENT"));

        // 1. Якщо це вчитель — повертаємо його завдання
        if (isTeacher) {
            log.info("Teacher {} requesting tasks", login);
            return assessmentService.findByTeacherLogin(login);
        }

        if (isStudent) {
            log.info("Student {} requesting tasks with statuses", login);
            return assessmentService.getHomeworksForStudent(login); // Виклик правильного методу!
        }

        // 3. Для адміна або інших ролей
        return assessmentService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<AssessmentDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(assessmentService.getById(id));
    }

    @GetMapping("/filter")
    public List<AssessmentDto> getByFilter(@RequestParam Long subjectId, @RequestParam Long groupId) {

        return assessmentService.findByFilter(subjectId, groupId);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    public AssessmentDto create(
            @RequestPart("title") String title,
            @RequestPart(value = "description", required = false) String description,
            @RequestPart("type") String type,
            @RequestPart("subjectId") String subjectId,
            @RequestPart("groupId") String groupId,
            @RequestPart("deadline") String deadline,
            @RequestPart(value = "pointsMax", required = false) String pointsMax,
            @RequestPart(value = "file", required = false) MultipartFile file,
            @RequestPart(value = "icon", required = false) MultipartFile icon) {

        AssessmentDto dto = AssessmentDto.builder()
                .title(title)
                .description(description)
                .type(type)
                .subjectId(Long.parseLong(subjectId))
                .groupId(Long.parseLong(groupId))
                .deadline(LocalDateTime.parse(deadline))
                .pointsMax(pointsMax != null ? Integer.parseInt(pointsMax) : 100)
                .build();

        return assessmentService.create(dto, file, icon);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public AssessmentDto update(@PathVariable Long id, @RequestBody AssessmentDto dto) {
        log.info("REST request to update assessment ID: {}", id);
        return assessmentService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        log.warn("REST request to delete assessment ID: {}", id);
        assessmentService.delete(id);
    }

    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public List<AssessmentDto> getMyAssessments() {
        // Отримуємо логін вчителя з контексту безпеки (JWT токен)
        String login = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication().getName();

        log.info("REST request to get assessments for current teacher: {}", login);
        // Викликаємо метод, який фільтрує завдання за логіном
        return assessmentService.findByTeacherLogin(login);
    }

    @GetMapping("/{id}/submissions")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public List<SubmissionResponseDto> getSubmissions(@PathVariable Long id) {
        log.info("REST request to get submissions for assessment ID: {}", id);
        return assessmentService.getAssessmentSubmissions(id); //
    }

    @PostMapping("/{assessmentId}/submissions/{studentId}/grade")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<Void> gradeSubmission(
            @PathVariable Long assessmentId,
            @PathVariable Long studentId,
            @RequestBody GradeRequestDto dto) {

        assessmentService.gradeSubmission(assessmentId, studentId, dto.getGrade(), dto.getFeedback());
        return ResponseEntity.ok().build();
    }
    @PostMapping(value = "/{id}/submit", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Void> submitTask(
            @PathVariable Long id,
            @RequestPart(value = "files", required = false) MultipartFile[] files,
            @RequestPart(value = "comment", required = false) String comment) {

        String login = SecurityContextHolder.getContext().getAuthentication().getName();
        assessmentService.submitWork(id, login, files, comment);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/submission")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Void> cancelSubmission(@PathVariable Long id) {
        String login = SecurityContextHolder.getContext().getAuthentication().getName();
        assessmentService.deleteSubmission(id, login);
        return ResponseEntity.ok().build();
    }
}