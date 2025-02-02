package com.hiringPlatform.authentication.service;

import com.hiringPlatform.authentication.model.Role;
import com.hiringPlatform.authentication.model.User;
import com.hiringPlatform.authentication.model.request.*;
import com.hiringPlatform.authentication.model.response.RegisterResponse;
import com.hiringPlatform.authentication.repository.RoleRepository;
import com.hiringPlatform.authentication.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

import static com.hiringPlatform.authentication.constant.Constant.SEND_MAIL_URL;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final AuthenticationTokenService authenticationTokenService;
    private final RoleRepository roleRepository;
    private final CandidateService candidateService;
    private final EmployerService employerService;
    private final RestTemplate restTemplate;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, AuthenticationTokenService authenticationTokenService,
                       RoleRepository roleRepository, CandidateService candidateService,
                       EmployerService employerService, RestTemplate restTemplate,
                       BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.userRepository = userRepository;
        this.authenticationTokenService = authenticationTokenService;
        this.roleRepository = roleRepository;
        this.candidateService = candidateService;
        this.employerService = employerService;
        this.restTemplate = restTemplate;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    /**
     * Method used for creating a new account for a candidate
     * @param userRequest: the new user account
     * @return the signed used
     */
    public RegisterResponse signUpCandidate(RegisterCandidateRequest userRequest) {
        Optional<User> optionalUser = userRepository.findByEmail(userRequest.getEmail());
        RegisterResponse registerResponse = new RegisterResponse();
        registerResponse.setEmail(userRequest.getEmail());
        registerResponse.setRoleName(userRequest.getAccountType());
        if(optionalUser.isPresent()){
            this.authenticationTokenService.sendAuthenticationEmail(optionalUser.get(), true);
        }
        else {
            User user = new User();
            String encodedPassword = bCryptPasswordEncoder.encode(userRequest.getPassword());
            user.setEmail(userRequest.getEmail());
            user.setPassword(encodedPassword);
            user.setRegistrationDate(new Date());
            user.setAccountEnabled(0);
            Optional<Role> role = roleRepository.findByRoleName(userRequest.getAccountType());
            role.ifPresent(user::setUserRole);
            User userDB = userRepository.save(user);
            candidateService.saveCandidate(userDB, userRequest.getLastname(), userRequest.getFirstname());
            this.authenticationTokenService.sendAuthenticationEmail(userDB, false);
        }
        return registerResponse;
    }

    /**
     * Method used for creating a new account for an employer
     * @param userRequest: the new user account
     * @return the signed used
     */
    public RegisterResponse signUpEmployer(RegisterEmployerRequest userRequest) {
        Optional<User> optionalUser = userRepository.findByEmail(userRequest.getEmail());
        RegisterResponse registerResponse = new RegisterResponse();
        registerResponse.setEmail(userRequest.getEmail());
        registerResponse.setRoleName(userRequest.getAccountType());
        if(optionalUser.isPresent()){
            this.authenticationTokenService.sendAuthenticationEmail(optionalUser.get(), true);
        }
        else {
            User user = new User();
            String encodedPassword = bCryptPasswordEncoder.encode(userRequest.getPassword());
            user.setEmail(userRequest.getEmail());
            user.setPassword(encodedPassword);
            user.setRegistrationDate(new Date());
            user.setAccountEnabled(0);
            Optional<Role> role = roleRepository.findByRoleName(userRequest.getAccountType());
            role.ifPresent(user::setUserRole);
            User userDB = userRepository.save(user);
            employerService.saveEmployer(user, userRequest.getCompanyName());
            this.authenticationTokenService.sendAuthenticationEmail(userDB, false);
        }
        return registerResponse;
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
                boolean passwordMatch = bCryptPasswordEncoder.matches(password, optionalUser.get().getPassword());
                if (!passwordMatch || Objects.equals(optionalUser.get().getUserRole().getRoleName(), "ROLE_ADMIN")) {
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
     * Method used login a user with Google
     * @param userRequest: the user account
     * @return the logged used
     */
    public User loginGoogle(UserGoogleRequest userRequest) {
        String email = userRequest.getEmail();
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if(optionalUser.isPresent()){
            // the user already exist in database, so it is a login operation
            User user = optionalUser.get();
            user.setPassword("");
            return user;
        }
        return null;
    }

    /**
     * Method used for creating a user with Google
     * @param userRequest: the user account
     * @return the signed used
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
            if(Objects.equals(userRequest.getAccountType(), "ROLE_EMPLOYER")){
                return registerEmployerGoogle(userRequest);
            }
            if(Objects.equals(userRequest.getAccountType(), "ROLE_CANDIDATE")){
                return registerCandidateGoogle(userRequest);
            }
        }
        return null;
    }

    /**
     * Method used for creating a user with Google as employer
     * @param userRequest: the user account
     * @return the signed user
     */
    private User registerEmployerGoogle(UserGoogleRequest userRequest) {
        // the user don't exist in database
        User user = new User();
        user.setEmail(userRequest.getEmail());
        user.setRegistrationDate(new Date());
        user.setAccountEnabled(1);
        user.setPassword("");
        Optional<Role> role = roleRepository.findByRoleName(userRequest.getAccountType());
        role.ifPresent(user::setUserRole);
        User userDB = userRepository.save(user);
        employerService.saveEmployer(user, userRequest.getName());
        return userDB;
    }

    /**
     * Method used for creating a user with Google as candidate
     * @param userRequest: the user account
     * @return the signed user
     */
    private User registerCandidateGoogle(UserGoogleRequest userRequest) {
        // the user don't exist in database
        User user = new User();
        user.setEmail(userRequest.getEmail());
        user.setRegistrationDate(new Date());
        user.setAccountEnabled(1);
        user.setPassword("");
        Optional<Role> role = roleRepository.findByRoleName(userRequest.getAccountType());
        role.ifPresent(user::setUserRole);
        User userDB = userRepository.save(user);
        candidateService.saveCandidate(userDB, userRequest.getFamilyName(), userRequest.getGivenName());
        return userDB;
    }

    protected void activateAccount(String email){
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setAccountEnabled(1);
            userRepository.save(user);
        }
    }

    protected void updatePassword(String email, String password){
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            String encodedPassword = bCryptPasswordEncoder.encode(password);
            user.setPassword(encodedPassword);
            userRepository.save(user);
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

    /**
     * Method used for deleting an account for an employer
     * @return boolean
     */
    public Boolean deleteUser(String email) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if(optionalUser.isPresent()){
            userRepository.delete(optionalUser.get());
            return true;
        }
        else{
            return false;
        }
    }

    public Boolean deleteUserByAdmin(String email, String emailAdmin, String reason) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if(optionalUser.isPresent()){
            String emailContent = "<div style='background-color: #f4f4f4; padding: 20px;'>" +
                    "<p>Hello,</p>" +
                    "</br><p>We are sorry, but your account from <b>Joblistic</b> platform has been deleted by the administrator <b>" + emailAdmin + "</b>. The reason is:</p>" +
                    "<p><div style='color: darkorange;'><b>" + reason + "<b></div></p>" +
                    "<p>If you have any doubts, please contact the administrator. Thank you,</p>" +
                    "<p><b>Joblistic Team</b></p>" +
                    "</div>";
            this.sendMailCall(email, emailContent, "Account deleted in JOBLISTIC");
            userRepository.delete(optionalUser.get());
            return true;
        }
        else{
            return false;
        }
    }

    private void sendMailCall(String email, String content, String subject){
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        SendMailRequest requestEmail = new SendMailRequest(email, content, subject);
        HttpEntity<SendMailRequest> request = new HttpEntity<>(requestEmail, headers);
        restTemplate.postForObject(SEND_MAIL_URL, request, String.class);
    }
}
