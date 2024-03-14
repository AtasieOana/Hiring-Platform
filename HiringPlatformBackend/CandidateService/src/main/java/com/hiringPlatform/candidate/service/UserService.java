package com.hiringPlatform.candidate.service;

import com.hiringPlatform.candidate.model.Candidate;
import com.hiringPlatform.candidate.model.Employer;
import com.hiringPlatform.candidate.model.User;
import com.hiringPlatform.candidate.model.request.UpdateCandidateAccount;
import com.hiringPlatform.candidate.model.response.CandidateResponse;
import com.hiringPlatform.candidate.model.response.GetLoggedUserResponse;
import com.hiringPlatform.candidate.repository.CandidateRepository;
import com.hiringPlatform.candidate.repository.EmployerRepository;
import com.hiringPlatform.candidate.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final CandidateRepository candidateRepository;

    private final RedisService redisService;

    private final JwtService jwtService;

    private final CVService cvService;

    @Autowired
    public UserService(CandidateRepository candidateRepository,
                       RedisService redisService,
                       JwtService jwtService,
                       CVService cvService) {
        this.candidateRepository = candidateRepository;
        this.redisService = redisService;
        this.jwtService = jwtService;
        this.cvService = cvService;
    }

    /**
     * Method used for getting the logged user
     * @return null if the user is not logged, the user otherwise
     */
    public GetLoggedUserResponse getLoggedUser() {
        String userEmail = redisService.getData("userEmail");
        String userToken = redisService.getData("userToken");
        if(userEmail == null || userEmail.isEmpty()){
            return null;
        }
        Optional<Candidate> optionalUser = candidateRepository.findByEmail(userEmail);
        if(optionalUser.isPresent()){
            if(optionalUser.get().getUserDetails().getAccountEnabled() == 1 && !jwtService.isTokenExpired(userToken)) {
                GetLoggedUserResponse candidateResponse = new GetLoggedUserResponse();
                Boolean hasCv = cvService.hasCv(userEmail);
                candidateResponse.setCandidate(optionalUser.get());
                candidateResponse.setToken(userToken);
                candidateResponse.setHasCv(hasCv);
                return candidateResponse;
            }
            else{
                return null;
            }
        }
        else{
            return null;
        }
    }

    /**
     * Method used for updating an account for a candidate
     * @return the updated account
     */
    public CandidateResponse updateCandidateAccount(UpdateCandidateAccount candidateAccount) {
        String userToken = redisService.getData("userToken");
        Optional<Candidate> optionalUser = candidateRepository.findByEmail(candidateAccount.getEmail());
        if(optionalUser.isPresent()){
            Candidate candidateToBeSaved = optionalUser.get();
            User userDetails = candidateToBeSaved.getUserDetails();
            if(!candidateAccount.getNewPassword().isEmpty()) {
                BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();
                String encodedPassword = bCryptPasswordEncoder.encode(candidateAccount.getNewPassword());
                userDetails.setPassword(encodedPassword);
            }
            else {
                userDetails.setPassword(candidateToBeSaved.getUserDetails().getPassword());
            }
            candidateToBeSaved.setLastname(candidateAccount.getNewLastName());
            candidateToBeSaved.setFirstname(candidateAccount.getNewFirstName());
            candidateToBeSaved.setUserDetails(userDetails);
            Candidate savedCandidate = candidateRepository.save(candidateToBeSaved);
            CandidateResponse candidateResponse = new CandidateResponse();
            candidateResponse.setCandidate(savedCandidate);
            candidateResponse.setToken(userToken);
            return candidateResponse;
        }
        else{
            return null;
        }
    }

}
