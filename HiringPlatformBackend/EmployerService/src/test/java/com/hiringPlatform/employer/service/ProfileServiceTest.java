package com.hiringPlatform.employer.service;

import com.hiringPlatform.employer.model.*;
import com.hiringPlatform.employer.model.request.CreateProfileRequest;
import com.hiringPlatform.employer.model.response.GetProfileResponse;
import com.hiringPlatform.employer.repository.EmployerRepository;
import com.hiringPlatform.employer.repository.ProfileRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.io.IOException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class ProfileServiceTest {

    @InjectMocks
    ProfileService profileService;
    @Mock
    ProfileRepository profileRepository;
    @Mock
    AddressService addressService;
    @Mock
    EmployerRepository employerRepository;

    @Test
    public void testHasEmployerProfileTrue() {
        // Given
        Profile profile = buildProfile();

        // When
        when(profileRepository.findByEmployerEmail(anyString())).thenReturn(Optional.of(profile));

        // Then
        Boolean result = profileService.hasEmployerProfile(profile.getEmployer().getUserDetails().getEmail());
        assertEquals(result, true);
    }

    @Test
    public void testHasEmployerProfileFalse() {
        // Given
        Profile profile = buildProfile();

        // When
        when(profileRepository.findByEmployerEmail(anyString())).thenReturn(Optional.empty());

        // Then
        Boolean result = profileService.hasEmployerProfile(profile.getEmployer().getUserDetails().getEmail());
        assertEquals(result, false);
    }

    @Test
    public void testAddEmployerProfile() throws IOException {
        // Given
        Profile profile = buildProfile();
        CreateProfileRequest createProfileRequest = getCreateProfileRequest();

        // When
        when(addressService.saveAddressIfNotExist(anyString(), anyString(), anyString(), anyString())).thenReturn(buildAddress());
        when(employerRepository.getById(anyString())).thenReturn(profile.getEmployer());
        when(profileRepository.save(any(Profile.class))).thenReturn(profile);

        // Then
        Profile result = profileService.addEmployerProfile(createProfileRequest);
        assertEquals(result, profile);
    }

    @Test
    public void testGetProfile(){
        // Given
        Profile profile = buildProfile();
        GetProfileResponse getProfileResponse = buildGetProfileResponse();

        // When
        when(profileRepository.findByEmployerEmail(anyString())).thenReturn(Optional.of(profile));

        // Then
        GetProfileResponse result = profileService.getProfile(profile.getEmployer().getUserDetails().getEmail());
        assertEquals(result, getProfileResponse);
    }

    @Test
    public void testGetProfileNotPresent(){
        // When
        when(profileRepository.findByEmployerEmail(anyString())).thenReturn(Optional.empty());

        // Then
        GetProfileResponse result = profileService.getProfile("test");
        assertNull(result);
    }

    @Test
    public void testUpdateEmployerProfile() throws IOException {
        // Given
        Profile profile = buildProfile();
        CreateProfileRequest createProfileRequest = getCreateProfileRequest();

        // When
        when(profileRepository.findByEmployerId(anyString())).thenReturn(Optional.of(profile));
        when(addressService.saveAddressIfNotExist(anyString(), anyString(), anyString(), anyString())).thenReturn(buildAddress());
        when(profileRepository.save(any(Profile.class))).thenReturn(profile);

        // Then
        Profile result = profileService.updateEmployerProfile(createProfileRequest);
        assertEquals(result, profile);
    }

    @Test
    public void testUpdateEmployerProfileNotPresent() throws IOException {
        // Given
        CreateProfileRequest createProfileRequest = getCreateProfileRequest();

        // When
        when(profileRepository.findByEmployerId(anyString())).thenReturn(Optional.empty());

        // Then
        Profile result = profileService.updateEmployerProfile(createProfileRequest);
        assertNull(result);
    }

    private CreateProfileRequest getCreateProfileRequest() {
        CreateProfileRequest createProfileRequest = new CreateProfileRequest();
        createProfileRequest.setImagine(null);
        createProfileRequest.setDescription("test");
        createProfileRequest.setPhone("0746119201");
        createProfileRequest.setSite("test");
        createProfileRequest.setSite("test");
        createProfileRequest.setStreet("streetTest");
        createProfileRequest.setZipCode("012345");
        createProfileRequest.setCityName("cityName");
        createProfileRequest.setRegionName("regionName");
        createProfileRequest.setEmployerId("1");
        return createProfileRequest;
    }

    private GetProfileResponse buildGetProfileResponse() {
        GetProfileResponse getProfileResponse = new GetProfileResponse();
        getProfileResponse.setImagine(null);
        getProfileResponse.setDescription("test");
        getProfileResponse.setPhone("0746119201");
        getProfileResponse.setSite("test");
        getProfileResponse.setSite("test");
        getProfileResponse.setStreet("streetTest");
        getProfileResponse.setZipCode("012345");
        getProfileResponse.setCityName("cityName");
        getProfileResponse.setRegionName("regionName");
        return getProfileResponse;
    }

    private Profile buildProfile(){
        Profile profile = new Profile();
        profile.setProfileId("1");
        profile.setImagine(null);
        profile.setDescription("test");
        profile.setPhone("0746119201");
        profile.setSite("test");
        profile.setAddress(buildAddress());
        profile.setEmployer(buildEmployer());
        return profile;
    }

    private Employer buildEmployer(){
        Employer employer = new Employer();
        User user = new User();
        user.setUserId("1");
        user.setEmail("test@example.com");
        user.setPassword("testPassword");
        Role role = new Role("1", "ROLE_EMPLOYER", "description");
        user.setUserRole(role);
        user.setAccountEnabled(1);
        employer.setUserDetails(user);
        employer.setCompanyName("test");
        employer.setEmployerId("1");
        return employer;
    }


    private Region buildRegion(){
        Region region = new Region();
        region.setRegionId("1");
        region.setRegionName("regionName");
        return region;
    }

    private City buildCity(){
        City city = new City();
        city.setCityName("1");
        city.setCityName("cityName");
        city.setRegion(buildRegion());
        return city;
    }

    private Address buildAddress(){
        Address address = new Address();
        address.setAddressId("1");
        address.setCity(buildCity());
        address.setStreet("streetTest");
        address.setZipCode("012345");
        return address;
    }
}
