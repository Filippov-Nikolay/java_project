package com.nikolay.onlinediary.web;

import com.nikolay.onlinediary.domain.JournalRecord;
import com.nikolay.onlinediary.service.api.IJournalService; // Потрібно створити інтерфейс
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/journal")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class JournalController {

    private final IJournalService journalService;

    @GetMapping("/{scheduleId}")
    public List<JournalRecord> getJournal(@PathVariable Long scheduleId) {
        return journalService.getJournalBySchedule(scheduleId);
    }

    @PostMapping("/{scheduleId}/save")
    public ResponseEntity<?> saveJournal(
            @PathVariable Long scheduleId,
            @RequestBody List<JournalRecord> records) {
        log.info("Saving journal records for schedule ID: {}", scheduleId);
        journalService.saveAll(records);
        return ResponseEntity.ok("Дані успішно збережено");
    }
}