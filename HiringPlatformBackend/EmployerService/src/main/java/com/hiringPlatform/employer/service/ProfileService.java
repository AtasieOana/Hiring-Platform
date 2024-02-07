package com.hiringPlatform.employer.service;

import com.hiringPlatform.employer.model.Profile;
import com.hiringPlatform.employer.repository.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ProfileService {

    private final ProfileRepository profileRepository;

    @Autowired
    public ProfileService(ProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    /**
     * Method used for checking if an employer has a profile
     * @return boolean value
     */
    public Boolean hasEmployerProfile(String userEmail) {
        Optional<Profile> optionalProfile = profileRepository.findByEmployerEmail(userEmail);
        return  optionalProfile.isPresent();
    }


}
