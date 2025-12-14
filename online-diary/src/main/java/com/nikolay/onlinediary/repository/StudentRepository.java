package com.nikolay.onlinediary.repository;

import com.nikolay.onlinediary.domain.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    @Query("SELECT s FROM Student s JOIN s.courses c WHERE c.name = :courseName")
    List<Student> findByCourseName(@Param("courseName") String courseName);
}
