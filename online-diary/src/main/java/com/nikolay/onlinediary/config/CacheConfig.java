package com.nikolay.onlinediary.config;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    public CacheManager cacheManager() {
        // Lightweight in-memory cache; enough to cut repeated reads of small reference data.
        return new ConcurrentMapCacheManager("subjects", "groups");
    }
}
