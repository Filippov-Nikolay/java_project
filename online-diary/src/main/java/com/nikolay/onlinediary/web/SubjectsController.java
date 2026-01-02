package com.nikolay.onlinediary.web;

import com.nikolay.onlinediary.dto.SubjectDto;
import com.nikolay.onlinediary.dto.AssignTeacherDto;
import com.nikolay.onlinediary.dto.UserResponseDto;
import com.nikolay.onlinediary.service.api.ISubjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j; // Додано для логування
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity; // ЦЕЙ ІМПОРТ ВИПРАВЛЯЄ ПОМИЛКУ
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/subjects")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class SubjectsController {

    private final ISubjectService subjectService;

    @GetMapping
    public List<SubjectDto> getAll() {
        return subjectService.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SubjectDto create(@Valid @RequestBody SubjectDto dto) {
        log.info("REST request to create subject: {}", dto.getName());
        return subjectService.create(dto);
    }

    @PostMapping("/assign-teacher")
    public ResponseEntity<Void> assignTeacher(@Valid @RequestBody AssignTeacherDto dto) {
        log.info("REST request to assign teacher ID {} to subject ID {}", dto.getTeacherId(), dto.getSubjectId());
        subjectService.assignTeacherToSubject(dto);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        log.warn("REST request to delete subject ID: {}", id);
        subjectService.delete(id);
    }

    @GetMapping("/{id}/teachers")
    public List<UserResponseDto> getTeachersForSubject(@PathVariable Long id) {
        return subjectService.getTeachersBySubject(id);
    }
}