package com.nikolay.onlinediary.exception;

public class DuplicateContactException extends RuntimeException {

    private final String field;

    public DuplicateContactException(String field, String value) {
        super("Контакт с таким " + field + " уже существует: " + value);
        this.field = field;
    }

    public String getField() {
        return field;
    }
}