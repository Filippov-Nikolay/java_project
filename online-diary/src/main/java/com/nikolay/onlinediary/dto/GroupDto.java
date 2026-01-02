package com.nikolay.onlinediary.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GroupDto {
    private Long id;
    @NotBlank(message = "Назва групи не може бути порожньою")
    private String name;

    @Min(value = 1, message = "Курс не може бути менше 1")
    @Max(value = 4, message = "Курс не може бути більше 4")
    private Integer course;
}