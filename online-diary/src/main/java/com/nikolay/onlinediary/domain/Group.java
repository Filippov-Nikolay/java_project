package com.nikolay.onlinediary.domain;

import jakarta.persistence.*;
import lombok.*;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "\"Groups\"")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"subjects", "students"})
@EqualsAndHashCode(exclude = {"subjects", "students"})
public class Group {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "\"name\"", nullable = false)
    private String name;

    @Column(name = "\"course\"", nullable = false)
    private Integer course;

    @OneToMany(mappedBy = "group", fetch = FetchType.LAZY)
    private List<User> students;

    @Builder.Default
    @ManyToMany
    @JoinTable(
            name = "\"Group_Subjects\"",
            joinColumns = @JoinColumn(name = "\"group_id\""),
            inverseJoinColumns = @JoinColumn(name = "\"subject_id\"")
    )
    private Set<Subject> subjects = new HashSet<>();
}