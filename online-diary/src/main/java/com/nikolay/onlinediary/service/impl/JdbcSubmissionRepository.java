package com.nikolay.onlinediary.service.impl;

import com.nikolay.onlinediary.domain.Submission;
import com.nikolay.onlinediary.repository.SubmissionRepository;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Timestamp;
import java.sql.Types;
import java.sql.Statement;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * JDBC implementation of {@link com.nikolay.onlinediary.repository.SubmissionRepository}.
 */
@Repository
public class JdbcSubmissionRepository implements SubmissionRepository {

    private static final RowMapper<Submission> SUBMISSION_ROW_MAPPER = (rs, rowNum) -> {
        Timestamp timestamp = rs.getTimestamp("submitted_at");
        LocalDateTime submittedAt = timestamp != null ? timestamp.toLocalDateTime() : null;
        return new Submission(
                rs.getLong("id"),
                rs.getLong("student_id"),
                rs.getLong("subject_id"),
                rs.getString("content"),
                submittedAt
        );
    };

    private final JdbcTemplate jdbcTemplate;

    public JdbcSubmissionRepository(JdbcTemplate jdbcTemplate) {
        // JdbcTemplate инкапсулирует работу с JDBC и автоматически создаёт соединения на базе настроенного DataSource.
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public Submission create(Submission submission) {
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(con -> {
            PreparedStatement ps = con.prepareStatement(
                    "INSERT INTO submissions (student_id, subject_id, content, submitted_at) VALUES (?, ?, ?, ?)",
                    Statement.RETURN_GENERATED_KEYS
            );
            ps.setLong(1, submission.getStudentId());
            ps.setLong(2, submission.getSubjectId());
            ps.setString(3, submission.getContent());
            ps.setTimestamp(4, Timestamp.valueOf(submission.getSubmittedAt() != null ? submission.getSubmittedAt() : LocalDateTime.now()));
            return ps;
        }, keyHolder);
        if (keyHolder.getKey() != null) {
            submission.setId(keyHolder.getKey().longValue());
        }
        return submission;
    }

    @Override
    public Optional<Submission> findById(Long id) {
        List<Submission> submissions = jdbcTemplate.query(
                "SELECT id, student_id, subject_id, content, submitted_at FROM submissions WHERE id = ?",
                SUBMISSION_ROW_MAPPER,
                id
        );
        return submissions.stream().findFirst();
    }

    @Override
    public List<Submission> findAll() {
        return jdbcTemplate.query("SELECT id, student_id, subject_id, content, submitted_at FROM submissions ORDER BY submitted_at DESC", SUBMISSION_ROW_MAPPER);
    }

    @Override
    public List<Submission> findByStudentId(Long studentId) {
        return jdbcTemplate.query(
                "SELECT id, student_id, subject_id, content, submitted_at FROM submissions WHERE student_id = ? ORDER BY submitted_at DESC",
                SUBMISSION_ROW_MAPPER,
                studentId
        );
    }

    @Override
    public List<Submission> findBySubjectId(Long subjectId) {
        return jdbcTemplate.query(
                "SELECT id, student_id, subject_id, content, submitted_at FROM submissions WHERE subject_id = ? ORDER BY submitted_at DESC",
                SUBMISSION_ROW_MAPPER,
                subjectId
        );
    }

    @Override
    public boolean update(Submission submission) {
        int updated = jdbcTemplate.update(con -> {
            PreparedStatement ps = con.prepareStatement("UPDATE submissions SET student_id = ?, subject_id = ?, content = ?, submitted_at = ? WHERE id = ?");
            ps.setLong(1, submission.getStudentId());
            ps.setLong(2, submission.getSubjectId());
            ps.setString(3, submission.getContent());
            LocalDateTime submittedAt = submission.getSubmittedAt() != null ? submission.getSubmittedAt() : LocalDateTime.now();
            ps.setTimestamp(4, Timestamp.valueOf(submittedAt));
            ps.setLong(5, submission.getId());
            return ps;
        });
        return updated > 0;
    }

    @Override
    public boolean deleteById(Long id) {
        int updated = jdbcTemplate.update("DELETE FROM submissions WHERE id = ?", id);
        return updated > 0;
    }

    @Override
    public int deleteOlderThan(LocalDateTime threshold) {
        return jdbcTemplate.update(con -> {
            PreparedStatement ps = con.prepareStatement("DELETE FROM submissions WHERE submitted_at < ?");
            if (threshold == null) {
                ps.setNull(1, Types.TIMESTAMP);
            } else {
                ps.setTimestamp(1, Timestamp.valueOf(threshold));
            }
            return ps;
        });
    }
}
