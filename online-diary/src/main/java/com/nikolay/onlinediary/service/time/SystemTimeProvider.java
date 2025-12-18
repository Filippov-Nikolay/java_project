package com.nikolay.onlinediary.service.time;

import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

/**
 * Default time strategy backed by the JVM clock.
 */
@Component
public class SystemTimeProvider implements TimeProvider {
    @Override
    public LocalDateTime now() {
        return LocalDateTime.now();
    }
}
