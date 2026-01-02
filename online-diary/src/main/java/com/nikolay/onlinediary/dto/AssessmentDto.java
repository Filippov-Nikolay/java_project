package com.nikolay.onlinediary.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssessmentDto {
    private Long id;
    private Long submissionId;
    private Long teacherId;
    private String title;
    private int grade;
    private String commentText;
    private LocalDateTime assessedAt;
}