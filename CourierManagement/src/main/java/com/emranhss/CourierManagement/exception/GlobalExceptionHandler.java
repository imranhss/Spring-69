package com.emranhss.CourierManagement.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Global exception handler for the entire application.
 *
 * @RestControllerAdvice automatically catches exceptions
 * thrown from any @RestController.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Handles all RuntimeExceptions.
     *
     * Example:
     * throw new RuntimeException("Customer not found");
     *
     * Response:
     * {
     *   "timestamp": "2026-06-13T12:30:45",
     *   "status": 400,
     *   "error": "Bad Request",
     *   "message": "Customer not found"
     * }
     */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntimeException(RuntimeException ex) {

        // Create response body
        Map<String, Object> body = new LinkedHashMap<>();

        // Current date and time
        body.put("timestamp", LocalDateTime.now());

        // HTTP status code
        body.put("status", HttpStatus.BAD_REQUEST.value());

        // Error title
        body.put("error", "Bad Request");

        // Actual exception message
        body.put("message", ex.getMessage());

        // Return JSON response with HTTP 400 status
        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    /**
     * Handles all other exceptions not handled above.
     *
     * Example:
     * NullPointerException
     * SQLException
     * IOException
     * etc.
     *
     * Response:
     * {
     *   "timestamp": "2026-06-13T12:30:45",
     *   "status": 500,
     *   "error": "Internal Server Error",
     *   "message": "Some unexpected error"
     * }
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGenericException(Exception ex) {

        // Create response body
        Map<String, Object> body = new LinkedHashMap<>();

        // Current date and time
        body.put("timestamp", LocalDateTime.now());

        // HTTP status code
        body.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());

        // Error title
        body.put("error", "Internal Server Error");

        // Actual exception message
        body.put("message", ex.getMessage());

        // Return JSON response with HTTP 500 status
        return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}