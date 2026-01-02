package com.nikolay.onlinediary.service.impl;

import com.nikolay.onlinediary.domain.*;
import com.nikolay.onlinediary.domain.enums.LessonType;
import com.nikolay.onlinediary.dto.ScheduleDto;
import com.nikolay.onlinediary.dto.ScheduleResponseDto;
import com.nikolay.onlinediary.exception.NotFoundException;
import com.nikolay.onlinediary.repository.*;
import com.nikolay.onlinediary.service.api.IScheduleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ScheduleServiceImpl implements IScheduleService {

    private final ScheduleRepository scheduleRepository;
    private final UserRepository userRepository;
    private final SubjectRepository subjectRepository;
    private final GroupRepository groupRepository;

    @Override
    @Transactional
    public ScheduleResponseDto save(ScheduleDto dto) {
        User teacher = userRepository.findById(dto.getTeacherId())
                .orElseThrow(() -> new NotFoundException("Вчитель", dto.getTeacherId()));
        Subject subject = subjectRepository.findById(dto.getSubjectId())
                .orElseThrow(() -> new NotFoundException("Предмет", dto.getSubjectId()));
        Group group = groupRepository.findById(dto.getGroupId())
                .orElseThrow(() -> new NotFoundException("Група", dto.getGroupId()));

        // Валідація зв'язків
        if (!teacher.getSubjects().contains(subject)) {
            throw new RuntimeException("Вчитель не викладає цей предмет");
        }
        if (!group.getSubjects().contains(subject)) {
            throw new RuntimeException("Предмет не входить до плану групи");
        }

        Schedule schedule = Schedule.builder()
                .date(dto.getDate())
                .lessonNumber(dto.getLessonNumber())
                .room(dto.getRoom())
                .type(LessonType.valueOf(dto.getType().toUpperCase()))
                .teacher(teacher)
                .subject(subject)
                .group(group)
                .build();

        log.info("Schedule item saved for group {} and teacher {}", group.getName(), teacher.getLastName());
        return mapToResponse(scheduleRepository.save(schedule));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ScheduleResponseDto> findByGroup(Long groupId) {
        return scheduleRepository.findByGroupIdOrderByDateAscLessonNumberAsc(groupId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void delete(Long id) {
        log.warn("Deleting schedule item ID: {}", id);
        scheduleRepository.deleteById(id);
    }

    @Override
    @Transactional
    public ScheduleResponseDto update(Long id, ScheduleDto dto) {
        log.info("Updating schedule item ID: {}", id);

        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Запис розкладу", id));

        User teacher = userRepository.findById(dto.getTeacherId())
                .orElseThrow(() -> new NotFoundException("Вчитель", dto.getTeacherId()));

        Subject subject = subjectRepository.findById(dto.getSubjectId())
                .orElseThrow(() -> new NotFoundException("Предмет", dto.getSubjectId()));

        Group group = groupRepository.findById(dto.getGroupId())
                .orElseThrow(() -> new NotFoundException("Група", dto.getGroupId()));

        boolean teacherQualified = teacher.getSubjects().stream()
                .anyMatch(s -> s.getId().equals(dto.getSubjectId()));

        if (!teacherQualified) {
            log.error("Validation failed: Teacher {} is not assigned to subject {}", teacher.getLastName(), subject.getName());
            throw new RuntimeException("Вчитель не закріплений за цим предметом");
        }

        // Оновлюємо поля
        schedule.setDate(dto.getDate());
        schedule.setLessonNumber(dto.getLessonNumber());
        schedule.setRoom(dto.getRoom());
        schedule.setType(LessonType.valueOf(dto.getType().toUpperCase()));
        schedule.setTeacher(teacher);
        schedule.setSubject(subject);
        schedule.setGroup(group);

        return mapToResponse(scheduleRepository.save(schedule));
    }

    @Override
    @Transactional
    public void importFromExcel(MultipartFile file) {
        try (InputStream is = file.getInputStream();
             Workbook workbook = new XSSFWorkbook(is)) {

            Sheet sheet = workbook.getSheetAt(0);
            DataFormatter formatter = new DataFormatter();

            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null || row.getCell(0) == null) continue;

                final int currentRowNum = i + 1;

                String dateStr = formatter.formatCellValue(row.getCell(0));
                String lessonNumStr = formatter.formatCellValue(row.getCell(1));
                String subjectName = formatter.formatCellValue(row.getCell(2));
                String teacherFullName = formatter.formatCellValue(row.getCell(3));
                String groupName = formatter.formatCellValue(row.getCell(4));
                String typeStr = formatter.formatCellValue(row.getCell(5));
                String room = formatter.formatCellValue(row.getCell(6));

                int lessonNum = Integer.parseInt(lessonNumStr.replaceAll("[^0-9]", ""));

                Group group = groupRepository.findByName(groupName)
                        .orElseThrow(() -> new RuntimeException("Рядок " + currentRowNum + ": Група '" + groupName + "' не знайдена"));

                Subject subject = subjectRepository.findByName(subjectName)
                        .orElseThrow(() -> new RuntimeException("Рядок " + currentRowNum + ": Предмет '" + subjectName + "' не знайдений"));

                String[] nameParts = teacherFullName.split(" ");
                if (nameParts.length < 2) {
                    throw new RuntimeException("Рядок " + currentRowNum + ": Некоректне ПІБ вчителя '" + teacherFullName + "'");
                }

                // ВИПРАВЛЕНО: Викликаємо метод, який реально існує в репозиторії
                User teacher = userRepository.findByLastNameAndFirstNameAndEnabledTrue(nameParts[0], nameParts[1])
                        .orElseThrow(() -> new RuntimeException("Рядок " + currentRowNum + ": Вчитель '" + teacherFullName + "' не знайдений або деактивований"));

                Schedule schedule = Schedule.builder()
                        .date(LocalDate.parse(dateStr))
                        .lessonNumber(lessonNum)
                        .group(group)
                        .subject(subject)
                        .teacher(teacher)
                        .type(LessonType.valueOf(typeStr.toUpperCase()))
                        .room(room)
                        .build();

                scheduleRepository.save(schedule);
            }
            log.info("Excel import completed successfully");
        } catch (Exception e) {
            log.error("Excel import failed: {}", e.getMessage());
            throw new RuntimeException("Помилка імпорту: " + e.getMessage());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<ScheduleResponseDto> findByTeacher(Long teacherId) {
        return scheduleRepository.findByTeacherId(teacherId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ScheduleResponseDto> findAll() {
        return scheduleRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ScheduleResponseDto getById(Long id) {
        Schedule s = scheduleRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Запис розкладу", id));
        return mapToResponse(s);
    }

    private ScheduleResponseDto mapToResponse(Schedule s) {
        return ScheduleResponseDto.builder()
                .id(s.getId())
                .date(s.getDate().toString())
                .lessonNumber(s.getLessonNumber())
                .room(s.getRoom())
                .subjectName(s.getSubject().getName())
                .groupName(s.getGroup().getName())
                .teacherFullName(s.getTeacher().getLastName() + " " + s.getTeacher().getFirstName())
                .type(s.getType().name())
                .groupId(s.getGroup().getId())
                .subjectId(s.getSubject().getId())
                .teacherId(s.getTeacher().getId())
                .build();
    }
}