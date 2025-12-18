package com.nikolay.onlinediary.service.time;

import java.time.LocalDateTime;

public interface TimeProvider {
    /**
     * Returns current date-time from configured source.
     */
    LocalDateTime now();
}
