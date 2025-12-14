package com.nikolay.onlinediary.service.impl;

import com.nikolay.onlinediary.domain.Group;
import com.nikolay.onlinediary.dto.GroupDto;
import com.nikolay.onlinediary.exception.NotFoundException;
import com.nikolay.onlinediary.repository.GroupRepository;
import com.nikolay.onlinediary.service.api.IGroupService;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class GroupServiceImpl implements IGroupService {

    private final GroupRepository groupRepository;

    public GroupServiceImpl(GroupRepository groupRepository) {
        this.groupRepository = groupRepository;
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(cacheNames = "groups")
    public List<Group> findAll() {
        return groupRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Group getById(Long id) {
        return groupRepository.findById(id).orElseThrow(() -> new NotFoundException("D\"¥?¥ŸD¨D¨Dø", id));
    }

    @Override
    @CacheEvict(cacheNames = "groups", allEntries = true)
    public Group create(GroupDto dto) {
        Group group = new Group();
        group.setName(dto.getName());
        group.setCourse(dto.getCourse());
        return groupRepository.create(group);
    }

    @Override
    @CacheEvict(cacheNames = "groups", allEntries = true)
    public Group update(Long id, GroupDto dto) {
        Group group = getById(id);
        group.setName(dto.getName());
        group.setCourse(dto.getCourse());
        groupRepository.update(group);
        return group;
    }

    @Override
    @CacheEvict(cacheNames = "groups", allEntries = true)
    public void delete(Long id) {
        if (!groupRepository.deleteById(id)) {
            throw new NotFoundException("D\"¥?¥ŸD¨D¨Dø", id);
        }
    }
}
