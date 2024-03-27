package com.hiringPlatform.authentication.controller;

import com.hiringPlatform.authentication.model.request.*;
import com.hiringPlatform.authentication.model.request.UserGoogleRequest;
import com.hiringPlatform.authentication.model.response.LoginResponse;
import com.hiringPlatform.authentication.model.User;
import com.hiringPlatform.authentication.model.response.RegisterResponse;
import com.hiringPlatform.authentication.security.JwtService;
import com.hiringPlatform.authentication.service.RedisService;
import com.hiringPlatform.authentication.service.UserService;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.hiringPlatform.authentication.security.JpaUserDetailsService.mapRolesToAuthorities;

@RestController
@CrossOrigin(origins = {"http://localhost:3000"})
public class UserController {

    private final UserService userService;
    private final JwtService jwtService;
    private final RedisService redisService;

    @Autowired
    public UserController(UserService userService, JwtService jwtService, RedisService redisService) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.redisService = redisService;
    }

    /**
     * Method used for creating a new account for a candidate
     * @param user: the new user account
     * @return the signed used
     */
    @PostMapping("/signUpCandidate")
    public ResponseEntity<RegisterResponse> signUp(@Valid @RequestBody RegisterCandidateRequest user) {
        RegisterResponse signedUser =  userService.signUpCandidate(user);
        return ResponseEntity.ok(signedUser);
    }

    /**
     * Method used for creating a new account for an employer
     * @param user: the new user account
     * @return the signed used
     */
    @PostMapping("/signUpEmployer")
    public ResponseEntity<RegisterResponse> signUp(@Valid @RequestBody RegisterEmployerRequest user) {
        RegisterResponse signedUser =  userService.signUpEmployer(user);
        return ResponseEntity.ok(signedUser);
    }

    /**
     * Method used for login into an account
     * @param email the user email
     * @param password the user password
     * @return the token for the logged user
     */
    @GetMapping("/login/{email}/{password}")
    public ResponseEntity<LoginResponse> login(@PathVariable String email, @PathVariable String password) {
        User user =  userService.login(email, password);
        return getLoginResponse(user);
    }

    /**
     * Method used for logout from an account
     * @return a message
     */
    @GetMapping("/logoutUser")
    public ResponseEntity<String> logout() {
        redisService.removeData("userToken");
        return ResponseEntity.ok("User logout");
    }

    /**
     * Method used for retrieving all users
     * @return the list of users
     */
    @GetMapping("/seeUsers")
    public ResponseEntity<List<User>> getAllUsers(){
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    /**
     * Method used for checking a token
     * @param email the email of the user
     * @param token the token for the user
     * @return the validation of the token
     */
    @GetMapping("/checkToken/{email}/{token}")
    public ResponseEntity<Boolean> verifyToken(@PathVariable String email, @PathVariable String token) {
        Boolean isTokenValid = userService.verifyToken(email, token);
        return ResponseEntity.ok(isTokenValid);
    }

    /**
     * Method used for sending an email for resenting the password
     * @param email the email of the user
     * @return the status of the email
     */
    @GetMapping("/forgotPassword/{email}")
    public ResponseEntity<Boolean> forgotPassword(@PathVariable String email) {
        Boolean emailSend = userService.forgotPassword(email);
        return ResponseEntity.ok(emailSend);
    }

    /**
     * Method used for resenting a password if the token is valid
     * @param request the reset password request
     * @return the validation of the token
     */
    @PostMapping("/resetPassword")
    public ResponseEntity<Boolean> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        Boolean isTokenValid = userService.resetPassword(request);
        return ResponseEntity.ok(isTokenValid);
    }

    @PostMapping("/loginGoogle")
    public ResponseEntity<LoginResponse> loginGoogle(@RequestBody UserGoogleRequest userGoogleRequest) {
        User user =  userService.loginGoogle(userGoogleRequest);
        return getLoginResponse(user);
    }

    @PostMapping("/authGoogle")
    public ResponseEntity<LoginResponse> authGoogle(@RequestBody UserGoogleRequest userGoogleRequest) {
        User user =  userService.authGoogle(userGoogleRequest);
        return getLoginResponse(user);
    }

    private ResponseEntity<LoginResponse> getLoginResponse(User user) {
        String jwtToken = "";
        LoginResponse loginResponse = new LoginResponse();
        if(user != null){
            jwtToken = jwtService.generateToken(new org.springframework.security.core.userdetails.User(user.getEmail(),
                    user.getPassword(),
                    mapRolesToAuthorities(user.getUserRole())));
            loginResponse.setRoleName(user.getUserRole().getRoleName());
            redisService.saveData("userToken", jwtToken);
            redisService.saveData("userEmail", user.getEmail());
        }
        loginResponse.setToken(jwtToken);
        loginResponse.setExpiresIn(jwtService.getExpirationTime());
        return ResponseEntity.ok(loginResponse);
    }

    /**
     * Method used for deleting an account for a user
     * @return boolean
     */
    @DeleteMapping("/deleteUser/{email}")
    public ResponseEntity<Boolean> deleteUser(@PathVariable String email) {
        redisService.removeData("userToken");
        Boolean data = userService.deleteUser(email);
        return ResponseEntity.ok(data);
    }

    /**
     * Method used for deleting an account for a user by an admin
     * @return boolean
     */
    @PostMapping("/deleteUserByAdmin")
    public ResponseEntity<Boolean> deleteUserByAdmin(@RequestBody DeleteUserByAdminRequest request) {
        Boolean data = userService.deleteUserByAdmin(request.getEmailUser(), request.getEmailAdmin(), request.getReason());
        return ResponseEntity.ok(data);
    }
}