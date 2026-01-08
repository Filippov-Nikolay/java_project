package com.nikolay.onlinediary.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SkillDto {
    private String skill;     // "Відвідуваність"
    private Integer value;    // Відсоток (0-100)
}
