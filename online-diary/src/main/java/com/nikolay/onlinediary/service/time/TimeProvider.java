package com.nikolay.onlinediary.service.time;

import java.time.LocalDateTime;

public interface TimeProvider {
    LocalDateTime now();
}
