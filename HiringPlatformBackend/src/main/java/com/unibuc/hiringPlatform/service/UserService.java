package com.unibuc.hiringPlatform.service;

import com.unibuc.hiringPlatform.model.User;
import com.unibuc.hiringPlatform.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Method used for creating a new account
     * @param user: the new user account
     * @return the signed used
     */
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

    /**
     * Method used for login into an account
     * @param email the user email
     * @param password the user password
     * @return if the user data is correct the returnable is the logged used, else null
     */
    public User login(String email, String password) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if(optionalUser.isPresent()){
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

    /**
     * Method used for retrieving all users
     * @return the list of users
     */
    public List<User> getAllUsers() {
        return new ArrayList<>(userRepository.findAll());
    }
}
