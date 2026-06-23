package com.badhu.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    //database error : 500
    @ExceptionHandler(DataBaseExceptions.class)
    public ResponseEntity<String> handleDataBaseExceptions(DataBaseExceptions e){
        return ResponseEntity .status(500) .body(e.getMessage());
    }

    //data validation || small db operations
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<String> handle(ResponseStatusException e){
        return ResponseEntity .status(e.getStatusCode()) .body(e.getMessage());
    }
}
