package com.nikolay.onlinediary.service.impl;

import com.nikolay.onlinediary.domain.Contact;
import com.nikolay.onlinediary.repository.ContactRepository;
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
 * JDBC implementation of {@link com.nikolay.onlinediary.repository.ContactRepository}.
 */
@Repository
public class JdbcContactRepository implements ContactRepository {



    private static final String SELECT_ALL = "SELECT id, first_name, last_name, email, phone FROM contacts ORDER BY LOWER(last_name), LOWER(first_name)";
    private static final String SELECT_BY_ID = "SELECT id, first_name, last_name, email, phone FROM contacts WHERE id = ?";
    private static final String INSERT = "INSERT INTO contacts (first_name, last_name, email, phone) VALUES (?, ?, ?, ?)";
    private static final String UPDATE = "UPDATE contacts SET first_name = ?, last_name = ?, email = ?, phone = ? WHERE id = ?";
    private static final String DELETE = "DELETE FROM contacts WHERE id = ?";
    private static final String EXISTS_BY_EMAIL = "SELECT COUNT(*) FROM contacts WHERE LOWER(email) = LOWER(?)";
    private static final String EXISTS_BY_PHONE = "SELECT COUNT(*) FROM contacts WHERE phone = ?";

    private final JdbcTemplate jdbcTemplate;
    private final RowMapper<Contact> contactRowMapper = (rs, rowNum) -> new Contact(
            rs.getLong("id"),
            rs.getString("first_name"),
            rs.getString("last_name"),
            rs.getString("email"),
            rs.getString("phone"));

    public JdbcContactRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public List<Contact> findAll() {
        return jdbcTemplate.query(SELECT_ALL, contactRowMapper);
    }

    @Override
    public Optional<Contact> findById(Long id) {
        return jdbcTemplate.query(SELECT_BY_ID, contactRowMapper, id).stream().findFirst();
    }

    @Override
    public Contact save(Contact contact) {
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(INSERT, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, contact.getFirstName());
            ps.setString(2, contact.getLastName());
            ps.setString(3, contact.getEmail());
            ps.setString(4, contact.getPhone());
            return ps;
        }, keyHolder);
        if (keyHolder.getKey() != null) {
            contact.setId(keyHolder.getKey().longValue());
        }
        return contact;
    }

    @Override
    public Contact update(Contact contact) {
        jdbcTemplate.update(UPDATE,
                contact.getFirstName(),
                contact.getLastName(),
                contact.getEmail(),
                contact.getPhone(),
                contact.getId());
        return contact;
    }

    @Override
    public void deleteById(Long id) {
        jdbcTemplate.update(DELETE, id);
    }

    @Override
    public boolean existsByEmail(String email, Long excludeId) {
        return existsWithExclude(EXISTS_BY_EMAIL, email, excludeId);
    }

    @Override
    public boolean existsByPhone(String phone, Long excludeId) {
        return existsWithExclude(EXISTS_BY_PHONE, phone, excludeId);
    }

    private boolean existsWithExclude(String sql, String value, Long excludeId) {
        if (value == null || value.isBlank()) {
            return false;
        }
        StringBuilder query = new StringBuilder(sql);
        Object[] params;
        if (excludeId != null) {
            query.append(" AND id <> ?");
            params = new Object[]{value, excludeId};
        } else {
            params = new Object[]{value};
        }
        Integer count = jdbcTemplate.queryForObject(query.toString(), params, Integer.class);
        return count != null && count > 0;
    }
}
