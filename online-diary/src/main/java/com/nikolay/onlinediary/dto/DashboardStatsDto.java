package com.nikolay.onlinediary.dto;

import lombok.*;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDto {
    private List<SubjectStatDto> stats;   // Дані для прогрес-барів (Класна, Самостійна тощо)
    private List<SkillDto> skills;        // Дані для "радару" (Відвідуваність, активність)
}

