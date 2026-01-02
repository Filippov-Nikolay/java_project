package com.nikolay.onlinediary.web;

import com.nikolay.onlinediary.dto.SubmissionDto;
import com.nikolay.onlinediary.service.api.ISubmissionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/submissions")
@RequiredArgsConstructor // Автоматично створює конструктор для final полів
@CrossOrigin(origins = "http://localhost:3000")
public class SubmissionsController {

    private final ISubmissionService submissionService;

    @GetMapping
    public List<SubmissionDto> getAll() {
        return submissionService.findAll();
    }

    @GetMapping("/{id}")
    public SubmissionDto getById(@PathVariable Long id) {
        return submissionService.getById(id);
    }

    @GetMapping(params = "studentId")
    public List<SubmissionDto> getByStudent(@RequestParam Long studentId) {
        return submissionService.findByStudentId(studentId);
    }

    @GetMapping(params = "subjectId")
    public List<SubmissionDto> getBySubject(@RequestParam Long subjectId) {
        return submissionService.findBySubjectId(subjectId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SubmissionDto create(@RequestBody SubmissionDto dto) {
        log.info("REST request to create submission for student ID: {}", dto.getStudentId());
        return submissionService.create(dto);
    }

    @PutMapping("/{id}")
    public SubmissionDto update(@PathVariable Long id, @RequestBody SubmissionDto dto) {
        log.info("REST request to update submission ID: {}", id);
        return submissionService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        log.warn("REST request to delete submission ID: {}", id);
        submissionService.delete(id);
    }
}