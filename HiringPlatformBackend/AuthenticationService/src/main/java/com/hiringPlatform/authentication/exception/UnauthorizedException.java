package com.hiringPlatform.authentication.exception;

public class UnauthorizedException extends RuntimeException{

    public UnauthorizedException(String message) {
        super(message);
    }
}