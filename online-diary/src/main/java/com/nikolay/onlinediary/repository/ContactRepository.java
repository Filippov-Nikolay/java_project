package com.nikolay.onlinediary.repository;

import com.nikolay.onlinediary.domain.Contact;

import java.util.List;
import java.util.Optional;

public interface ContactRepository {
    List<Contact> findAll();

    Optional<Contact> findById(Long id);

    Contact save(Contact contact);

    Contact update(Contact contact);

    void deleteById(Long id);

    boolean existsByEmail(String email, Long excludeId);

    boolean existsByPhone(String phone, Long excludeId);
}