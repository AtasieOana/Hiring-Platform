package com.hiringPlatform.authentication.controller;

import com.hiringPlatform.authentication.exception.UnauthorizedException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ExceptionControllerAdvice {

    @ExceptionHandler({UnauthorizedException.class})
    public ResponseEntity<String> handleUnauthorizedExceptions(Exception exception) {
        System.out.println(exception.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(exception.getMessage());
    }

    @ExceptionHandler({RuntimeException.class})
    public ResponseEntity<String> handleNotFoundExceptions(Exception exception) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(exception.getMessage());
    }
}
