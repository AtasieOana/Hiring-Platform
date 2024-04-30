package com.hiringPlatform.candidate.service;

import com.hiringPlatform.candidate.model.*;
import com.hiringPlatform.candidate.model.response.GetProfileResponse;
import com.hiringPlatform.candidate.repository.ProfileRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class ProfileServiceTest {

    @InjectMocks
    ProfileService profileService;
    @Mock
    ProfileRepository profileRepository;


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
