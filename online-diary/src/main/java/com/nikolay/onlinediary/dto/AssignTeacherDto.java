package com.nikolay.onlinediary.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssignTeacherDto {
    @NotNull(message = "ID вчителя не може бути порожнім")
    private Long teacherId;

    @NotNull(message = "ID предмета не може бути порожнім")
    private Long subjectId;

    @NotNull(message = "ID групи не може бути порожнім")
    private Long groupId;
}