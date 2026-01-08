package com.nikolay.onlinediary.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

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

    @Column(name = "\"description\"", length = 1000)
    private String description;

    @Column(name = "\"type\"")
    private String type;

    @Column(name = "\"points_max\"")
    private Integer pointsMax;

    @Column(name = "\"created_at\"", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "\"deadline\"")
    private LocalDateTime deadline;

    @Column(name = "\"file_name\"")
    private String fileName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "\"subject_id\"")
    private Subject subject;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "\"group_id\"")
    private Group group;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "\"teacher_id\"")
    private User teacher;

    @Column(name = "\"icon_file_name\"")
    private String iconFileName;

    @OneToMany(mappedBy = "assessment", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<SubmissionStudent> submissions;


    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}