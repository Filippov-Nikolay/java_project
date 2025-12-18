package com.nikolay.onlinediary.repository;

import com.nikolay.onlinediary.domain.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * JPA repository for students with custom search by course name.
 */
@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    /**
     * Finds students that are enrolled into a course with the given name.
     */
    @Query("SELECT s FROM Student s JOIN s.courses c WHERE c.name = :courseName")
    List<Student> findByCourseName(@Param("courseName") String courseName);
}
