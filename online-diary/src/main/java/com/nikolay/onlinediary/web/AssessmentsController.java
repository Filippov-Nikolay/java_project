package com.nikolay.onlinediary.web;

import com.nikolay.onlinediary.domain.Assessment;
import com.nikolay.onlinediary.dto.AssessmentDto;
import com.nikolay.onlinediary.service.api.IAssessmentService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST endpoints for managing assessments.
 */
@RestController
@RequestMapping("/api/assessments")
public class AssessmentsController {

    private final IAssessmentService assessmentService;

    public AssessmentsController(IAssessmentService assessmentService) {
        this.assessmentService = assessmentService;
    }

    @GetMapping
    public List<Assessment> getAll() {
        return assessmentService.findAll();
    }

    @GetMapping("/{id}")
    public Assessment getById(@PathVariable Long id) {
        return assessmentService.getById(id);
    }

    @GetMapping(params = "submissionId")
    public List<Assessment> getBySubmission(@RequestParam Long submissionId) {
        return assessmentService.findBySubmissionId(submissionId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Assessment create(@RequestBody AssessmentDto dto) {
        return assessmentService.create(dto);
    }

    @PutMapping("/{id}")
    public Assessment update(@PathVariable Long id, @RequestBody AssessmentDto dto) {
        return assessmentService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        assessmentService.delete(id);
    }
}
