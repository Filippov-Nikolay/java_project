package com.nikolay.onlinediary.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleDto {
    @NotNull(message = "Дата обов'язкова")
    private LocalDate date;

    @Min(1) @Max(8)
    private int lessonNumber;

    private String room;

    @NotBlank(message = "Тип заняття обов'язковий")
    private String type;

    @NotNull(message = "ID вчителя обов'язковий")
    private Long teacherId;

    @NotNull(message = "ID предмета обов'язковий")
    private Long subjectId;

    @NotNull(message = "ID групи обов'язковий")
    private Long groupId;
}