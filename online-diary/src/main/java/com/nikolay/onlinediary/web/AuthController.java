package com.nikolay.onlinediary.web;

import com.nikolay.onlinediary.dto.UserResponseDto;
import com.nikolay.onlinediary.dto.UserUpdateDto;
import com.nikolay.onlinediary.repository.UserRepository;
import com.nikolay.onlinediary.security.JwtService;
import com.nikolay.onlinediary.service.api.IAuthService;
import com.nikolay.onlinediary.service.impl.AuthServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final IAuthService authService;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String login = request.get("login");
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(login, request.get("password")));
        var user = userRepository.findByLoginAndEnabledTrue(login).orElseThrow();
        return ResponseEntity.ok(Map.of("token", jwtService.generateToken(user), "role", user.getRole()));
    }

    @GetMapping("/users/all")
    public List<UserResponseDto> getAllUsers() {
        return authService.getAllUsers();
    }

    // Цей метод тепер буде працювати правильно, бо він стоїть перед {id}
    @GetMapping("/users/teachers")
    public List<UserResponseDto> getTeachers() {
        log.info("Fetching all active teachers for assignment dropdown");
        return authService.getAllUsers().stream()
                .filter(u -> "TEACHER".equals(u.getRole().name()))
                .toList();
    }

    // SENIOR FIX: Додаємо [0-9]+, щоб маршрут не перехоплював слово "teachers"
    @GetMapping("/users/{id:[0-9]+}")
    public UserResponseDto getUserById(@PathVariable Long id) {
        return authService.getUserById(id);
    }

    @PutMapping("/users/{id:[0-9]+}")
    public UserResponseDto updateUser(@PathVariable Long id, @Valid @RequestBody UserUpdateDto dto) {
        return authService.updateUser(id, dto);
    }

    @DeleteMapping("/users/{id:[0-9]+}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        authService.deleteUser(id);
        return ResponseEntity.ok(Map.of("message", "User deactivated"));
    }

    @GetMapping("/me")
    public UserResponseDto getCurrentUser() {
        return authService.getCurrentUser();
    }

    @PostMapping("/password-reset/request")
    public ResponseEntity<?> requestReset(@RequestBody Map<String, String> request) {
        authService.requestPasswordReset(request.get("email"));
        return ResponseEntity.ok(Map.of("message", "Інструкції надіслано на вашу пошту"));
    }

    @PostMapping("/password-reset/confirm")
    public ResponseEntity<?> confirmReset(@RequestBody Map<String, String> request) {
        authService.resetPassword(request.get("token"), request.get("password"));
        return ResponseEntity.ok(Map.of("message", "Пароль успішно змінено"));
    }

    @PostMapping(value = "/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadAvatar(@RequestPart("file") MultipartFile file) {

        String login = SecurityContextHolder.getContext().getAuthentication().getName();

        authService.updateAvatar(login, file);

        return ResponseEntity.ok(Map.of("message", "Аватар оновлено"));
    }

    @PostMapping("/update-password")
    public ResponseEntity<?> updatePassword(@RequestBody Map<String, String> request) {
        // Отримуємо логін із контексту безпеки (з JWT токена)
        String login = SecurityContextHolder.getContext().getAuthentication().getName();
        String newPassword = request.get("password");

        authService.updatePassword(login, newPassword);

        return ResponseEntity.ok(Map.of("message", "Пароль успішно оновлено"));
    }
}