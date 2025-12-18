package com.nikolay.onlinediary.web;

import com.nikolay.onlinediary.domain.Contact;
import com.nikolay.onlinediary.dto.ContactForm;
import com.nikolay.onlinediary.service.api.IContactService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST API for contacts, optimized for client-side consumption.
 */
@RestController
@RequestMapping("/api/contacts")
public class ContactRestController {

    private final IContactService contactService;

    public ContactRestController(IContactService contactService) {
        this.contactService = contactService;
    }

    private ContactForm toForm(Contact contact) {
        ContactForm form = new ContactForm();
        form.setId(contact.getId());
        form.setFirstName(contact.getFirstName());
        form.setLastName(contact.getLastName());
        form.setEmail(contact.getEmail());
        form.setPhone(contact.getPhone());
        return form;
    }

    // GET /api/contacts
    @GetMapping
    public List<ContactForm> getAll() {
        return contactService.findAll()
                .stream()
                .map(this::toForm)
                .toList();
    }

    // GET /api/contacts/{id}
    @GetMapping("/{id}")
    public ContactForm getById(@PathVariable Long id) {
        Contact contact = contactService.getById(id);
        return toForm(contact);
    }

    // POST /api/contacts
    @PostMapping
    public ResponseEntity<Void> create(@Valid @RequestBody ContactForm form) {
        contactService.create(form);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    // PUT /api/contacts/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Void> update(@PathVariable Long id,
                                       @Valid @RequestBody ContactForm form) {
        form.setId(id);
        contactService.update(form);
        return ResponseEntity.ok().build();
    }

    // DELETE /api/contacts/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        contactService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
