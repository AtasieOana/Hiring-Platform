package com.hiringPlatform.common.service;

import com.hiringPlatform.common.model.*;
import com.hiringPlatform.common.model.response.GetLoggedUserResponse;
import com.hiringPlatform.common.repository.CVRepository;
import com.hiringPlatform.common.repository.CandidateRepository;
import com.hiringPlatform.common.repository.UserRepository;
import com.hiringPlatform.common.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class UserService {

    private final UserRepository userRepository;

    private final RedisService redisService;

    private final CandidateRepository candidateRepository;

    private final JwtService jwtService;

    private final CVRepository cvRepository;

    @Autowired
    public UserService(UserRepository userRepository, RedisService redisService,
                       CandidateRepository candidateRepository,
                       JwtService jwtService,
                       CVRepository cvRepository) {
        this.userRepository = userRepository;
        this.redisService = redisService;
        this.candidateRepository = candidateRepository;
        this.jwtService = jwtService;
        this.cvRepository = cvRepository;
    }

    public User getUser(String userId){
        Optional<User> optionalUser = userRepository.findById(userId);
        return optionalUser.orElse(null);
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
                Boolean hasCv = hasCv(userEmail);
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

    public Boolean hasCv(String emailId){
        return !cvRepository.findCVsByEmail(emailId).isEmpty();
    }

}
