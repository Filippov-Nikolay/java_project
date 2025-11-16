package com.nikolay.onlinediary.web;

import com.nikolay.onlinediary.domain.Subject;
import com.nikolay.onlinediary.dto.SubjectDto;
import com.nikolay.onlinediary.service.api.ISubjectService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subjects")
public class SubjectsController {

    private final ISubjectService subjectService;

    public SubjectsController(ISubjectService subjectService) {
        this.subjectService = subjectService;
    }

    @GetMapping
    public List<Subject> getAll() {
        return subjectService.findAll();
    }

    @GetMapping("/{id}")
    public Subject getById(@PathVariable Long id) {
        return subjectService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Subject create(@RequestBody SubjectDto dto) {
        return subjectService.create(dto);
    }

    @PutMapping("/{id}")
    public Subject update(@PathVariable Long id, @RequestBody SubjectDto dto) {
        return subjectService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        subjectService.delete(id);
    }
}
