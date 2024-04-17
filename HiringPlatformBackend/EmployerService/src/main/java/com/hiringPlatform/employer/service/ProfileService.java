package com.hiringPlatform.employer.service;

import com.hiringPlatform.employer.model.Address;
import com.hiringPlatform.employer.model.Employer;
import com.hiringPlatform.employer.model.Profile;
import com.hiringPlatform.employer.model.request.CreateProfileRequest;
import com.hiringPlatform.employer.model.response.EmployerResponse;
import com.hiringPlatform.employer.model.response.GetProfileResponse;
import com.hiringPlatform.employer.repository.EmployerRepository;
import com.hiringPlatform.employer.repository.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Base64;
import java.util.Optional;

@Service
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final AddressService addressService;
    private final EmployerRepository employerRepository;

    @Autowired
    public ProfileService(ProfileRepository profileRepository, AddressService addressService, EmployerRepository employerRepository) {
        this.profileRepository = profileRepository;
        this.addressService = addressService;
        this.employerRepository = employerRepository;
    }

    /**
     * Method used for checking if an employer has a profile
     * @return boolean value
     */
    public Boolean hasEmployerProfile(String userEmail) {
        Optional<Profile> optionalProfile = profileRepository.findByEmployerEmail(userEmail);
        return  optionalProfile.isPresent();
    }

    /**
     * Method used for adding a profile
     * @return the added profile
     */
    public Profile addEmployerProfile(CreateProfileRequest profileRequest) throws IOException {
        Profile profile = new Profile();
        // Save address if it not exists already
        Address address = addressService.saveAddressIfNotExist(profileRequest.getZipCode(),
                profileRequest.getStreet(), profileRequest.getCityName(), profileRequest.getRegionName());
        // Get image in bytes
        if(profileRequest.getImagine() != null){
            byte[] imageData = profileRequest.getImagine().getBytes();
            profile.setImagine(imageData);
        }
        else{
            profile.setImagine(null);
        }
        // Get employee by id
        Employer employer = employerRepository.getById(profileRequest.getEmployerId());
        // Setting the profile
        profile.setEmployer(employer);
        profile.setDescription(profileRequest.getDescription());
        profile.setPhone(profileRequest.getPhone());
        profile.setSite(profileRequest.getSite());
        profile.setAddress(address);
        return profileRepository.save(profile);
    }

    /**
     * Method used for getting a profile
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

    /**
     * Method used for updating a profile
     * @return the updated profile
     */
    public Profile updateEmployerProfile(CreateProfileRequest profileRequest) throws IOException {
        // Get profile by employer
        Optional<Profile> profile = profileRepository.findByEmployerId(profileRequest.getEmployerId());
        if(profile.isPresent()){
            // Save address if it not exists already
            Address address = addressService.saveAddressIfNotExist(profileRequest.getZipCode(),
                    profileRequest.getStreet(), profileRequest.getCityName(), profileRequest.getRegionName());
            Profile dbProfile = profile.get();
            dbProfile.setDescription(profileRequest.getDescription());
            dbProfile.setPhone(profileRequest.getPhone());
            dbProfile.setSite(profileRequest.getSite());
            dbProfile.setAddress(address);
            // Get image in bytes
            if(profileRequest.getImagine() != null){
                byte[] imageData = profileRequest.getImagine().getBytes();
                dbProfile.setImagine(imageData);
            }
            else{
                dbProfile.setImagine(null);
            }
            return profileRepository.save(dbProfile);
        }
        else{
            return null;
        }
    }

}
