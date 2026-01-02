package com.nikolay.onlinediary.web;

import com.nikolay.onlinediary.dto.GroupDto;
import com.nikolay.onlinediary.service.api.IGroupService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/groups")
@RequiredArgsConstructor
public class GroupsController {

    private final IGroupService groupService;

    @GetMapping
    public List<GroupDto> getAll() {
        return groupService.findAll();
    }

    @GetMapping("/{id}")
    public GroupDto getById(@PathVariable Long id) {
        return groupService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public GroupDto create(@Valid @RequestBody GroupDto dto) {
        return groupService.create(dto);
    }

    @PutMapping("/{id}")
    public GroupDto update(@PathVariable Long id, @Valid @RequestBody GroupDto dto) {
        return groupService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        groupService.delete(id);
    }
}