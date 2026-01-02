package com.nikolay.onlinediary.service.api;

import com.nikolay.onlinediary.dto.ScheduleDto;
import com.nikolay.onlinediary.dto.ScheduleResponseDto;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public interface IScheduleService {
    ScheduleResponseDto save(ScheduleDto dto);

    List<ScheduleResponseDto> findByGroup(Long groupId);

    void delete(Long id);

    ScheduleResponseDto update(Long id, ScheduleDto dto);

    void importFromExcel(MultipartFile file);

    List<ScheduleResponseDto> findByTeacher(Long teacherId);
    List<ScheduleResponseDto> findAll();
    ScheduleResponseDto getById(Long id);
}