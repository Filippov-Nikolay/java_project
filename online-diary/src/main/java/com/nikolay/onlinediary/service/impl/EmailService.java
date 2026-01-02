package com.nikolay.onlinediary.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl {

    private final JavaMailSender mailSender;

    public void sendRecoveryEmail(String to, String token) {
        String url = "http://localhost:3000/auth/reset-password?token=" + token;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("Online Diary <ваш_email@gmail.com>");
        message.setTo(to);
        message.setSubject("Відновлення доступу до щоденника");
        message.setText("Вітаємо!\n\nЩоб змінити пароль, перейдіть за посиланням:\n" + url +
                "\n\nПосилання дійсне протягом 1 години.");

        mailSender.send(message);
    }
}