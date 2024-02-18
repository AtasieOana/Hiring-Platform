package com.hiringPlatform.employer.service;

import com.hiringPlatform.employer.model.Address;
import com.hiringPlatform.employer.model.Employer;
import com.hiringPlatform.employer.model.Profile;
import com.hiringPlatform.employer.model.request.CreateProfileRequest;
import com.hiringPlatform.employer.repository.EmployerRepository;
import com.hiringPlatform.employer.repository.ProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
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
                profileRequest.getStreet(), profileRequest.getCityName(), profileRequest.getRegionName(),
                profileRequest.getCountryName());
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


}
