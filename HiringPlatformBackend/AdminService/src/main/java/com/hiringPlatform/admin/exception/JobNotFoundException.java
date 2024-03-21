package com.hiringPlatform.admin.exception;

public class JobNotFoundException extends RuntimeException{

    public JobNotFoundException(String message) {
        super(message);
    }
}