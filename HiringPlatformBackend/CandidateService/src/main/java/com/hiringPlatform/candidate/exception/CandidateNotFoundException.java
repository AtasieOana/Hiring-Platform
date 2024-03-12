package com.hiringPlatform.candidate.exception;

public class CandidateNotFoundException extends RuntimeException{

    public CandidateNotFoundException(String message) {
        super(message);
    }
}