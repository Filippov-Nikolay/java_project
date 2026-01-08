package com.nikolay.onlinediary.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "\"Submissions\"")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubmissionStudent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "\"assessment_id\"", nullable = false)
    private Assessment assessment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "\"student_id\"", nullable = false)
    private User student;

    @Column(name = "\"submitted_at\"")
    private LocalDateTime submittedAt;

    @Column(name = "\"file_name\"")
    private String fileName;

    @Column(name = "\"grade\"")
    private Integer grade;

    @Column(name = "\"feedback\"", length = 1000)
    private String feedback;

    @PrePersist
    protected void onCreate() {
        this.submittedAt = LocalDateTime.now();
    }
}