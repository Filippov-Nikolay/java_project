package com.nikolay.onlinediary.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "\"Submissions\"")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Submission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "\"student_id\"", nullable = false)
    private Long studentId;

    @Column(name = "\"subject_id\"", nullable = false)
    private Long subjectId;

    @Column(name = "\"content\"", length = 4000)
    private String content;

    @Column(name = "\"submitted_at\"")
    private LocalDateTime submittedAt;

    @Column(name = "\"status\"")
    private String status = "TODO";

    @Column(name = "\"points\"")
    private Integer points;
}