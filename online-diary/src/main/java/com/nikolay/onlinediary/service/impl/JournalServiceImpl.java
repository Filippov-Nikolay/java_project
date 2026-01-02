package com.nikolay.onlinediary.service.impl;

import com.nikolay.onlinediary.domain.JournalRecord;
import com.nikolay.onlinediary.domain.Schedule;
import com.nikolay.onlinediary.domain.User;
import com.nikolay.onlinediary.domain.enums.Role;
import com.nikolay.onlinediary.domain.enums.WorkType;
import com.nikolay.onlinediary.exception.NotFoundException;
import com.nikolay.onlinediary.repository.JournalRepository;
import com.nikolay.onlinediary.repository.ScheduleRepository;
import com.nikolay.onlinediary.repository.UserRepository;
import com.nikolay.onlinediary.service.api.IJournalService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class JournalServiceImpl implements IJournalService {

    private final JournalRepository journalRepository;
    private final ScheduleRepository scheduleRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public List<JournalRecord> getJournalBySchedule(Long scheduleId) {
        log.info("Fetching journal records for schedule ID: {}", scheduleId);

        // 1. Шукаємо існуючі записи в базі
        List<JournalRecord> existingRecords = journalRepository.findByScheduleIdOrderByStudentFullNameAsc(scheduleId);

        if (!existingRecords.isEmpty()) {
            // Оновлюємо ПІБ студентів (на випадок, якщо вони змінилися в профілі)
            existingRecords.forEach(record ->
                    userRepository.findById(record.getStudentId())
                            .ifPresent(u -> record.setStudentFullName(u.getLastName() + " " + u.getFirstName()))
            );
            return existingRecords;
        }

        // 2. Якщо записів немає, створюємо їх на основі активних студентів групи
        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new NotFoundException("Заняття", scheduleId));

        log.info("First time opening journal for group: {}. Generating student list.", schedule.getGroup().getName());

        List<User> students = userRepository.findByGroupIdAndRoleAndEnabledTrueOrderByLastNameAsc(
                schedule.getGroup().getId(),
                Role.STUDENT
        );

        return students.stream().map(student -> JournalRecord.builder()
                .scheduleId(scheduleId)
                .studentId(student.getId())
                .studentFullName(student.getLastName() + " " + student.getFirstName())
                .attendance(null)
                .grade("")
                .workType(WorkType.REGULAR)
                .build()
        ).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void saveAll(List<JournalRecord> records) {
        if (records == null || records.isEmpty()) return;

        log.info("Saving {} journal records", records.size());
        journalRepository.saveAll(records);
    }
}