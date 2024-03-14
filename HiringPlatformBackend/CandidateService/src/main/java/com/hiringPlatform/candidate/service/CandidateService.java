package com.hiringPlatform.candidate.service;

import com.hiringPlatform.candidate.model.Candidate;
import com.hiringPlatform.candidate.model.User;
import com.hiringPlatform.candidate.model.request.UpdateCandidateAccount;
import com.hiringPlatform.candidate.model.response.CandidateResponse;
import com.hiringPlatform.candidate.repository.CandidateRepository;
import com.hiringPlatform.candidate.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CandidateService {

    private final CandidateRepository candidateRepository;

    @Autowired
    public CandidateService(CandidateRepository candidateRepository) {
        this.candidateRepository = candidateRepository;
    }

    /**
     * Method used for getting a candidate by id
     * @param candidateId the candidate id
     * @return candidate
     */
    public Candidate getCandidateById(String candidateId) {
        Optional<Candidate> optionalUser = candidateRepository.findByCandidate(candidateId);
        return optionalUser.orElse(null);
    }
}
