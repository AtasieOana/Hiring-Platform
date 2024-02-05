package com.hiringPlatform.employer.controller;

import com.hiringPlatform.employer.model.response.EmployerResponse;
import com.hiringPlatform.employer.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://localhost:3001")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * Method used for getting the logged user
     * @return null if the user is not logged, the user otherwise
     */
    @GetMapping("/getLoggedUser")
    public ResponseEntity<EmployerResponse> login() {
        EmployerResponse user =  userService.getLoggedUser();
        return ResponseEntity.ok(user);
    }
}
