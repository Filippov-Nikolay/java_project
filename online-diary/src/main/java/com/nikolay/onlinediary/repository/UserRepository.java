package com.nikolay.onlinediary.repository;

import com.nikolay.onlinediary.domain.User;

import java.util.List;
import java.util.Optional;

/**
 * Storage abstraction for system users.
 */
public interface UserRepository {
	User create(User user);

    Optional<User> findById(Long id);

    Optional<User> findByEmail(String email);

    List<User> findAll();

    boolean update(User user);

    boolean deleteById(Long id);
}
