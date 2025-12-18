package com.nikolay.onlinediary.web;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nikolay.onlinediary.domain.Assessment;
import com.nikolay.onlinediary.dto.AssessmentDto;
import com.nikolay.onlinediary.service.api.IAssessmentService;
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
@WebMvcTest(AssessmentsController.class)
class AssessmentsControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private IAssessmentService assessmentService;

    @Test
    void getAllReturnsAssessments() throws Exception {
        LocalDateTime now = LocalDateTime.now();
        when(assessmentService.findAll())
                .thenReturn(List.of(new Assessment(1L, 10L, 5L, 4, "well done", now)));

        mockMvc.perform(get("/api/assessments"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].grade").value(4))
                .andExpect(jsonPath("$[0].commentText").value("well done"));
    }

    @Test
    void getBySubmissionRoutesToCorrectService() throws Exception {
        when(assessmentService.findBySubmissionId(15L))
                .thenReturn(List.of(new Assessment(3L, 15L, 2L, 5, "top", LocalDateTime.now())));

        mockMvc.perform(get("/api/assessments").param("submissionId", "15"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].submissionId").value(15L));

        verify(assessmentService).findBySubmissionId(15L);
    }

    @Test
    void createReturnsCreatedAssessment() throws Exception {
        AssessmentDto payload = new AssessmentDto();
        payload.setSubmissionId(1L);
        payload.setTeacherId(2L);
        payload.setGrade(5);
        payload.setCommentText("nice");

        Assessment created = new Assessment(9L, 1L, 2L, 5, "nice", LocalDateTime.now());
        when(assessmentService.create(any(AssessmentDto.class))).thenReturn(created);

        mockMvc.perform(post("/api/assessments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(9L))
                .andExpect(jsonPath("$.teacherId").value(2L));
    }

    @Test
    void updateReturnsUpdatedAssessment() throws Exception {
        AssessmentDto payload = new AssessmentDto();
        payload.setSubmissionId(2L);
        payload.setTeacherId(3L);
        payload.setGrade(3);
        payload.setCommentText("needs work");

        Assessment updated = new Assessment(2L, 2L, 3L, 3, "needs work", LocalDateTime.now());
        when(assessmentService.update(any(Long.class), any(AssessmentDto.class))).thenReturn(updated);

        mockMvc.perform(put("/api/assessments/2")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(2L))
                .andExpect(jsonPath("$.grade").value(3));
    }

    @Test
    void deleteReturnsNoContent() throws Exception {
        mockMvc.perform(delete("/api/assessments/7"))
                .andExpect(status().isNoContent());

        verify(assessmentService).delete(7L);
    }
}
