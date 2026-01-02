package com.nikolay.onlinediary.domain;

import com.nikolay.onlinediary.domain.enums.AttendanceStatus;
import com.nikolay.onlinediary.domain.enums.WorkType;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "\"Journal_Records\"")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JournalRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "\"schedule_id\"", nullable = false)
    private Long scheduleId;

    @Column(name = "\"student_id\"", nullable = false)
    private Long studentId;

    @Column(name = "\"student_full_name\"")
    private String studentFullName;

    @Enumerated(EnumType.STRING)
    @Column(name = "\"attendance\"")
    private AttendanceStatus attendance;

    @Column(name = "\"grade\"")
    private String grade;

    @Enumerated(EnumType.STRING)
    @Column(name = "\"work_type\"")
    private WorkType workType;

    @Column(name = "\"updated_at\"")
    private LocalDateTime updatedAt;

    @PreUpdate
    @PrePersist
    public void updateTime() {
        this.updatedAt = LocalDateTime.now();
    }
}