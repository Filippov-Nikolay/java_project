package com.nikolay.onlinediary.service.api;

import com.nikolay.onlinediary.domain.Contact;
import com.nikolay.onlinediary.dto.ContactForm;

import java.util.List;

/**
 * Business operations for contact entities and form submissions.
 */
public interface IContactService {
    List<Contact> findAll();

    Contact getById(Long id);

    Contact create(ContactForm form);

    Contact update(ContactForm form);

    void delete(Long id);
}
