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

import java.time.LocalDateTime;
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

    @Override
    @Transactional(readOnly = true)
    public UserResponseDto getCurrentUser() {
        String login = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByLoginAndEnabledTrue(login)
                .map(this::mapToResponse)
                .orElseThrow(() -> new RuntimeException("Користувача не знайдено"));
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


    private UserResponseDto mapToResponse(User u) {
        return UserResponseDto.builder()
                .id(u.getId())
                .login(u.getLogin())
                .firstName(u.getFirstName())
                .lastName(u.getLastName())
                .email(u.getEmail())
                .role(u.getRole())
                .groupId(u.getGroup() != null ? u.getGroup().getId() : null)
                .groupName(u.getGroup() != null ? u.getGroup().getName() : null)
                .build();
    }
}