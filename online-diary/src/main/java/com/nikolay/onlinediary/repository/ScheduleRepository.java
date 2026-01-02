package com.nikolay.onlinediary.repository;

import com.nikolay.onlinediary.domain.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {

    @Query("SELECT s FROM Schedule s JOIN FETCH s.subject JOIN FETCH s.teacher JOIN FETCH s.group " +
            "WHERE s.group.id = :groupId ORDER BY s.date ASC, s.lessonNumber ASC")
    List<Schedule> findByGroupIdOrderByDateAscLessonNumberAsc(@Param("groupId") Long groupId);

    @Query("SELECT s FROM Schedule s JOIN FETCH s.subject JOIN FETCH s.group WHERE s.teacher.id = :teacherId")
    List<Schedule> findByTeacherId(@Param("teacherId") Long teacherId);
}