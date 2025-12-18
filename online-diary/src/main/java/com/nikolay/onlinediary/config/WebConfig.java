package com.nikolay.onlinediary.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configures simple MVC helpers: error view mapping and CORS for the API.
 */
    @Configuration
    public class WebConfig implements WebMvcConfigurer {

        @Override
        public void addViewControllers(ViewControllerRegistry registry) {
            registry.addViewController("/error").setViewName("error");
        }

        @Override
        public void addCorsMappings(org.springframework.web.servlet.config.annotation.CorsRegistry registry) {
            registry.addMapping("/api/**")
                    .allowedOrigins("http://localhost:3000")
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                    .allowedHeaders("*")
                    .allowCredentials(true);
        }
    }
