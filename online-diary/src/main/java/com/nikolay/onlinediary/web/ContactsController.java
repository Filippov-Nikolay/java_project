package com.nikolay.onlinediary.web;

import com.nikolay.onlinediary.domain.Contact;
import com.nikolay.onlinediary.dto.ContactForm;
import com.nikolay.onlinediary.exception.DuplicateContactException;
import com.nikolay.onlinediary.service.api.IContactService;
import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;

@Controller
@RequestMapping("/contacts")
public class ContactsController {

    private final IContactService contactService;

    public ContactsController(IContactService contactService) {
        this.contactService = contactService;
    }

    private void handleDuplicate(BindingResult bindingResult, Model model, String title, DuplicateContactException ex) {
        if ("email".equals(ex.getField())) {
            bindingResult.rejectValue("email", "duplicate", ex.getMessage());
        } else {
            bindingResult.rejectValue("phone", "duplicate", ex.getMessage());
        }
        model.addAttribute("title", title);
    }

    @GetMapping
    public String list(Model model) {
        List<Contact> contacts = contactService.findAll();
        model.addAttribute("contacts", contacts);
        return "contacts";
    }

    @GetMapping("/new")
    public String createForm(Model model) {
        model.addAttribute("contact", new ContactForm());
        model.addAttribute("title", "Новый контакт");
        return "contact-form";
    }

    @PostMapping
    public String create(@Valid @ModelAttribute("contact") ContactForm form,
                         BindingResult bindingResult,
                         RedirectAttributes redirectAttributes,
                         Model model) {
        if (bindingResult.hasErrors()) {
            model.addAttribute("title", "Новый контакт");
            return "contact-form";
        }
        try {
            contactService.create(form);
        } catch (DuplicateContactException ex) {
            handleDuplicate(bindingResult, model, "Новый контакт", ex);
            return "contact-form";
        }
        redirectAttributes.addFlashAttribute("successMessage", "Контакт успешно создан");
        return "redirect:/contacts";
    }

    @GetMapping("/{id}/edit")
    public String editForm(@PathVariable Long id, Model model) {
        Contact contact = contactService.getById(id);
        ContactForm form = new ContactForm();
        form.setId(contact.getId());
        form.setFirstName(contact.getFirstName());
        form.setLastName(contact.getLastName());
        form.setEmail(contact.getEmail());
        form.setPhone(contact.getPhone());
        model.addAttribute("contact", form);
        model.addAttribute("title", "Редактирование контакта");
        return "contact-form";
    }

    @PostMapping("/{id}")
    public String update(@PathVariable Long id,
                         @Valid @ModelAttribute("contact") ContactForm form,
                         BindingResult bindingResult,
                         RedirectAttributes redirectAttributes,
                         Model model) {
        if (bindingResult.hasErrors()) {
            model.addAttribute("title", "Редактирование контакта");
            return "contact-form";
        }
        form.setId(id);
        try {
            contactService.update(form);
        } catch (DuplicateContactException ex) {
            handleDuplicate(bindingResult, model, "Редактирование контакта", ex);
            return "contact-form";
        }
        redirectAttributes.addFlashAttribute("successMessage", "Контакт обновлён");
        return "redirect:/contacts";
    }

    @PostMapping("/{id}/delete")
    public String delete(@PathVariable Long id, RedirectAttributes redirectAttributes) {
        contactService.delete(id);
        redirectAttributes.addFlashAttribute("successMessage", "Контакт удалён");
        return "redirect:/contacts";
    }
}