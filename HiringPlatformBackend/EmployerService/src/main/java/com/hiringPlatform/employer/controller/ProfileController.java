package com.hiringPlatform.employer.controller;

import com.hiringPlatform.employer.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://localhost:3001")
public class ProfileController {

    private final ProfileService profileService;

    @Autowired
    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    /**
     * Method used for checking if an employer has a profile
     * @return boolean value
     */
    @GetMapping("/hasEmployerProfile/{email}")
    public ResponseEntity<Boolean> hasEmployerProfile(@PathVariable String email) {
        Boolean hasEmployerProfile =  profileService.hasEmployerProfile(email);
        return ResponseEntity.ok(hasEmployerProfile);
    }
}
