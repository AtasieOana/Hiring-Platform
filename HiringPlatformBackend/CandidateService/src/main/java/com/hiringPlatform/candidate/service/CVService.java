package com.hiringPlatform.candidate.service;

import com.hiringPlatform.candidate.model.*;
import com.hiringPlatform.candidate.model.response.CVResponse;
import com.hiringPlatform.candidate.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

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
            SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            String formattedDate = formatter.format(cv.getUploadDate());
            response.setUploadDate(formattedDate);
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

    public CV getCv(String cvId){
        Optional<CV> cv = cvRepository.findById(cvId);
        return cv.orElse(null);
    }

    public List<CVResponse> deleteCv(String cvId){
        Optional<CV> cv = cvRepository.findById(cvId);
        if(cv.isPresent()){
            cvRepository.delete(cv.get());
            return getAllCvsForCandidate(cv.get().getCandidate().getCandidateId());
        }
        return new ArrayList<>();
    }
}
