package com.nikolay.onlinediary.web;

import com.nikolay.onlinediary.domain.Submission;
import com.nikolay.onlinediary.dto.SubmissionDto;
import com.nikolay.onlinediary.service.api.ISubmissionService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for homework submissions.
 */
@RestController
@RequestMapping("/api/submissions")
public class SubmissionsController {

    private final ISubmissionService submissionService;

    public SubmissionsController(ISubmissionService submissionService) {
        this.submissionService = submissionService;
    }

    @GetMapping
    public List<Submission> getAll() {
        return submissionService.findAll();
    }

    @GetMapping("/{id}")
    public Submission getById(@PathVariable Long id) {
        return submissionService.getById(id);
    }

    @GetMapping(params = "studentId")
    public List<Submission> getByStudent(@RequestParam Long studentId) {
        return submissionService.findByStudentId(studentId);
    }

    @GetMapping(params = "subjectId")
    public List<Submission> getBySubject(@RequestParam Long subjectId) {
        return submissionService.findBySubjectId(subjectId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Submission create(@RequestBody SubmissionDto dto) {
        return submissionService.create(dto);
    }

    @PutMapping("/{id}")
    public Submission update(@PathVariable Long id, @RequestBody SubmissionDto dto) {
        return submissionService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        submissionService.delete(id);
    }
}
