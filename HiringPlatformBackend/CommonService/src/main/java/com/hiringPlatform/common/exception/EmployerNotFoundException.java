package com.hiringPlatform.common.exception;

public class EmployerNotFoundException extends RuntimeException{

    public EmployerNotFoundException(String message) {
        super(message);
    }
}