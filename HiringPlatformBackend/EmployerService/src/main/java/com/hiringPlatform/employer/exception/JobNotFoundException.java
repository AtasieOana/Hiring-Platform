package com.hiringPlatform.employer.exception;

public class JobNotFoundException extends RuntimeException{

    public JobNotFoundException(String message) {
        super(message);
    }
}