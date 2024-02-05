package com.hiringPlatform.employer.service;

import com.hiringPlatform.employer.model.Employer;
import com.hiringPlatform.employer.model.User;
import com.hiringPlatform.employer.model.response.EmployerResponse;
import com.hiringPlatform.employer.repository.EmployerRepository;
import com.hiringPlatform.employer.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final EmployerRepository employerRepository;

    private final RedisService redisService;

    @Autowired
    public UserService(EmployerRepository employerRepository, RedisService redisService) {
        this.employerRepository = employerRepository;
        this.redisService = redisService;
    }

    /**
     * Method used for getting the logged user
     * @return null if the user is not logged, the user otherwise
     */
    public EmployerResponse getLoggedUser() {
        String userEmail = redisService.getData("userEmail");
        String userToken = redisService.getData("userToken");
        if(userEmail == null || userEmail.equals("")){
            return null;
        }
        Optional<Employer> optionalUser = employerRepository.findByEmail(userEmail);
        if(optionalUser.isPresent()){
            if(optionalUser.get().getUserDetails().getAccountEnabled() == 1) {
                EmployerResponse employerResponse = new EmployerResponse();
                employerResponse.setEmployer(optionalUser.get());
                employerResponse.setToken(userToken);
                return employerResponse;
            }
            else{
                return null;
            }
        }
        else{
            return null;
        }
    }


}
