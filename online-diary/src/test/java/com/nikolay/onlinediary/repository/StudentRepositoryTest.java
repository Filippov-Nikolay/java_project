package com.nikolay.onlinediary.repository;

import com.nikolay.onlinediary.domain.Course;
import com.nikolay.onlinediary.domain.Student;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@ActiveProfiles("test")
@DataJpaTest(properties = "spring.jpa.hibernate.ddl-auto=create-drop")
class StudentRepositoryTest {

    @Autowired
    private StudentRepository studentRepository;

    @Test
    void findByCourseNameReturnsStudentsEnrolledInCourse() {
        Student anna = new Student("Anna Student", "anna@example.com");
        anna.addCourse(new Course("Math"));
        anna.addCourse(new Course("Physics"));

        Student bob = new Student("Bob Student", "bob@example.com");
        bob.addCourse(new Course("History"));

        studentRepository.saveAll(List.of(anna, bob));

        List<Student> mathStudents = studentRepository.findByCourseName("Math");

        assertThat(mathStudents)
                .extracting(Student::getName)
                .containsExactly("Anna Student");
    }
}
