package com.nikolay.onlinediary.domain;

import jakarta.persistence.*;
import lombok.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "\"Subjects\"")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"groups", "teachers"})
@EqualsAndHashCode(exclude = {"groups", "teachers"})
public class Subject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "\"name\"", nullable = false)
    private String name;

    @Column(name = "\"description\"")
    private String description;

    @Builder.Default
    @ManyToMany(mappedBy = "subjects")
    private Set<Group> groups = new HashSet<>();

    @Builder.Default
    @ManyToMany(mappedBy = "subjects")
    private Set<User> teachers = new HashSet<>();
}