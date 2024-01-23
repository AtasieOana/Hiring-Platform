package com.hiringPlatform.authentication.service;

import com.hiringPlatform.authentication.model.AuthenticationToken;
import com.hiringPlatform.authentication.model.User;
import com.hiringPlatform.authentication.repository.AuthenticationTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
public class AuthenticationTokenService {

    private final AuthenticationTokenRepository authenticationTokenRepository;
    private final EmailService emailService;

    @Autowired
    public AuthenticationTokenService(AuthenticationTokenRepository authenticationTokenRepository, EmailService emailService) {
        this.authenticationTokenRepository = authenticationTokenRepository;
        this.emailService = emailService;
    }

    public void sendAuthenticationEmail(User user, boolean alreadyExistEmail) {
        if(alreadyExistEmail && user.getAccountEnabled() == 1){
            this.emailService.sendEmailToUserAsync(user.getEmail(), "Hello, \n \n An account with this email already exists. Try to log in. \n \n Have a great day, \n TASKO Team", "Authentication to TASKO");
        }
        else{
            Optional<AuthenticationToken> authenticationTokenOptional = authenticationTokenRepository.findByUserEmail(user.getEmail());
            if (authenticationTokenOptional.isPresent()) {
                // token is valid
                if (authenticationTokenOptional.get().getExpiryDate().getTime() > new Date().getTime()) {
                    this.emailService.sendEmailToUserAsync(user.getEmail(), "Hello, \n \n A valid token for this email already exists. Check previous emails. \n \n Have a great day, \n TASKO Team", "Authentication to TASKO");
                }
                // token is invalid, another token is needed
                else {
                    authenticationTokenRepository.delete(authenticationTokenOptional.get());
                    AuthenticationToken authenticationToken = this.generateToken(user);
                    this.emailService.sendEmailToUserAsync(user.getEmail(), "Hello, \n  \n  To register on the TASKO platform use the following token: " + authenticationToken.getToken() + " . \n  \n  Have a great day, \n  TASKO Team", "Authentication to TASKO");
                }
            }
            else{
                AuthenticationToken authenticationToken = this.generateToken(user);
                this.emailService.sendEmailToUserAsync(user.getEmail(), "Hello, \n  \n  To register on the TASKO platform use the following token: " + authenticationToken.getToken() + " . \n  \n  Have a great day, \n  TASKO Team", "Authentication to TASKO");
            }
        }
    }

    private AuthenticationToken generateToken(User user){
        AuthenticationToken registerToken = new AuthenticationToken();
        String token = UUID.randomUUID().toString();
        Date expiryDate = new Date(new Date().getTime() + TimeUnit.HOURS.toMillis(24));
        registerToken.setToken(token);
        registerToken.setUser(user);
        registerToken.setExpiryDate(expiryDate);
        return authenticationTokenRepository.save(registerToken);
    }

    public boolean verifyToken(String email, String token){
        Optional<AuthenticationToken> authenticationTokenOptional = authenticationTokenRepository.findByUserEmail(email);
        return authenticationTokenOptional.filter(authenticationToken -> Objects.equals(authenticationToken.getToken(), token)).isPresent();
    }
}
