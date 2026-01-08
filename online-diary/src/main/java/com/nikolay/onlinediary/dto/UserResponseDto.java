package com.nikolay.onlinediary.dto;

import com.nikolay.onlinediary.domain.enums.Role;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDto {
    private Long id;
    private String login;
    private String firstName;
    private String lastName;
    private String email;
    private Role role;
    private Long groupId;
    private String groupName;
    private String avatar;
}