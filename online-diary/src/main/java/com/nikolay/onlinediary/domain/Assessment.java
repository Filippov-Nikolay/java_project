package com.nikolay.onlinediary.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "\"Assessments\"")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Assessment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "\"title\"", nullable = false)
    private String title;

    @Column(name = "\"type\"")
    private String type;

    @Column(name = "\"points_max\"")
    private Integer pointsMax;

    @Column(name = "\"deadline\"")
    private LocalDateTime deadline;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "\"subject_id\"")
    private Subject subject;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "\"group_id\"")
    private Group group;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "\"teacher_id\"")
    private User teacher;
}