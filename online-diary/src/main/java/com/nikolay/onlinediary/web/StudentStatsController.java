package com.nikolay.onlinediary.web;

import com.nikolay.onlinediary.domain.*;
import com.nikolay.onlinediary.domain.enums.*;
import com.nikolay.onlinediary.dto.*;
import com.nikolay.onlinediary.repository.*;
import com.nikolay.onlinediary.service.impl.StatsServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/api/student/stats")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class StudentStatsController {
    private final StatsServiceImpl statsService;

    @GetMapping("/accruals")
    public List<AccrualDto> getAccruals() {
        String login = SecurityContextHolder.getContext().getAuthentication().getName();
        return statsService.getStudentHistory(login);
    }

    @GetMapping("/dashboard")
    public DashboardStatsDto getDashboardStats() {
        String login = SecurityContextHolder.getContext().getAuthentication().getName();
        return statsService.calculateStats(login);
    }
}