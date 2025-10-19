package com.nikolay.onlinediary.service.impl;

import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

@Repository
public class JdbcHealthDao {

    private final DataSource dataSource;

    public JdbcHealthDao(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    /** Возвращает true, если SELECT 1 FROM DUAL (Oracle) отрабатывает */
    public boolean isAlive() throws Exception {
        try (Connection c = dataSource.getConnection();
             PreparedStatement ps = c.prepareStatement("SELECT 1 FROM DUAL");
             ResultSet rs = ps.executeQuery()) {
            return rs.next();
        }
    }
}
