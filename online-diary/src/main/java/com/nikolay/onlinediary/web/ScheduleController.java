package com.nikolay.onlinediary.web;

import com.nikolay.onlinediary.domain.Schedule;
import com.nikolay.onlinediary.domain.User;
import com.nikolay.onlinediary.domain.enums.Role;
import com.nikolay.onlinediary.dto.ScheduleDto;
import com.nikolay.onlinediary.dto.ScheduleResponseDto;
import com.nikolay.onlinediary.repository.ScheduleRepository;
import com.nikolay.onlinediary.service.api.IScheduleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/schedule")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class ScheduleController {

    private final IScheduleService scheduleService;
    private final ScheduleRepository scheduleRepository;

    @GetMapping
    public ResponseEntity<List<ScheduleResponseDto>> getSchedule(@AuthenticationPrincipal User user, @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start, @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        if (user == null) return ResponseEntity.status(401).build();

        log.info("Schedule request from: {}, Role: {}", user.getLogin(), user.getRole());


        if (user.getRole() == Role.STUDENT && user.getGroup() != null) {
            return ResponseEntity.ok(scheduleService.findByGroup(user.getGroup().getId()));
        }


        if (user.getRole() == Role.TEACHER) {
            return ResponseEntity.ok(scheduleService.findByTeacher(user.getId()));
        }

        if (user.getRole() == Role.ADMIN) {
            return ResponseEntity.ok(scheduleService.findAll());
        }

        return ResponseEntity.ok(List.of());
    }

    @GetMapping("/item/{id}")
    public ResponseEntity<ScheduleResponseDto> getScheduleItem(@PathVariable Long id) {
        log.info("Fetching schedule item ID: {}", id);
        return ResponseEntity.ok(scheduleService.getById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ScheduleResponseDto> updateSchedule(@PathVariable Long id, @Valid @RequestBody ScheduleDto dto) {
        log.info("Updating schedule item ID: {}", id);
        return ResponseEntity.ok(scheduleService.update(id, dto));
    }

    @PostMapping
    public ScheduleResponseDto createSchedule(@RequestBody ScheduleDto dto) {
        log.info("REST request to add schedule: Group {}, Subject {}", dto.getGroupId(), dto.getSubjectId());
        return scheduleService.save(dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSchedule(@PathVariable Long id) {
        log.warn("REST request to delete schedule ID: {}", id);
        scheduleService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/import")
    public ResponseEntity<Map<String, String>> importSchedule(@RequestParam("file") MultipartFile file) {
        scheduleService.importFromExcel(file);
        return ResponseEntity.ok(Map.of("message", "Імпорт завершено"));
    }
}