package com.hiringPlatform.authentication.controller;

import com.hiringPlatform.authentication.model.LoginResponse;
import com.hiringPlatform.authentication.model.User;
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
     * Method used for creating a new account
     * @param user: the new user account
     * @return the signed used
     */
    @PostMapping("/signUp")
    public ResponseEntity<User> signUp(@Valid @RequestBody User user) {
        User signedUser =  userService.signUp(user);
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
        String jwtToken = "";
        LoginResponse loginResponse = new LoginResponse();
        if(user != null){
            jwtToken = jwtService.generateToken(new org.springframework.security.core.userdetails.User(user.getEmail(),
                    user.getPassword(),
                    mapRolesToAuthorities(user.getUserRole())));
            loginResponse.setUsername(user.getUsername());
            loginResponse.setRoleName(user.getUserRole().getRoleName());
            redisService.saveData("userToken", jwtToken);
        }
        loginResponse.setToken(jwtToken);
        loginResponse.setExpiresIn(jwtService.getExpirationTime());
        return ResponseEntity.ok(loginResponse);
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
}