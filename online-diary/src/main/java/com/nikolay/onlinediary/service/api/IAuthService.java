package com.nikolay.onlinediary.service.api;

import com.nikolay.onlinediary.dto.UserResponseDto;
import com.nikolay.onlinediary.dto.UserUpdateDto;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface IAuthService {
    UserResponseDto getCurrentUser();

    List<UserResponseDto> getAllUsers();

    UserResponseDto getUserById(Long id);

    UserResponseDto updateUser(Long id, UserUpdateDto dto);

    void deleteUser(Long id);
    UserResponseDto register(UserUpdateDto dto, String password, MultipartFile file);
    void requestPasswordReset(String email);
    void resetPassword(String token, String newPassword);

    void updateAvatar(String login, MultipartFile file);

    void updatePassword(String login, String newPassword);
}