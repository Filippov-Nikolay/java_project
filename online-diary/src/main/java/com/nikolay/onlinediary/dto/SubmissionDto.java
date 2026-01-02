package com.nikolay.onlinediary.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubmissionDto {
    private Long id;
    private Long studentId;
    private Long subjectId;
    private String content;
    private LocalDateTime submittedAt;
    private String status;
    private Integer points;
}