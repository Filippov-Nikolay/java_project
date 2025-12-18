package com.nikolay.onlinediary.repository;

import com.nikolay.onlinediary.domain.Subject;

import java.util.List;
import java.util.Optional;

/**
 * Storage abstraction for subjects.
 */
public interface SubjectRepository {
	Subject create(Subject subject);

    Optional<Subject> findById(Long id);

    List<Subject> findAll();

    boolean update(Subject subject);

    boolean deleteById(Long id);
}
