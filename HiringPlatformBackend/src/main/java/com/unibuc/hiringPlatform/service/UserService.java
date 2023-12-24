package com.unibuc.hiringPlatform.service;

import com.unibuc.hiringPlatform.model.User;
import com.unibuc.hiringPlatform.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }


    public User signUp(User user) {
        Optional<User> optionalUser = userRepository.findByEmail(user.getEmail());
        if(optionalUser.isPresent()){
            //this.authenticationTokenService.sendAuthenticationEmail(optionalUser.get(), true);
            return optionalUser.get();
        }
        else {
            BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();
            String encodedPassword = bCryptPasswordEncoder.encode(user.getPassword());
            user.setPassword(encodedPassword);
            user.setRegistrationDate(new Date());
            user.setAccountEnabled(0);
            User userDB = userRepository.save(user);
            //this.authenticationTokenService.sendAuthenticationEmail(userDB, false);
            return userDB;
        }
    }

    public User login(String email, String password) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if(optionalUser.isPresent()){
            System.out.println(optionalUser.get().getAccountEnabled());
            if(optionalUser.get().getAccountEnabled() == 1) {
                BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();
                boolean passwordMatch = bCryptPasswordEncoder.matches(password, optionalUser.get().getPassword());
                if (!passwordMatch) {
                    return null;
                } else {
                    return optionalUser.get();
                }
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
