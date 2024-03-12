package com.hiringPlatform.candidate.controller;

import com.hiringPlatform.candidate.model.request.UpdateCandidateAccount;
import com.hiringPlatform.candidate.model.response.CandidateResponse;
import com.hiringPlatform.candidate.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@CrossOrigin(origins = "http://localhost:3002")
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
    public ResponseEntity<CandidateResponse> login() {
        CandidateResponse user =  userService.getLoggedUser();
        return ResponseEntity.ok(user);
    }

    /**
     * Method used for updating an account for a candidate
     * @return the updated account
     */
    @PostMapping("/updateAccount")
    public ResponseEntity<CandidateResponse> updateAccount(@Valid @RequestBody UpdateCandidateAccount candidateAccount) {
        CandidateResponse user =  userService.updateCandidateAccount(candidateAccount);
        return ResponseEntity.ok(user);
    }
}
