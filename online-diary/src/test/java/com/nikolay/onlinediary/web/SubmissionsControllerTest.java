package com.nikolay.onlinediary.web;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nikolay.onlinediary.domain.Submission;
import com.nikolay.onlinediary.dto.SubmissionDto;
import com.nikolay.onlinediary.service.api.ISubmissionService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ActiveProfiles("test")
@AutoConfigureMockMvc(addFilters = false)
@WebMvcTest(SubmissionsController.class)
class SubmissionsControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ISubmissionService submissionService;

    @Test
    void getAllReturnsSubmissions() throws Exception {
        when(submissionService.findAll())
                .thenReturn(List.of(new Submission(1L, 2L, 3L, "content", LocalDateTime.now())));

        mockMvc.perform(get("/api/submissions"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].studentId").value(2L))
                .andExpect(jsonPath("$[0].subjectId").value(3L));
    }

    @Test
    void getByStudentUsesStudentFilter() throws Exception {
        when(submissionService.findByStudentId(9L))
                .thenReturn(List.of(new Submission(5L, 9L, 1L, "text", LocalDateTime.now())));

        mockMvc.perform(get("/api/submissions").param("studentId", "9"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].studentId").value(9L));

        verify(submissionService).findByStudentId(9L);
    }

    @Test
    void getBySubjectUsesSubjectFilter() throws Exception {
        when(submissionService.findBySubjectId(3L))
                .thenReturn(List.of(new Submission(6L, 2L, 3L, "calc", LocalDateTime.now())));

        mockMvc.perform(get("/api/submissions").param("subjectId", "3"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].subjectId").value(3L));

        verify(submissionService).findBySubjectId(3L);
    }

    @Test
    void createReturnsCreatedSubmission() throws Exception {
        SubmissionDto payload = new SubmissionDto();
        payload.setStudentId(1L);
        payload.setSubjectId(2L);
        payload.setContent("Hello");

        Submission created = new Submission(7L, 1L, 2L, "Hello", LocalDateTime.now());
        when(submissionService.create(any(SubmissionDto.class))).thenReturn(created);

        mockMvc.perform(post("/api/submissions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(7L))
                .andExpect(jsonPath("$.content").value("Hello"));
    }

    @Test
    void updateReturnsUpdatedSubmission() throws Exception {
        SubmissionDto payload = new SubmissionDto();
        payload.setStudentId(3L);
        payload.setSubjectId(4L);
        payload.setContent("Updated");

        Submission updated = new Submission(8L, 3L, 4L, "Updated", LocalDateTime.now());
        when(submissionService.update(any(Long.class), any(SubmissionDto.class))).thenReturn(updated);

        mockMvc.perform(put("/api/submissions/8")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(8L))
                .andExpect(jsonPath("$.content").value("Updated"));
    }

    @Test
    void deleteReturnsNoContent() throws Exception {
        mockMvc.perform(delete("/api/submissions/12"))
                .andExpect(status().isNoContent());

        verify(submissionService).delete(12L);
    }
}
