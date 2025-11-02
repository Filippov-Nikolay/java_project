package com.nikolay.onlinediary.aop;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class LoggingAspect {

    private static final Logger log = LoggerFactory.getLogger(LoggingAspect.class);

    @Around("within(com.nikolay.onlinediary.web..*)")
    public Object logAroundController(ProceedingJoinPoint joinPoint) throws Throwable {
        String signature = joinPoint.getSignature().toShortString();
        log.info("→ {}", signature);
        try {
            Object result = joinPoint.proceed();
            log.info("← {}", signature);
            return result;
        } catch (Throwable ex) {
            log.error("✖ {} - {}", signature, ex.getMessage(), ex);
            throw ex;
        }
    }
}