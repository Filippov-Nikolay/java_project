package com.nikolay.onlinediary.exception;

public class ContactNotFoundException extends RuntimeException {
    public ContactNotFoundException(Long id) {
        super(id == null ? "Контакт не найден" : "Контакт с id=" + id + " не найден");
    }
}