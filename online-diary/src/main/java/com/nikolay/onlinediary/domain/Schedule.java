package com.nikolay.onlinediary.domain;

import com.nikolay.onlinediary.domain.enums.LessonType;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "\"Schedule\"")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Schedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "\"lesson_date\"", nullable = false)
    private LocalDate date;

    @Column(name = "\"lesson_number\"", nullable = false)
    private int lessonNumber;

    @Column(name = "\"room\"")
    private String room;

    @Column(name = "\"lesson_type\"")
    @Enumerated(EnumType.STRING)
    private LessonType type;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "\"subject_id\"", nullable = false)
    private Subject subject;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "\"teacher_id\"", nullable = false)
    private User teacher;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "\"group_id\"", nullable = false)
    private Group group;
}