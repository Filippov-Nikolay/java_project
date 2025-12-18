package com.nikolay.onlinediary.service.impl;

import com.nikolay.onlinediary.domain.Contact;
import com.nikolay.onlinediary.dto.ContactForm;
import com.nikolay.onlinediary.exception.ContactNotFoundException;
import com.nikolay.onlinediary.exception.DuplicateContactException;
import com.nikolay.onlinediary.repository.ContactRepository;
import com.nikolay.onlinediary.service.api.IContactService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service layer handling CRUD for contacts with duplicate checks.
 */
@Service
@Transactional
public class ContactServiceImpl implements IContactService {

    private final ContactRepository contactRepository;

    public ContactServiceImpl(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Contact> findAll() {
        return contactRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Contact getById(Long id) {
        return contactRepository.findById(id)
                .orElseThrow(() -> new ContactNotFoundException(id));
    }

    @Override
    public Contact create(ContactForm form) {
        Contact contact = toEntity(form);
        validateUniqueness(contact, null);
        return contactRepository.save(contact);
    }

    @Override
    public Contact update(ContactForm form) {
        if (form.getId() == null) {
            throw new ContactNotFoundException(null);
        }
        Contact existing = getById(form.getId());
        existing.setFirstName(form.getFirstName());
        existing.setLastName(form.getLastName());
        existing.setEmail(form.getEmail());
        existing.setPhone(form.getPhone());
        validateUniqueness(existing, existing.getId());
        return contactRepository.update(existing);
    }

    @Override
    public void delete(Long id) {
        Contact contact = getById(id);
        contactRepository.deleteById(contact.getId());
    }

    private void validateUniqueness(Contact contact, Long excludeId) {
        if (contactRepository.existsByEmail(contact.getEmail(), excludeId)) {
            throw new DuplicateContactException("email", contact.getEmail());
        }
        if (contactRepository.existsByPhone(contact.getPhone(), excludeId)) {
            throw new DuplicateContactException("телефоном", contact.getPhone());
        }
    }

    private Contact toEntity(ContactForm form) {
        Contact contact = new Contact();
        contact.setId(form.getId());
        contact.setFirstName(form.getFirstName());
        contact.setLastName(form.getLastName());
        contact.setEmail(form.getEmail());
        contact.setPhone(form.getPhone());
        return contact;
    }
}
