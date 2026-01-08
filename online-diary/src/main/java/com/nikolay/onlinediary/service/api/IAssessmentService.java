package com.nikolay.onlinediary.service.api;

import com.nikolay.onlinediary.dto.AssessmentDto;
import com.nikolay.onlinediary.dto.SubmissionResponseDto;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public interface IAssessmentService {
    List<AssessmentDto> findAll();
    AssessmentDto getById(Long id);
    List<AssessmentDto> findByFilter(Long subjectId, Long groupId);
    AssessmentDto create(AssessmentDto dto, MultipartFile file, MultipartFile icon);
    List<AssessmentDto> findByTeacherLogin(String login);
    List<SubmissionResponseDto> getAssessmentSubmissions(Long assessmentId);
    List<AssessmentDto> getHomeworksForStudent(String login);
    AssessmentDto update(Long id, AssessmentDto dto);
    void delete(Long id);
    void gradeSubmission(Long assessmentId, Long studentId, Integer grade, String feedback);

    void submitWork(Long id, String login, MultipartFile[] files, String comment);

    void deleteSubmission(Long id, String login);
}