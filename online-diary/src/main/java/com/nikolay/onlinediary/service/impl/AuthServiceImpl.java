package com.nikolay.onlinediary.service.impl;

import com.nikolay.onlinediary.domain.PasswordResetToken;
import com.nikolay.onlinediary.domain.User;
import com.nikolay.onlinediary.dto.UserResponseDto;
import com.nikolay.onlinediary.dto.UserUpdateDto;
import com.nikolay.onlinediary.exception.NotFoundException;
import com.nikolay.onlinediary.repository.GroupRepository;
import com.nikolay.onlinediary.repository.PasswordResetTokenRepository;
import com.nikolay.onlinediary.repository.UserRepository;
import com.nikolay.onlinediary.service.api.IAuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements IAuthService {

    private final UserRepository userRepository;
    private final GroupRepository groupRepository;
    private final PasswordResetTokenRepository tokenRepository; // ДОДАТИ
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final String AVATAR_PATH = "uploads/avatars";

    @Override
    @Transactional(readOnly = true)
    public UserResponseDto getCurrentUser() {
        String login = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByLoginAndEnabledTrue(login)
                .map(this::mapToResponse)
                .orElseThrow(() -> new RuntimeException("Користувача не знайдено"));
    }

    @Override
    @Transactional
    public void updateAvatar(String login, MultipartFile file) {
        // 1. Перевірка на порожній файл
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Файл не вибрано");
        }

        long maxSizeBytes = 1024 * 1024;
        if (file.getSize() > maxSizeBytes) {
            throw new IllegalArgumentException("Файл занадто великий! Максимальний розмір: 1МБ");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("Можна завантажувати тільки зображення");
        }

        User user = userRepository.findByLoginAndEnabledTrue(login)
                .orElseThrow(() -> new RuntimeException("Користувача не знайдено"));

        try {
            user.setAvatar(file.getBytes());
            userRepository.save(user);
        } catch (IOException e) {
            throw new RuntimeException("Помилка обробки зображення");
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResponseDto> getAllUsers() {
        return userRepository.findAllActive().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponseDto getUserById(Long id) {
        return userRepository.findById(id)
                .map(this::mapToResponse)
                .orElseThrow(() -> new NotFoundException("Користувач", id));
    }

    @Override
    @Transactional
    public UserResponseDto updateUser(Long id, UserUpdateDto dto) {
        log.info("Admin updating user ID: {}", id);
        User user = userRepository.findById(id).orElseThrow(() -> new NotFoundException("Користувач", id));

        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setEmail(dto.getEmail());
        user.setRole(dto.getRole());

        if (dto.getGroupId() != null) {
            user.setGroup(groupRepository.findById(dto.getGroupId()).orElse(null));
        }

        return mapToResponse(userRepository.save(user));
    }

    @Override
    @Transactional
    public void deleteUser(Long id) {
        log.warn("Deactivating user ID: {}", id);
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Користувач", id));
        user.setEnabled(false);
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void requestPasswordReset(String email) {
        User user = userRepository.findByEmailAndEnabledTrue(email)
                .orElseThrow(() -> new RuntimeException("Користувача з таким email не знайдено"));

        // 1. Генеруємо токен
        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = PasswordResetToken.builder()
                .token(token)
                .user(user)
                .expiryDate(LocalDateTime.now().plusHours(1))
                .build();

        tokenRepository.save(resetToken);

        // 2. ВІДПРАВЛЯЄМО РЕАЛЬНИЙ ЛИСТ замість логів
        try {
            emailService.sendRecoveryEmail(user.getEmail(), token);
        } catch (Exception e) {
            log.error("Failed to send email to {}", email, e);
            throw new RuntimeException("Не вдалося надіслати лист. Спробуйте пізніше.");
        }
    }

    @Override
    @Transactional
    public void resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Некоректний токен"));

        if (resetToken.isExpired()) {
            tokenRepository.delete(resetToken);
            throw new RuntimeException("Термін дії токена вичерпано");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        tokenRepository.delete(resetToken); // Видаляємо токен після використання
    }

    @Override
    @Transactional
    public void updatePassword(String login, String newPassword) {

        if (newPassword == null || newPassword.length() < 6) {
            throw new IllegalArgumentException("Пароль має містити мінімум 6 символів");
        }

        User user = userRepository.findByLoginAndEnabledTrue(login)
                .orElseThrow(() -> new RuntimeException("Користувача не знайдено"));

        if (passwordEncoder.matches(newPassword, user.getPassword())) {
            throw new IllegalArgumentException("Новий пароль не може збігатися зі старим");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }


    private UserResponseDto mapToResponse(User u) {
        String base64Avatar = null;
        if (u.getAvatar() != null && u.getAvatar().length > 0) {
            base64Avatar = Base64.getEncoder().encodeToString(u.getAvatar());
        }

        return UserResponseDto.builder()
                .id(u.getId())
                .login(u.getLogin())
                .firstName(u.getFirstName())
                .lastName(u.getLastName())
                .email(u.getEmail())
                .role(u.getRole())
                .groupId(u.getGroup() != null ? u.getGroup().getId() : null)
                .groupName(u.getGroup() != null ? u.getGroup().getName() : null)
                .avatar(base64Avatar) // Це поле має бути в UserResponseDto (тип String)
                .build();
    }
}