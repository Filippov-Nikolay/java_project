package com.nikolay.onlinediary.web;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nikolay.onlinediary.domain.Contact;
import com.nikolay.onlinediary.dto.ContactForm;
import com.nikolay.onlinediary.exception.ContactNotFoundException;
import com.nikolay.onlinediary.exception.DuplicateContactException;
import com.nikolay.onlinediary.service.api.IContactService;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.containsString;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ActiveProfiles("test")
@AutoConfigureMockMvc(addFilters = false)
@WebMvcTest(ContactRestController.class)
class ContactRestControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private IContactService contactService;

    @Test
    void getAllReturnsContactForms() throws Exception {
        Contact first = new Contact(1L, "Ivan", "Petrov", "ivan@example.com", "+1000");
        Contact second = new Contact(2L, "Maria", "Sidorova", "maria@example.com", "+2000");
        when(contactService.findAll()).thenReturn(List.of(first, second));

        mockMvc.perform(get("/api/contacts"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].firstName").value("Ivan"))
                .andExpect(jsonPath("$[1].email").value("maria@example.com"))
                .andExpect(jsonPath("$[1].phone").value("+2000"));
    }

    @Test
    void getByIdReturnsContact() throws Exception {
        Contact contact = new Contact(5L, "John", "Doe", "john@example.com", "+777");
        when(contactService.getById(5L)).thenReturn(contact);

        mockMvc.perform(get("/api/contacts/5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(5L))
                .andExpect(jsonPath("$.firstName").value("John"))
                .andExpect(jsonPath("$.lastName").value("Doe"));
    }

    @Test
    void createReturnsCreatedAndDelegatesToService() throws Exception {
        ContactForm request = new ContactForm();
        request.setFirstName("New");
        request.setLastName("Contact");
        request.setEmail("new@example.com");
        request.setPhone("+123456");

        when(contactService.create(any(ContactForm.class))).thenReturn(new Contact());

        mockMvc.perform(post("/api/contacts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());

        ArgumentCaptor<ContactForm> captor = ArgumentCaptor.forClass(ContactForm.class);
        verify(contactService).create(captor.capture());
        ContactForm passed = captor.getValue();
        assertThat(passed.getId()).isNull();
        assertThat(passed.getEmail()).isEqualTo("new@example.com");
    }

    @Test
    void updateSetsPathIdOnForm() throws Exception {
        ContactForm request = new ContactForm();
        request.setFirstName("Updated");
        request.setLastName("Name");
        request.setEmail("updated@example.com");
        request.setPhone("+999");

        when(contactService.update(any(ContactForm.class))).thenReturn(new Contact());

        mockMvc.perform(put("/api/contacts/9")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());

        ArgumentCaptor<ContactForm> captor = ArgumentCaptor.forClass(ContactForm.class);
        verify(contactService).update(captor.capture());
        assertThat(captor.getValue().getId()).isEqualTo(9L);
    }

    @Test
    void deleteReturnsNoContent() throws Exception {
        mockMvc.perform(delete("/api/contacts/3"))
                .andExpect(status().isNoContent());

        verify(contactService, times(1)).delete(3L);
    }

    @Test
    void duplicateEmailReturnsConflict() throws Exception {
        ContactForm request = new ContactForm();
        request.setFirstName("Dup");
        request.setLastName("User");
        request.setEmail("dup@example.com");
        request.setPhone("+111");

        when(contactService.create(any(ContactForm.class)))
                .thenThrow(new DuplicateContactException("email", request.getEmail()));

        mockMvc.perform(post("/api/contacts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict())
                .andExpect(content().string(containsString("dup@example.com")));
    }

    @Test
    void notFoundContactReturns404() throws Exception {
        when(contactService.getById(eq(404L))).thenThrow(new ContactNotFoundException(404L));

        mockMvc.perform(get("/api/contacts/404"))
                .andExpect(status().isNotFound())
                .andExpect(content().string(containsString("404")));
    }
}
