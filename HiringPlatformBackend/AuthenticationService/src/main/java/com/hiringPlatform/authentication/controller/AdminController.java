package com.hiringPlatform.authentication.controller;

import com.hiringPlatform.authentication.model.Admin;
import com.hiringPlatform.authentication.model.User;
import com.hiringPlatform.authentication.model.request.RegisterCandidateRequest;
import com.hiringPlatform.authentication.model.request.RegisterEmployerRequest;
import com.hiringPlatform.authentication.model.request.ResetPasswordRequest;
import com.hiringPlatform.authentication.model.request.UserGoogleRequest;
import com.hiringPlatform.authentication.model.response.LoginAdminResponse;
import com.hiringPlatform.authentication.model.response.LoginResponse;
import com.hiringPlatform.authentication.model.response.RegisterResponse;
import com.hiringPlatform.authentication.security.JwtService;
import com.hiringPlatform.authentication.service.AdminService;
import com.hiringPlatform.authentication.service.RedisService;
import com.hiringPlatform.authentication.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

import static com.hiringPlatform.authentication.security.JpaUserDetailsService.mapRolesToAuthorities;

@RestController
@CrossOrigin(origins = {"http://localhost:3000"})
public class AdminController {

    private final AdminService adminService;
    private final JwtService jwtService;
    private final RedisService redisService;

    @Autowired
    public AdminController(AdminService adminService, JwtService jwtService, RedisService redisService) {
        this.adminService = adminService;
        this.jwtService = jwtService;
        this.redisService = redisService;
    }

    /**
     * Method used for login an admin into an account
     * @param email the user email
     * @param password the user password
     * @return the token for the logged user
     */
    @GetMapping("/loginAdmin/{email}/{password}")
    public ResponseEntity<LoginAdminResponse> loginAdmin(@PathVariable String email, @PathVariable String password) {
        Admin user =  adminService.loginAdmin(email, password);
        return getLoginAdminResponse(user);
    }

    private ResponseEntity<LoginAdminResponse> getLoginAdminResponse(Admin user) {
        String jwtToken = "";
        LoginAdminResponse loginResponse = new LoginAdminResponse();
        if(user != null){
            jwtToken = jwtService.generateToken(new org.springframework.security.core.userdetails.User(user.getUserDetails().getEmail(),
                    user.getUserDetails().getPassword(),
                    mapRolesToAuthorities(user.getUserDetails().getUserRole())));
            redisService.saveData("userToken", jwtToken);
            redisService.saveData("userEmail", user.getUserDetails().getEmail());
        }
        loginResponse.setToken(jwtToken);
        loginResponse.setAdmin(user);
        loginResponse.setExpiresIn(jwtService.getExpirationTime());
        return ResponseEntity.ok(loginResponse);
    }

}