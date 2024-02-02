package com.hiringPlatform.authentication.service;

import com.hiringPlatform.authentication.model.Role;
import com.hiringPlatform.authentication.model.User;
import com.hiringPlatform.authentication.model.request.RegisterRequest;
import com.hiringPlatform.authentication.model.request.ResetPasswordRequest;
import com.hiringPlatform.authentication.model.request.UserGoogleRequest;
import com.hiringPlatform.authentication.model.response.RegisterResponse;
import com.hiringPlatform.authentication.repository.RoleRepository;
import com.hiringPlatform.authentication.repository.UserRepository;
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
    private final AuthenticationTokenService authenticationTokenService;

    private final RoleRepository roleRepository;


    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    public UserService(UserRepository userRepository, AuthenticationTokenService authenticationTokenService, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.authenticationTokenService = authenticationTokenService;
        this.roleRepository = roleRepository;
    }

    /**
     * Method used for creating a new account
     * @param userRequest: the new user account
     * @return the signed used
     */
    public RegisterResponse signUp(RegisterRequest userRequest) {
        Optional<User> optionalUser = userRepository.findByEmail(userRequest.getEmail());
        RegisterResponse registerResponse = new RegisterResponse();
        registerResponse.setEmail(userRequest.getEmail());
        registerResponse.setUsername(userRequest.getUsername());
        registerResponse.setRoleName(userRequest.getAccountType());
        if(optionalUser.isPresent()){
            this.authenticationTokenService.sendAuthenticationEmail(optionalUser.get(), true);
            return registerResponse;
        }
        else {
            User user = new User();
            BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();
            String encodedPassword = bCryptPasswordEncoder.encode(userRequest.getPassword());
            user.setEmail(userRequest.getEmail());
            user.setUsername(userRequest.getUsername());
            user.setPassword(encodedPassword);
            user.setRegistrationDate(new Date());
            user.setAccountEnabled(0);
            Optional<Role> role = roleRepository.findByRoleName(userRequest.getAccountType());
            role.ifPresent(user::setUserRole);
            User userDB = userRepository.save(user);
            this.authenticationTokenService.sendAuthenticationEmail(userDB, false);
            return registerResponse;
        }
    }

    /**
     * Method used for creating or login a user with Google
     * @param userRequest: the user account
     * @return the signed/logged used
     */
    public User authGoogle(UserGoogleRequest userRequest) {
        String email = userRequest.getEmail();
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if(optionalUser.isPresent()){
            // the user already exist in database, so it is a login operation
            User user = optionalUser.get();
            user.setPassword("");
            return user;
        }
        else {
            // the user don't exist in database, so it is a signup operation
            User user = new User();
            user.setEmail(userRequest.getEmail());
            user.setUsername(userRequest.getUsername());
            user.setRegistrationDate(new Date());
            user.setAccountEnabled(1);
            user.setPassword("");
            Optional<Role> role = roleRepository.findByRoleName(userRequest.getAccountType());
            role.ifPresent(user::setUserRole);
            return userRepository.save(user);
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

    private User activateAccount(String email){
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setAccountEnabled(1);
            return userRepository.save(user);
        } else {
            return null;
        }
    }

    private User updatePassword(String email, String password){
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();
            String encodedPassword = bCryptPasswordEncoder.encode(password);
            user.setPassword(encodedPassword);
            return userRepository.save(user);
        } else {
            return null;
        }
    }

    /**
     * Method used for checking a token
     * @param email the email of the user
     * @param token the token for the user
     * @return the validation of the token
     */
    public Boolean verifyToken(String email, String token){
        boolean tokenValid = authenticationTokenService.verifyToken(email, token);
        if(tokenValid){
            activateAccount(email);
            authenticationTokenService.deleteToken(email);
        }
        return tokenValid;
    }

    /**
     * Method used for checking a token and resenting a password
     * @param request the reset password request
     * @return the validation of the token
     */
    public Boolean resetPassword(ResetPasswordRequest request){
        boolean tokenValid = authenticationTokenService.verifyToken(request.getEmail(), request.getToken());
        if(tokenValid){
            updatePassword(request.getEmail(), request.getNewPassword());
            authenticationTokenService.deleteToken(request.getEmail());
        }
        return tokenValid;
    }

    /**
     * Method used for sending an email for resenting the password
     * @param email the email of the user
     * @return the status of the email
     */
    public Boolean forgotPassword(String email) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if(optionalUser.isPresent()){
            this.authenticationTokenService.sendPasswordEmail(email, optionalUser.get().getAccountEnabled() == 1, optionalUser.get());
        }
        else {
            this.authenticationTokenService.sendPasswordEmail(email, false, null);
        }
        return true;
    }


    /**
     * Method used for retrieving all users
     * @return the list of users
     */
    public List<User> getAllUsers() {
        return new ArrayList<>(userRepository.findAll());
    }
}
