package com.hiringPlatform.candidate.exception;

public class JobNotFoundException extends RuntimeException{

    public JobNotFoundException(String message) {
        super(message);
    }
}