package com.nikolay.onlinediary.repository;

import com.nikolay.onlinediary.domain.Group;

import java.util.List;
import java.util.Optional;

/**
 * Storage abstraction for academic groups.
 */
public interface GroupRepository {
 	Group create(Group group);

    Optional<Group> findById(Long id);

    List<Group> findAll();

    boolean update(Group group);

    boolean deleteById(Long id);
}
