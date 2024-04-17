package com.hiringPlatform.candidate.service;

import com.hiringPlatform.candidate.model.Profile;
import com.hiringPlatform.candidate.model.response.GetProfileResponse;
import com.hiringPlatform.candidate.repository.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Base64;
import java.util.Optional;

@Service
public class ProfileService {

    private final ProfileRepository profileRepository;

    @Autowired
    public ProfileService(ProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    /**
     * Method used for getting a profile for an employer
     * @return the profile information
     */
    public GetProfileResponse getProfile(String email) {
        Optional<Profile> optionalProfile = profileRepository.findByEmployerEmail(email);
        if(optionalProfile.isPresent()){
            Profile profile = optionalProfile.get();
            GetProfileResponse getProfileResponse = new GetProfileResponse();
            if(profile.getImagine() != null){
                getProfileResponse.setImagine(Base64.getEncoder().encodeToString(profile.getImagine()));
            }
            else{
                getProfileResponse.setImagine(null);
            }
            getProfileResponse.setDescription(profile.getDescription());
            getProfileResponse.setPhone(profile.getPhone());
            getProfileResponse.setSite(profile.getSite());
            getProfileResponse.setStreet(profile.getAddress().getStreet());
            getProfileResponse.setZipCode(profile.getAddress().getZipCode());
            getProfileResponse.setCityName(profile.getAddress().getCity().getCityName());
            getProfileResponse.setRegionName(profile.getAddress().getCity().getRegion().getRegionName());
            return getProfileResponse;
        }
        else{
            return null;
        }
    }

}
