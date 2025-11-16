package com.nikolay.onlinediary.service.api;

import com.nikolay.onlinediary.domain.Group;
import com.nikolay.onlinediary.dto.GroupDto;

import java.util.List;

public interface IGroupService {
    List<Group> findAll();

    Group getById(Long id);

    Group create(GroupDto dto);

    Group update(Long id, GroupDto dto);

    void delete(Long id);
}
