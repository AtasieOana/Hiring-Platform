package com.hiringPlatform.authentication.service;

import com.hiringPlatform.authentication.model.AuthenticationToken;
import com.hiringPlatform.authentication.model.User;
import com.hiringPlatform.authentication.model.request.SendMailRequest;
import com.hiringPlatform.authentication.repository.AuthenticationTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Date;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

import static com.hiringPlatform.authentication.constant.Constant.SEND_MAIL_URL;

@Service
public class AuthenticationTokenService {

    private final AuthenticationTokenRepository authenticationTokenRepository;
    private final RestTemplate restTemplate;

    @Autowired
    public AuthenticationTokenService(AuthenticationTokenRepository authenticationTokenRepository,
                                      RestTemplate restTemplate) {
        this.authenticationTokenRepository = authenticationTokenRepository;
        this.restTemplate = restTemplate;
    }

    /**
     * Method used for sending an email related to the authentication
     * @param user the user that wants to authenticate
     * @param alreadyExistEmail boolean with value true if an object with that email already exists in db
     */
    public void sendAuthenticationEmail(User user, boolean alreadyExistEmail) {
        if(alreadyExistEmail && user.getAccountEnabled() == 1){
            String emailContent = "<div style='background-color: #f4f4f4; padding: 20px;'>" +
                    "<p>Hello,</p>" +
                    "</br><p>This email is related to authentication in the <b>Joblistic</b> platform. An account with this email already exists. Please, try to <span style='color: darkorange;'>login.</span></p>" +
                    "<p>Thank you,</p>" +
                    "<p><b>Joblistic Team</b></p>" +
                    "</div>";
            this.sendMailCall(user.getEmail(), emailContent, "Authentication to JOBLISTIC");
        }
        else{
            Optional<AuthenticationToken> authenticationTokenOptional = authenticationTokenRepository.findByUserEmail(user.getEmail());
            if (authenticationTokenOptional.isPresent()) {
                // token is valid
                if (authenticationTokenOptional.get().getExpiryDate().getTime() > new Date().getTime()) {
                    String emailContent = "<div style='background-color: #f4f4f4; padding: 20px;'>" +
                            "<p>Hello,</p>" +
                            "</br><p>This email is related to authentication in the <b>Joblistic</b> platform. A valid <span style='color: darkorange;'>token</span> for this email already exists. Please, check your previous emails.</p>" +
                            "<p>Thank you,</p>" +
                            "<p><b>Joblistic Team</b></p>" +
                            "</div>";
                    this.sendMailCall(user.getEmail(), emailContent, "Authentication to JOBLISTIC");
                }
                // token is invalid, another token is needed
                else {
                    authenticationTokenRepository.delete(authenticationTokenOptional.get());
                    AuthenticationToken authenticationToken = this.generateToken(user);
                    String emailContent = "<div style='background-color: #f4f4f4; padding: 20px;'>" +
                            "<p>Hello,</p>" +
                            "</br><p>This email is related to authentication in the <b>Joblistic</b> platform. To register use the following token: </p>" +
                            "<p><div style='color: darkorange;text-align: center;'><b>" + authenticationToken.getToken() + "<b></div></p>" +
                            "<p>Thank you,</p>" +
                            "<p> <b>Joblistic Team</b></p>" +
                            "</div>";
                    this.sendMailCall(user.getEmail(), emailContent, "Authentication to JOBLISTIC");
                }
            }
            else{
                AuthenticationToken authenticationToken = this.generateToken(user);
                String emailContent = "<div style='background-color: #f4f4f4; padding: 20px;'>" +
                        "<p>Hello,</p>" +
                        "</br><p>This email is related to authentication in the <b>Joblistic</b> platform. To register use the following token: </p>" +
                        "<p><div style='color: darkorange;text-align: center;'><b>" + authenticationToken.getToken() + "<b></div></p>" +
                        "<p>Thank you,</p>" +
                        "<p> <b>Joblistic Team</b></p>" +
                        "</div>";
                this.sendMailCall(user.getEmail(), emailContent, "Authentication to JOBLISTIC");
            }
        }
    }

    /**
     * Method used for sending an email related to the resetting the password
     * @param email the email for the user
     * @param accountEnabled boolean with value true if the user account is enabled
     * @param user the user
     */
    public void sendPasswordEmail(String email, boolean accountEnabled, User user) {
        if(accountEnabled){
            Optional<AuthenticationToken> authenticationTokenOptional = authenticationTokenRepository.findByUserEmail(email);
            if (authenticationTokenOptional.isPresent()) {
                // A valid token already exists
                if (authenticationTokenOptional.get().getExpiryDate().getTime() > new Date().getTime()) {
                    String emailContent = "<div style='background-color: #f4f4f4; padding: 20px;'>" +
                            "<p>Hello,</p>" +
                            "</br><p>This email was sent following the password reset request the <b>Joblistic</b> platform. A valid <span style='color: darkorange;'>token</span> for this email already exists. Please, check your previous emails.</p>" +
                            "<p>Thank you,</p>" +
                            "<p><b>Joblistic Team</b></p>" +
                            "</div>";
                    this.sendMailCall(user.getEmail(), emailContent, "Reset password on JOBLISTIC");
                }
                // token is invalid, another token is needed
                else {
                    authenticationTokenRepository.delete(authenticationTokenOptional.get());
                    AuthenticationToken authenticationToken = this.generateToken(user);
                    String emailContent = "<div style='background-color: #f4f4f4; padding: 20px;'>" +
                            "<p>Hello,</p>" +
                            "</br><p>This email was sent following the password reset request the <b>Joblistic</b> platform. To reset the password use the following token: </p>" +
                            "<p><div style='color: darkorange;text-align: center;'><b>" + authenticationToken.getToken() + "<b></div></p>" +
                            "<p>Thank you,</p>" +
                            "<p><b>Joblistic Team</b></p>" +
                            "</div>";
                    this.sendMailCall(email, emailContent, "Reset password on JOBLISTIC");
                }
            }
            else{
                AuthenticationToken authenticationToken = this.generateToken(user);
                String emailContent = "<div style='background-color: #f4f4f4; padding: 20px;'>" +
                        "<p>Hello,</p>" +
                        "</br><p>This email was sent following the password reset request the <b>Joblistic</b> platform. To reset the password use the following token: </p>" +
                        "<p><div style='color: darkorange;text-align: center;'><b>" + authenticationToken.getToken() + "<b></div></p>" +
                        "<p>Thank you,</p>" +
                        "<p><b>Joblistic Team</b></p>" +
                        "</div>";
                this.sendMailCall(email, emailContent, "Reset password on JOBLISTIC");
            }
        }
        else{
            String emailContent = "<div style='background-color: #f4f4f4; padding: 20px;'>" +
                    "<p>Hello,</p>" +
                    "</br><p>This email was sent following the password reset request the <b>Joblistic</b> platform. An account with this email doesn't exists. Please, try to <span style='color: darkorange;'>create one.</span></p>" +
                    "<p>Thank you,</p>" +
                    "<p><b>Joblistic Team</b></p>" +
                    "</div>";
            this.sendMailCall(email, emailContent, "Reset password on JOBLISTIC");
        }
    }

    /**
     * Method used for generating token
     * @param user the user
     * @return the authentication token
     */
    private AuthenticationToken generateToken(User user){
        AuthenticationToken registerToken = new AuthenticationToken();
        String token = UUID.randomUUID().toString();
        Date expiryDate = new Date(new Date().getTime() + TimeUnit.HOURS.toMillis(24));
        registerToken.setToken(token);
        registerToken.setUser(user);
        registerToken.setExpiryDate(expiryDate);
        return authenticationTokenRepository.save(registerToken);
    }

    /**
     * Method used for checking a token
     * @param email the email of the user
     * @param token the token for the user
     * @return the validation of the token
     */
    public boolean verifyToken(String email, String token){
        Optional<AuthenticationToken> authenticationTokenOptional = authenticationTokenRepository.findByUserEmail(email);
        return authenticationTokenOptional.filter(authenticationToken -> Objects.equals(authenticationToken.getToken(), token)).isPresent();
    }

    /**
     * Method used for deleting a token by email
     * @param email the email of the user
     */
    public void deleteToken(String email){
        Optional<AuthenticationToken> authenticationTokenOptional = authenticationTokenRepository.findByUserEmail(email);
        authenticationTokenOptional.ifPresent(authenticationTokenRepository::delete);
    }

    private void sendMailCall(String email, String content, String subject){
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        SendMailRequest requestEmail = new SendMailRequest(email, content, subject);
        HttpEntity<SendMailRequest> request = new HttpEntity<>(requestEmail, headers);
        restTemplate.postForObject(SEND_MAIL_URL, request, String.class);
    }
}
