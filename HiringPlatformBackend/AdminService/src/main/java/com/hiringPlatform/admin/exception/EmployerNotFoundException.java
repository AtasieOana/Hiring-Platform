package com.hiringPlatform.admin.exception;

public class EmployerNotFoundException extends RuntimeException{

    public EmployerNotFoundException(String message) {
        super(message);
    }
}