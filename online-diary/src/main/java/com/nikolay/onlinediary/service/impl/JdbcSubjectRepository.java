package com.nikolay.onlinediary.service.impl;

import com.nikolay.onlinediary.domain.Subject;
import com.nikolay.onlinediary.repository.SubjectRepository;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;
import java.util.Optional;

/**
 * JDBC implementation of {@link com.nikolay.onlinediary.repository.SubjectRepository}.
 */
@Repository
public class JdbcSubjectRepository implements SubjectRepository {

    private static final RowMapper<Subject> SUBJECT_ROW_MAPPER = (rs, rowNum) -> new Subject(
            rs.getLong("id"),
            rs.getString("name"),
            rs.getString("description")
    );

    private final JdbcTemplate jdbcTemplate;

    public JdbcSubjectRepository(JdbcTemplate jdbcTemplate) {
        // JdbcTemplate получает сконфигурированный DataSource и управляет JDBC-подключениями.
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public Subject create(Subject subject) {
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(con -> {
            PreparedStatement ps = con.prepareStatement(
                    "INSERT INTO subjects (name, description) VALUES (?, ?)",
                    Statement.RETURN_GENERATED_KEYS
            );
            ps.setString(1, subject.getName());
            ps.setString(2, subject.getDescription());
            return ps;
        }, keyHolder);
        if (keyHolder.getKey() != null) {
            subject.setId(keyHolder.getKey().longValue());
        }
        return subject;
    }

    @Override
    public Optional<Subject> findById(Long id) {
        List<Subject> result = jdbcTemplate.query(
                "SELECT id, name, description FROM subjects WHERE id = ?",
                SUBJECT_ROW_MAPPER,
                id
        );
        return result.stream().findFirst();
    }

    @Override
    public List<Subject> findAll() {
        return jdbcTemplate.query("SELECT id, name, description FROM subjects ORDER BY name", SUBJECT_ROW_MAPPER);
    }

    @Override
    public boolean update(Subject subject) {
        int updated = jdbcTemplate.update(
                "UPDATE subjects SET name = ?, description = ? WHERE id = ?",
                subject.getName(),
                subject.getDescription(),
                subject.getId()
        );
        return updated > 0;
    }

    @Override
    public boolean deleteById(Long id) {
        int updated = jdbcTemplate.update("DELETE FROM subjects WHERE id = ?", id);
        return updated > 0;
    }
}
