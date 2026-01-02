package com.nikolay.onlinediary.config;

import com.nikolay.onlinediary.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 1. Налаштування CORS
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                // 2. Вимикаємо CSRF, бо ми використовуємо JWT
                .csrf(AbstractHttpConfigurer::disable)

                // 3. Налаштування прав доступу
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/v3/api-docs/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html"
                        ).permitAll()

                        // Дозволяємо перегляд усім авторизованим
                        .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/groups/**", "/api/subjects/**").authenticated()

                        // ДОДАЙТЕ ЦІ РЯДКИ: Явно дозволяємо ADMIN керувати групами та предметами
                        .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/groups/**", "/api/subjects/**").hasRole("ADMIN")
                        .requestMatchers(org.springframework.http.HttpMethod.PUT, "/api/groups/**", "/api/subjects/**").hasRole("ADMIN")
                        .requestMatchers(org.springframework.http.HttpMethod.DELETE, "/api/groups/**", "/api/subjects/**").hasRole("ADMIN")

                        .requestMatchers(HttpMethod.DELETE, "/api/groups/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/groups/**").hasRole("ADMIN")

                        .requestMatchers("/api/auth/users/all").hasRole("ADMIN")
                        .requestMatchers("/api/auth/**").permitAll()
                        .anyRequest().authenticated()
                )
                // 4. Робимо сесії stateless (тільки JWT)
                .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Використовуйте patterns замістьOrigins для кращої сумісності з allowCredentials
        configuration.setAllowedOriginPatterns(List.of("http://localhost:3000"));

        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // Додайте всі необхідні заголовки
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept", "Origin", "X-Requested-With"));

        configuration.setAllowCredentials(true);

        // Важливо: дозвольте браузеру читати заголовки, якщо це потрібно фронтенду
        configuration.setExposedHeaders(List.of("Authorization"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}