package com.nikolay.onlinediary.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssessmentDto {
    private Long id;
    private String title;
    private String description;
    private String type;
    private int pointsMax;
    private LocalDateTime deadline;
    private LocalDateTime createdAt;
    private Long subjectId;
    private String subjectName;
    private Long groupId;
    private String groupName;
    private String teacherName;
    private String iconFileName;
    private String fileName;

    private String status;
    private Integer grade;
    private String feedback;
    private String submissionFileName;

    private int submissionCount;
    private int totalStudents;
}