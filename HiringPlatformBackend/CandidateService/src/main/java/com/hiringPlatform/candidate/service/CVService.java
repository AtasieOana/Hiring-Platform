package com.hiringPlatform.candidate.service;

import com.hiringPlatform.candidate.exception.FileException;
import com.hiringPlatform.candidate.model.*;
import com.hiringPlatform.candidate.model.response.CVResponse;
import com.hiringPlatform.candidate.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Date;
import java.util.List;

@Service
public class CVService {

    private final CVRepository cvRepository;

    private final CandidateService candidateService;

    @Autowired
    public CVService(CVRepository cvRepository, CandidateService candidateService) {
        this.cvRepository = cvRepository;
        this.candidateService = candidateService;
    }

    /**
     * Method used for retrieving all CV for a candidate
     * @return the list of all CV for candidate
     */
    public List<CVResponse> getAllCvsForCandidate(String candidateId){
        return cvRepository.findCVsForCandidate(candidateId).stream().map(cv -> {
            CVResponse response = new CVResponse();
            response.setCandidateEmail(cv.getCandidate().getUserDetails().getEmail());
            response.setCvName(cv.getCvName());
            response.setUploadDate(cv.getUploadDate());
            response.setCandidateLastname(cv.getCandidate().getLastname());
            response.setCandidateFirstname(cv.getCandidate().getFirstname());
            response.setCvId(cv.getCvId());
            return response;
        }).toList();
    }

    public Boolean hasCv(String emailId){
        return !cvRepository.findCVsByEmail(emailId).isEmpty();
    }

    /**
     * Method used for adding a CV
     * @return the list of all CV for candidate
     */
    public List<CVResponse> addCV(String fileName, String candidateId){
        Candidate candidate = candidateService.getCandidateById(candidateId);
        CV cv = new CV();
        cv.setCvName(fileName);
        cv.setUploadDate(new Date());
        cv.setCandidate(candidate);
        cvRepository.save(cv);
        return getAllCvsForCandidate(candidateId);
    }


}
