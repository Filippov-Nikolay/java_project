package com.nikolay.onlinediary.exception;

public class NotFoundException extends RuntimeException {
    private final String entityName;
    private final Long id;

    public NotFoundException(String entityName, Long id) {
        super(String.format("%s с идентификатором %d не найден", entityName, id));
        this.entityName = entityName;
        this.id = id;
    }

    public String getEntityName() {
        return entityName;
    }

    public Long getId() {
        return id;
    }
}
