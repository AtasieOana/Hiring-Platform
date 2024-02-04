package com.hiringPlatform.employer.service;

import com.hiringPlatform.employer.model.LoggedUserResponse;
import com.hiringPlatform.employer.model.User;
import com.hiringPlatform.employer.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    private final RedisService redisService;

    @Autowired
    public UserService(UserRepository userRepository, RedisService redisService) {
        this.userRepository = userRepository;
        this.redisService = redisService;
    }

    /**
     * Method used for getting the logged user
     * @return null if the user is not logged, the user otherwise
     */
    public LoggedUserResponse getLoggedUser() {
        String userEmail = redisService.getData("userEmail");
        String userToken = redisService.getData("userToken");
        Optional<User> optionalUser = userRepository.findByEmail(userEmail);
        if(optionalUser.isPresent()){
            if(optionalUser.get().getAccountEnabled() == 1) {
                LoggedUserResponse loggedUserResponse = new LoggedUserResponse();
                loggedUserResponse.setEmail(userEmail);
                loggedUserResponse.setUsername(optionalUser.get().getUsername());
                loggedUserResponse.setRoleName(optionalUser.get().getUserRole().getRoleName());
                loggedUserResponse.setToken(userToken);
                return loggedUserResponse;
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
