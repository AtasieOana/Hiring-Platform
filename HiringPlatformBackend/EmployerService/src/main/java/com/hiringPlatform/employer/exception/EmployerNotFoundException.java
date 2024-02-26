package com.hiringPlatform.employer.exception;

public class EmployerNotFoundException extends RuntimeException{

    public EmployerNotFoundException(String message) {
        super(message);
    }
}