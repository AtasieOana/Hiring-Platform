package com.hiringPlatform.common.service;

import com.hiringPlatform.common.model.Candidate;
import com.hiringPlatform.common.repository.CandidateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CandidateService {

    private final CandidateRepository candidateRepository;

    @Autowired
    public CandidateService(CandidateRepository candidateRepository) {
        this.candidateRepository = candidateRepository;
    }

    public Candidate getCandidate(String candidateId){
        Optional<Candidate> optionalUser = candidateRepository.findById(candidateId);
        return optionalUser.orElse(null);
    }
}
