package com.nikolay.onlinediary.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SubjectStatDto {
    private String label;     // "Класна робота", "Контрольна"
    private Double score;     // Середній бал
    private Integer maxScore; // Завжди 12
    private String color;     // HEX-код кольору для фронтенду
}
