package com.nikolay.onlinediary.repository;

import com.nikolay.onlinediary.domain.JournalRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface JournalRepository extends JpaRepository<JournalRecord, Long> {

    List<JournalRecord> findByScheduleIdOrderByStudentFullNameAsc(Long scheduleId);
    Optional<JournalRecord> findByScheduleIdAndStudentId(Long scheduleId, Long studentId);

    List<JournalRecord> findByStudentId(Long studentId);
}