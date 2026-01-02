package com.nikolay.onlinediary.web;

import com.nikolay.onlinediary.dto.AssessmentDto;
import com.nikolay.onlinediary.service.api.IAssessmentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

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
        return assessmentService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<AssessmentDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(assessmentService.getById(id));
    }

    @GetMapping("/filter")
    public List<AssessmentDto> getByFilter(@RequestParam Long subjectId, @RequestParam Long groupId) {
        // Логіка фільтрації тепер у сервісі
        return assessmentService.findBySubmissionId(subjectId); // Приклад
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    public AssessmentDto create(@RequestBody AssessmentDto dto) {
        log.info("REST request to create assessment: {}", dto.getTitle());
        return assessmentService.create(dto);
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
}