package com.nikolay.onlinediary.service.api;

import com.nikolay.onlinediary.domain.JournalRecord;
import java.util.List;

public interface IJournalService {

    List<JournalRecord> getJournalBySchedule(Long scheduleId);


    void saveAll(List<JournalRecord> records);
}