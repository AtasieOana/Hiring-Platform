package com.hiringPlatform.admin.exception;

public class ReviewNotFoundException extends RuntimeException{

    public ReviewNotFoundException(String message) {
        super(message);
    }
}