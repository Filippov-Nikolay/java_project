package com.nikolay.onlinediary.repository;

import com.nikolay.onlinediary.domain.JournalRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface JournalRepository extends JpaRepository<JournalRecord, Long> {

    List<JournalRecord> findByScheduleIdOrderByStudentFullNameAsc(Long scheduleId);
}