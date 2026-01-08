package com.nikolay.onlinediary.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubmissionResponseDto {
    private Long studentId;
    private String studentName;
    private boolean submitted;
    private LocalDateTime submittedAt;
    private String fileName;
    private String studentComment;
    private Integer grade;
    private String feedback;
}