package com.nikolay.onlinediary.repository;

import com.nikolay.onlinediary.domain.Assessment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssessmentRepository extends JpaRepository<Assessment, Long> {

    @Query("SELECT a FROM Assessment a JOIN FETCH a.subject JOIN FETCH a.group WHERE a.subject.id = :subjectId AND a.group.id = :groupId")
    List<Assessment> findBySubjectIdAndGroupId(@Param("subjectId") Long subjectId, @Param("groupId") Long groupId);

    @Query("SELECT a FROM Assessment a WHERE a.teacher.login = :login")
    List<Assessment> findByTeacherLogin(@Param("login") String login);

    List<Assessment> findByGroupId(Long id);
}