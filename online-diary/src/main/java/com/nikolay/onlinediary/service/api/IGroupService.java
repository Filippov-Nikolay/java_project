package com.nikolay.onlinediary.service.api;

import com.nikolay.onlinediary.dto.GroupDto;
import java.util.List;

public interface IGroupService {
    List<GroupDto> findAll();

    GroupDto getById(Long id);

    GroupDto create(GroupDto dto);

    GroupDto update(Long id, GroupDto dto);

    void delete(Long id);
}