package com.hiringPlatform.authentication.service;

import com.hiringPlatform.authentication.model.Candidate;
import com.hiringPlatform.authentication.model.User;
import com.hiringPlatform.authentication.repository.CandidateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CandidateService {

    private final CandidateRepository candidateRepository;

    @Autowired
    public CandidateService(CandidateRepository candidateRepository) {
        this.candidateRepository = candidateRepository;
    }

    public Candidate saveCandidate(User user, String lastname, String firstname){
        Candidate candidate = new Candidate();
        candidate.setUserDetails(user);
        candidate.setLastname(lastname);
        candidate.setFirstname(firstname);
        return candidateRepository.save(candidate);
    }
}
