package com.nikolay.onlinediary.service.impl;

import com.nikolay.onlinediary.domain.Assessment;
import com.nikolay.onlinediary.repository.AssessmentRepository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public class JdbcAssessmentRepository implements AssessmentRepository {

    private static final RowMapper<Assessment> ASSESSMENT_ROW_MAPPER = (rs, rowNum) -> {
        Timestamp assessedAtTs = rs.getTimestamp("assessed_at");
        LocalDateTime assessedAt = assessedAtTs != null ? assessedAtTs.toLocalDateTime() : null;
        return new Assessment(
                rs.getLong("id"),
                rs.getLong("submission_id"),
                rs.getLong("teacher_id"),
                rs.getInt("grade"),
                rs.getString("comment"),
                assessedAt
        );
    };

    private final JdbcTemplate jdbcTemplate;

    public JdbcAssessmentRepository(JdbcTemplate jdbcTemplate) {
        // Подключение к базе происходит через JdbcTemplate, который использует общий DataSource приложения.
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public Assessment create(Assessment assessment) {
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(con -> {
            PreparedStatement ps = con.prepareStatement(
                    "INSERT INTO assessments (submission_id, teacher_id, grade, comment, assessed_at) VALUES (?, ?, ?, ?, ?)",
                    Statement.RETURN_GENERATED_KEYS
            );
            ps.setLong(1, assessment.getSubmissionId());
            ps.setLong(2, assessment.getTeacherId());
            ps.setInt(3, assessment.getGrade());
            ps.setString(4, assessment.getComment());
            LocalDateTime assessedAt = assessment.getAssessedAt() != null ? assessment.getAssessedAt() : LocalDateTime.now();
            ps.setTimestamp(5, Timestamp.valueOf(assessedAt));
            return ps;
        }, keyHolder);
        if (keyHolder.getKey() != null) {
            assessment.setId(keyHolder.getKey().longValue());
        }
        return assessment;
    }

    @Override
    public Optional<Assessment> findById(Long id) {
        List<Assessment> assessments = jdbcTemplate.query(
                "SELECT id, submission_id, teacher_id, grade, comment, assessed_at FROM assessments WHERE id = ?",
                ASSESSMENT_ROW_MAPPER,
                id
        );
        return assessments.stream().findFirst();
    }

    @Override
    public List<Assessment> findAll() {
        return jdbcTemplate.query("SELECT id, submission_id, teacher_id, grade, comment, assessed_at FROM assessments ORDER BY assessed_at DESC", ASSESSMENT_ROW_MAPPER);
    }

    @Override
    public List<Assessment> findBySubmissionId(Long submissionId) {
        return jdbcTemplate.query(
                "SELECT id, submission_id, teacher_id, grade, comment, assessed_at FROM assessments WHERE submission_id = ? ORDER BY assessed_at DESC",
                ASSESSMENT_ROW_MAPPER,
                submissionId
        );
    }

    @Override
    public boolean update(Assessment assessment) {
        int updated = jdbcTemplate.update(
                "UPDATE assessments SET submission_id = ?, teacher_id = ?, grade = ?, comment = ?, assessed_at = ? WHERE id = ?",
                assessment.getSubmissionId(),
                assessment.getTeacherId(),
                assessment.getGrade(),
                assessment.getComment(),
                Timestamp.valueOf(assessment.getAssessedAt() != null ? assessment.getAssessedAt() : LocalDateTime.now()),
                assessment.getId()
        );
        return updated > 0;
    }

    @Override
    public boolean deleteById(Long id) {
        int updated = jdbcTemplate.update("DELETE FROM assessments WHERE id = ?", id);
        return updated > 0;
    }
}
