package com.nikolay.onlinediary.repository;

import com.nikolay.onlinediary.domain.User;
import com.nikolay.onlinediary.domain.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Для авторизації - шукаємо тільки активних
    Optional<User> findByLoginAndEnabledTrue(String login);

    // Всі активні користувачі
    @Query("SELECT u FROM User u WHERE u.enabled = true")
    List<User> findAllActive();

    // Всі активні за роллю
    @Query("SELECT u FROM User u WHERE u.role = :role AND u.enabled = true")
    List<User> findAllActiveByRole(@Param("role") Role role);

    // Для імпорту з Excel
    Optional<User> findByLastNameAndFirstNameAndEnabledTrue(String lastName, String firstName);

    // Список студентів для Журналу (Тільки активні!)
    List<User> findByGroupIdAndRoleAndEnabledTrueOrderByLastNameAsc(Long groupId, Role role);

    Optional<User> findByEmailAndEnabledTrue(String email);
}