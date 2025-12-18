package com.nikolay.onlinediary.service.impl;

import com.nikolay.onlinediary.domain.Group;
import com.nikolay.onlinediary.repository.GroupRepository;
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
 * JDBC implementation of {@link com.nikolay.onlinediary.repository.GroupRepository}.
 */
@Repository
public class JdbcGroupRepository implements GroupRepository {

    private static final RowMapper<Group> GROUP_ROW_MAPPER = (rs, rowNum) -> new Group(
            rs.getLong("id"),
            rs.getString("name"),
            rs.getInt("course")
    );

    private final JdbcTemplate jdbcTemplate;

    public JdbcGroupRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public Group create(Group group) {
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(con -> {
            PreparedStatement ps = con.prepareStatement(
                    "INSERT INTO groups (name, course) VALUES (?, ?)",
                    Statement.RETURN_GENERATED_KEYS
            );
            ps.setString(1, group.getName());
            ps.setObject(2, group.getCourse());
            return ps;
        }, keyHolder);
        if (keyHolder.getKey() != null) {
            group.setId(keyHolder.getKey().longValue());
        }
        return group;
    }

    @Override
    public Optional<Group> findById(Long id) {
        List<Group> groups = jdbcTemplate.query(
                "SELECT id, name, course FROM groups WHERE id = ?",
                GROUP_ROW_MAPPER,
                id
        );
        return groups.stream().findFirst();
    }

    @Override
    public List<Group> findAll() {
        return jdbcTemplate.query("SELECT id, name, course FROM groups ORDER BY name", GROUP_ROW_MAPPER);
    }

    @Override
    public boolean update(Group group) {
        int updated = jdbcTemplate.update(
                "UPDATE groups SET name = ?, course = ? WHERE id = ?",
                group.getName(),
                group.getCourse(),
                group.getId()
        );
        return updated > 0;
    }

    @Override
    public boolean deleteById(Long id) {
        int updated = jdbcTemplate.update("DELETE FROM groups WHERE id = ?", id);
        return updated > 0;
    }
}
