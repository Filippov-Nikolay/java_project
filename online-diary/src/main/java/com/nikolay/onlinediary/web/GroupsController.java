package com.nikolay.onlinediary.web;

import com.nikolay.onlinediary.domain.Group;
import com.nikolay.onlinediary.dto.GroupDto;
import com.nikolay.onlinediary.service.api.IGroupService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for CRUD operations on groups.
 */
@RestController
@RequestMapping("/api/groups")
public class GroupsController {

    private final IGroupService groupService;

    public GroupsController(IGroupService groupService) {
        this.groupService = groupService;
    }

    @GetMapping
    public List<Group> getAll() {
        return groupService.findAll();
    }

    @GetMapping("/{id}")
    public Group getById(@PathVariable Long id) {
        return groupService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Group create(@RequestBody GroupDto dto) {
        return groupService.create(dto);
    }

    @PutMapping("/{id}")
    public Group update(@PathVariable Long id, @RequestBody GroupDto dto) {
        return groupService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        groupService.delete(id);
    }
}
