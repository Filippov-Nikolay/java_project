package com.nikolay.onlinediary.service.impl;

import com.nikolay.onlinediary.domain.Group;
import com.nikolay.onlinediary.dto.GroupDto;
import com.nikolay.onlinediary.exception.NotFoundException;
import com.nikolay.onlinediary.repository.GroupRepository;
import com.nikolay.onlinediary.service.api.IGroupService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class GroupServiceImpl implements IGroupService {

    private final GroupRepository groupRepository;

    @Override
    @Transactional(readOnly = true)
    public List<GroupDto> findAll() {
        return groupRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public GroupDto getById(Long id) {
        return groupRepository.findById(id)
                .map(this::mapToDto)
                .orElseThrow(() -> new NotFoundException("Група", id));
    }

    @Override
    @Transactional
    public GroupDto create(GroupDto dto) {
        log.info("Creating group: {}", dto.getName());
        Group group = Group.builder()
                .name(dto.getName())
                .course(dto.getCourse() != null ? dto.getCourse() : 1)
                .build();
        return mapToDto(groupRepository.save(group));
    }

    @Override
    @Transactional
    public GroupDto update(Long id, GroupDto dto) {
        Group group = groupRepository.findById(id).orElseThrow(() -> new NotFoundException("Група", id));
        group.setName(dto.getName());
        group.setCourse(dto.getCourse());
        return mapToDto(groupRepository.save(group));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (!groupRepository.existsById(id)) throw new NotFoundException("Група", id);
        groupRepository.deleteById(id);
    }

    private GroupDto mapToDto(Group g) {
        return GroupDto.builder().id(g.getId()).name(g.getName()).course(g.getCourse()).build();
    }
}