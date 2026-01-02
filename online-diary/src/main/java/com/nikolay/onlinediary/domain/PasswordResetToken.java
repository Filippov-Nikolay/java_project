package com.nikolay.onlinediary.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "\"Password_Reset_Tokens\"") // Обов'язково в лапках
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PasswordResetToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "\"token\"", nullable = false, unique = true)
    private String token;

    @OneToOne(targetEntity = User.class, fetch = FetchType.EAGER)
    @JoinColumn(nullable = false, name = "\"user_id\"")
    private User user;

    // SENIOR FIX: Явно вказуємо назву колонки як у базі (snake_case)
    @Column(name = "\"expiry_date\"", nullable = false)
    private LocalDateTime expiryDate;

    public boolean isExpired() {
        return LocalDateTime.now().isAfter(this.expiryDate);
    }
}