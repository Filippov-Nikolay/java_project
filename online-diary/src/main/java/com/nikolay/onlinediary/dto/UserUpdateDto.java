package com.nikolay.onlinediary.dto;

import com.nikolay.onlinediary.domain.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserUpdateDto {
    @NotBlank(message = "Ім'я не може бути порожнім")
    @Size(min = 2, max = 50, message = "Ім'я має бути від 2 до 50 символів")
    private String firstName;

    @NotBlank(message = "Прізвище не може бути порожнім")
    private String lastName;

    @Email(message = "Некоректний формат email")
    @NotBlank(message = "Email обов'язковий")
    private String email;

    @NotNull(message = "Роль має бути вказана")
    private Role role;

    private Long groupId;
}