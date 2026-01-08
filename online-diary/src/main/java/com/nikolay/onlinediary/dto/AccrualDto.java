package com.nikolay.onlinediary.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccrualDto {
    private String id;
    private String subject;
    private String title;
    private String kind;
    private Double score;
    private Integer maxScore;
    private String date;
}