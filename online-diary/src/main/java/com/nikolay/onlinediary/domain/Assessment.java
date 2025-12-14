package com.nikolay.onlinediary.domain;

import java.time.LocalDateTime;
import java.util.Objects;

public class Assessment {
	private Long id;
    private Long submissionId;
    private Long teacherId;
    private int grade;
    private String commentText;
    private LocalDateTime assessedAt;

    public Assessment() {
    }

    public Assessment(Long id, Long submissionId, Long teacherId, int grade, String commentText, LocalDateTime assessedAt) {
        this.id = id;
        this.submissionId = submissionId;
        this.teacherId = teacherId;
        this.grade = grade;
        this.commentText = commentText;
        this.assessedAt = assessedAt;
    }

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

    public String getCommentText() {
        return commentText;
    }

    public void setCommentText(String comment) {
        this.commentText = comment;
    }

    public LocalDateTime getAssessedAt() {
        return assessedAt;
    }

    public void setAssessedAt(LocalDateTime assessedAt) {
        this.assessedAt = assessedAt;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Assessment that = (Assessment) o;
        return grade == that.grade &&
                Objects.equals(id, that.id) &&
                Objects.equals(submissionId, that.submissionId) &&
                Objects.equals(teacherId, that.teacherId) &&
                Objects.equals(commentText, that.commentText) &&
                Objects.equals(assessedAt, that.assessedAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, submissionId, teacherId, grade, commentText, assessedAt);
    }

    @Override
    public String toString() {
        return "Assessment{" +
                "id=" + id +
                ", submissionId=" + submissionId +
                ", teacherId=" + teacherId +
                ", grade=" + grade +
                ", assessedAt=" + assessedAt +
                '}';
    }
}
