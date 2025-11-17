package com.nikolay.onlinediary.dto;

import java.time.LocalDateTime;

public class AssessmentDto {
    private Long id;
    private Long submissionId;
    private Long teacherId;
    private int grade;
    private String commentText;
    private LocalDateTime assessedAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getSubmissionId() {
        return submissionId;
    }

    public void setSubmissionId(Long submissionId) {
        this.submissionId = submissionId;
    }

    public Long getTeacherId() {
        return teacherId;
    }

    public void setTeacherId(Long teacherId) {
        this.teacherId = teacherId;
    }

    public int getGrade() {
        return grade;
    }

    public void setGrade(int grade) {
        this.grade = grade;
    }

    public String getcommentText() {
        return commentText;
    }

    public void setcommentText(String comment) {
        this.commentText = commentText;
    }

    public LocalDateTime getAssessedAt() {
        return assessedAt;
    }

    public void setAssessedAt(LocalDateTime assessedAt) {
        this.assessedAt = assessedAt;
    }
}
