package com.hiringPlatform.employer.service;

import com.hiringPlatform.employer.model.Employer;
import com.hiringPlatform.employer.model.Profile;
import com.hiringPlatform.employer.model.User;
import com.hiringPlatform.employer.model.request.UpdateEmployerAccount;
import com.hiringPlatform.employer.model.response.EmployerResponse;
import com.hiringPlatform.employer.model.response.GetLoggedUserResponse;
import com.hiringPlatform.employer.repository.EmployerRepository;
import com.hiringPlatform.employer.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final EmployerRepository employerRepository;

    private final RedisService redisService;

    private final JwtService jwtService;

    private final ProfileService profileService;



    @Autowired
    public UserService(EmployerRepository employerRepository, ProfileService profileService,
                       RedisService redisService, JwtService jwtService) {
        this.employerRepository = employerRepository;
        this.redisService = redisService;
        this.profileService = profileService;
        this.jwtService = jwtService;
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
        Optional<Employer> optionalUser = employerRepository.findByEmail(userEmail);
        if(optionalUser.isPresent()){
            if(optionalUser.get().getUserDetails().getAccountEnabled() == 1 && !jwtService.isTokenExpired(userToken)) {
                GetLoggedUserResponse employerResponse = new GetLoggedUserResponse();
                Boolean hasProfile = profileService.hasEmployerProfile(userEmail);
                employerResponse.setEmployer(optionalUser.get());
                employerResponse.setToken(userToken);
                employerResponse.setHasProfile(hasProfile);
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

    /**
     * Method used for updating an account for an employer
     * @return the updated account
     */
    public EmployerResponse updateEmployerAccount(UpdateEmployerAccount employerAccount) {
        String userToken = redisService.getData("userToken");
        Optional<Employer> optionalUser = employerRepository.findByEmail(employerAccount.getEmail());
        if(optionalUser.isPresent()){
            Employer employerToBeSaved = optionalUser.get();
            User userDetails = employerToBeSaved.getUserDetails();
            if(!employerAccount.getNewPassword().isEmpty()) {
                BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();
                String encodedPassword = bCryptPasswordEncoder.encode(employerAccount.getNewPassword());
                userDetails.setPassword(encodedPassword);
            }
            else {
                userDetails.setPassword(employerToBeSaved.getUserDetails().getPassword());
            }
            employerToBeSaved.setCompanyName(employerAccount.getNewCompanyName());
            employerToBeSaved.setUserDetails(userDetails);
            Employer savedEmployer = employerRepository.save(employerToBeSaved);
            EmployerResponse employerResponse = new EmployerResponse();
            employerResponse.setEmployer(savedEmployer);
            employerResponse.setToken(userToken);
            return employerResponse;
        }
        else{
            return null;
        }
    }

}
