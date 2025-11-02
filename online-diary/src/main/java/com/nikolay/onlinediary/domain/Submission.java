package com.nikolay.onlinediary.domain;

import java.time.LocalDateTime;
import java.util.Objects;

public class Submission {
	private Long id;
    private Long studentId;
    private Long subjectId;
    private String content;
    private LocalDateTime submittedAt;

    public Submission() {
    }

    public Submission(Long id, Long studentId, Long subjectId, String content, LocalDateTime submittedAt) {
        this.id = id;
        this.studentId = studentId;
        this.subjectId = subjectId;
        this.content = content;
        this.submittedAt = submittedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public Long getSubjectId() {
        return subjectId;
    }

    public void setSubjectId(Long subjectId) {
        this.subjectId = subjectId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Submission that = (Submission) o;
        return Objects.equals(id, that.id) &&
                Objects.equals(studentId, that.studentId) &&
                Objects.equals(subjectId, that.subjectId) &&
                Objects.equals(content, that.content) &&
                Objects.equals(submittedAt, that.submittedAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, studentId, subjectId, content, submittedAt);
    }

    @Override
    public String toString() {
        return "Submission{" +
                "id=" + id +
                ", studentId=" + studentId +
                ", subjectId=" + subjectId +
                ", submittedAt=" + submittedAt +
                '}';
    }
}
