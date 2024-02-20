package com.hiringPlatform.employer.controller;

import com.hiringPlatform.employer.model.Profile;
import com.hiringPlatform.employer.model.request.CreateProfileRequest;
import com.hiringPlatform.employer.model.response.GetProfileResponse;
import com.hiringPlatform.employer.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Base64;

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

    /**
     * Method used for adding a profile
     * @return the added profile
     */
    @PostMapping("/addEmployerProfile")
    public ResponseEntity<String> addEmployerProfile(@ModelAttribute CreateProfileRequest profileRequest) throws IOException {
        Profile profile = profileService.addEmployerProfile(profileRequest);
        return ResponseEntity.ok(profileRequest.getEmployerId());
    }

    /**
     * Method used for getting a profile
     * @return the profile information
     */
    @GetMapping("/getProfile/{email}")
    public ResponseEntity<GetProfileResponse> getProfile(@PathVariable String email) {
        GetProfileResponse profile =  profileService.getProfile(email);
        return ResponseEntity.ok(profile);
    }
}
