package com.hiringPlatform.employer.controller;

import com.hiringPlatform.employer.model.request.UpdateEmployerAccount;
import com.hiringPlatform.employer.model.response.EmployerResponse;
import com.hiringPlatform.employer.model.response.GetLoggedUserResponse;
import com.hiringPlatform.employer.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
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
    public ResponseEntity<GetLoggedUserResponse> getLoggedUser() {
        GetLoggedUserResponse user =  userService.getLoggedUser();
        return ResponseEntity.ok(user);
    }

    /**
     * Method used for updating an account for an employer
     * @return the updated account
     */
    @PostMapping("/updateAccount")
    public ResponseEntity<EmployerResponse> updateAccount(@Valid @RequestBody UpdateEmployerAccount employerAccount) {
        EmployerResponse user =  userService.updateEmployerAccount(employerAccount);
        return ResponseEntity.ok(user);
    }

}
