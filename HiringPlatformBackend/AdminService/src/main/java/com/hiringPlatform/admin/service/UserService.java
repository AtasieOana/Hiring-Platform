package com.hiringPlatform.admin.service;

import com.hiringPlatform.admin.model.User;
import com.hiringPlatform.admin.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getUser(String userId){
        Optional<User> optionalUser = userRepository.findById(userId);
        return optionalUser.orElse(null);
    }
}
