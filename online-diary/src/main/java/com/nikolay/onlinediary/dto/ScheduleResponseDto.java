package com.nikolay.onlinediary.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleResponseDto {
    private Long id;
    private String subjectName;
    private String teacherFullName;
    private String groupName;
    private int lessonNumber;
    private String room;
    private String date;
    private String type;

    private Long groupId;
    private Long subjectId;
    private Long teacherId;
}