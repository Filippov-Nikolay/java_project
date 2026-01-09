package com.nikolay.onlinediary.service.impl;

import com.nikolay.onlinediary.domain.*;
import com.nikolay.onlinediary.domain.enums.*;
import com.nikolay.onlinediary.dto.*;
import com.nikolay.onlinediary.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class StatsServiceImpl {
    private final JournalRepository journalRepository;
    private final UserRepository userRepository;
    private final SubmissionStudentRepository submissionRepository;
    private final ScheduleRepository scheduleRepository;        

    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMM", new Locale("uk"));


    @Transactional(readOnly = true)
    public List<AccrualDto> getStudentHistory(String login) {
        User student = userRepository.findByLoginAndEnabledTrue(login)
                .orElseThrow(() -> new RuntimeException("Студента не знайдено"));

        List<AccrualDto> history = new ArrayList<>();

        // 1. Оцінки з журналу (робота на парах)
        journalRepository.findByStudentId(student.getId()).forEach(record -> {
            if (record.getGrade() != null && !record.getGrade().isEmpty()) {
                Schedule sc = scheduleRepository.findById(record.getScheduleId()).orElse(null);
                history.add(AccrualDto.builder()
                        .id("jr_" + record.getId())
                        .subject(sc != null ? sc.getSubject().getName() : "Предмет")
                        .title(mapWorkType(record.getWorkType()))
                        .kind("classwork")
                        .score(Double.parseDouble(record.getGrade()))
                        .maxScore(12)
                        .date(record.getUpdatedAt().format(formatter))
                        .build());
            }
        });

        submissionRepository.findByStudentId(student.getId()).stream()
                .filter(s -> s.getGrade() != null)
                .forEach(s -> history.add(AccrualDto.builder()
                        .id("sub_" + s.getId())
                        .subject(s.getAssessment().getSubject().getName())
                        .title(s.getAssessment().getTitle())
                        .kind("homework")
                        .score(s.getGrade().doubleValue())
                        .maxScore(s.getAssessment().getPointsMax())
                        .date(s.getSubmittedAt().format(formatter))
                        .build()));

        return history.stream()
                .sorted((a, b) -> b.getId().compareTo(a.getId()))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public DashboardStatsDto calculateStats(String login) {
        User student = userRepository.findByLoginAndEnabledTrue(login).orElseThrow();

        List<JournalRecord> journalRecords = journalRepository.findByStudentId(student.getId());

        List<SubmissionStudent> homeworkSubmissions = submissionRepository.findByStudentId(student.getId())
                .stream()
                .filter(s -> s.getGrade() != null)
                .toList();

        Double independentAvg = calculateIndependentAvg(journalRecords, homeworkSubmissions);

        List<SubjectStatDto> stats = List.of(
                new SubjectStatDto("Класна робота", getAvg(journalRecords, WorkType.CLASSWORK), 12, "#6366f1"),
                new SubjectStatDto("Самостійна", independentAvg, 12, "#22c55e"), // Оновлено
                new SubjectStatDto("Контрольні", getAvg(journalRecords, WorkType.TEST), 12, "#f59e0b"),
                new SubjectStatDto("Екзамен", getAvg(journalRecords, WorkType.EXAM), 12, "#ef4444")
        );

        List<SkillDto> skills = new ArrayList<>();
        skills.add(new SkillDto("Відвідуваність", calculateAttendance(journalRecords)));
        skills.add(new SkillDto("Класна робота", getPercent(journalRecords, WorkType.CLASSWORK)));
        skills.add(new SkillDto("Самостійна", (int)((independentAvg * 100) / 12))); // Оновлено
        skills.add(new SkillDto("Контрольні", getPercent(journalRecords, WorkType.TEST)));
        skills.add(new SkillDto("Екзамен", getPercent(journalRecords, WorkType.EXAM)));

        return DashboardStatsDto.builder()
                .stats(stats)
                .skills(skills)
                .build();
    }

    private Double calculateIndependentAvg(List<JournalRecord> records, List<SubmissionStudent> submissions) {
        List<Double> allGrades = new ArrayList<>();

        records.stream()
                .filter(r -> r.getWorkType() == WorkType.INDEPENDENT && r.getGrade() != null && !r.getGrade().isEmpty())
                .map(r -> Double.parseDouble(r.getGrade()))
                .forEach(allGrades::add);

        submissions.stream()
                .map(s -> s.getGrade().doubleValue())
                .forEach(allGrades::add);

        return allGrades.stream().mapToDouble(Double::doubleValue).average().orElse(0.0);
    }

    private Double getAvg(List<JournalRecord> records, WorkType type) {
        return records.stream()
                .filter(r -> r.getWorkType() == type && r.getGrade() != null && !r.getGrade().isEmpty())
                .mapToDouble(r -> Double.parseDouble(r.getGrade()))
                .average().orElse(0.0);
    }

    private Integer getPercent(List<JournalRecord> records, WorkType type) {
        double avg = getAvg(records, type);
        return (int) ((avg * 100) / 12);
    }

    private Integer calculateAttendance(List<JournalRecord> records) {
        if (records.isEmpty()) return 0;
        long present = records.stream().filter(r -> r.getAttendance() == AttendanceStatus.PRESENT).count();
        return (int) ((present * 100) / records.size());
    }

    private String mapWorkType(WorkType type) {
        if (type == null) return "Поточна робота";
        return switch (type) {
            case CLASSWORK -> "Класна робота";
            case INDEPENDENT -> "Самостійна робота";
            case TEST -> "Контрольна";
            case EXAM -> "Екзамен";
            case THEMATIC -> "Тематична";
        };
    }
}