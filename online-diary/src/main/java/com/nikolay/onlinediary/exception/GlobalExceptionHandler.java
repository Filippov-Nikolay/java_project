package com.nikolay.onlinediary.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

@ControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(ContactNotFoundException.class)
    public Object handleContactNotFound(ContactNotFoundException ex, Model model, HttpServletRequest request) {
        log.warn("Contact not found: {}", ex.getMessage());
        if (isApiRequest(request)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
        model.addAttribute("status", HttpStatus.NOT_FOUND.value());
        model.addAttribute("error", HttpStatus.NOT_FOUND.getReasonPhrase());
        model.addAttribute("message", ex.getMessage());
        return "error";
    }

    @ExceptionHandler(DuplicateContactException.class)
    @ResponseBody
    public ResponseEntity<String> handleDuplicateContact(DuplicateContactException ex, HttpServletRequest request) {
        log.warn("Duplicate contact: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
    }

    @ExceptionHandler(NotFoundException.class)
    @ResponseBody
    public ResponseEntity<String> handleGenericNotFound(NotFoundException ex) {
        log.warn("Entity not found: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public String handleGenericException(Exception ex, Model model) {
        log.error("Unexpected error", ex);
        model.addAttribute("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
        model.addAttribute("error", HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase());
        model.addAttribute("message", ex.getMessage());
        return "error";
    }

    private boolean isApiRequest(HttpServletRequest request) {
        if (request == null || request.getRequestURI() == null) {
            return false;
        }
        return request.getRequestURI().startsWith("/api/");
    }
}
