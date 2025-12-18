package com.nikolay.onlinediary.domain;

import java.util.Objects;

/**
 * Academic group with a name and course number.
 */
public class Group {
	private Long id;
    private String name;
    private Integer course;

    public Group() {
    }

    public Group(Long id, String name, Integer course) {
        this.id = id;
        this.name = name;
        this.course = course;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getCourse() {
        return course;
    }

    public void setCourse(Integer course) {
        this.course = course;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Group group = (Group) o;
        return Objects.equals(id, group.id) &&
                Objects.equals(name, group.name) &&
                Objects.equals(course, group.course);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, course);
    }

    @Override
    public String toString() {
        return "Group{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", course=" + course +
                '}';
    }
}
