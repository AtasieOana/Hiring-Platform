package com.hiringPlatform.employer.controller.UnitTests;

import com.hiringPlatform.employer.controller.ProfileController;
import com.hiringPlatform.employer.model.*;
import com.hiringPlatform.employer.model.request.CreateProfileRequest;
import com.hiringPlatform.employer.model.response.GetProfileResponse;
import com.hiringPlatform.employer.service.ProfileService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.io.IOException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class ProfileControllerTest {

    @InjectMocks
    ProfileController profileController;
    @Mock
    ProfileService profileService;

    @Test
    public void testHasEmployerProfile() {
        // When
        when(profileService.hasEmployerProfile(anyString())).thenReturn(true);

        // Then
        ResponseEntity<Boolean> result = profileController.hasEmployerProfile("test");
        assertEquals(result.getBody(), true);
        assertEquals(result.getStatusCode(), HttpStatus.OK);
    }

    @Test
    public void testAddEmployerProfile() throws IOException {
        // Given
        Profile profile = buildProfile();
        CreateProfileRequest createProfileRequest = getCreateProfileRequest();

        // When
        when(profileService.addEmployerProfile(createProfileRequest)).thenReturn(profile);

        // Then
        ResponseEntity<String> result = profileController.addEmployerProfile(createProfileRequest);
        assertEquals(result.getBody(), profile.getProfileId());
        assertEquals(result.getStatusCode(), HttpStatus.OK);
    }

    @Test
    public void testGetProfile(){
        // Given
        Profile profile = buildProfile();
        GetProfileResponse getProfileResponse = buildGetProfileResponse();

        // When
        when(profileService.getProfile(anyString())).thenReturn(getProfileResponse);

        // Then
        ResponseEntity<GetProfileResponse> result = profileController.getProfile(profile.getEmployer().getUserDetails().getEmail());
        assertEquals(result.getBody(), getProfileResponse);
        assertEquals(result.getStatusCode(), HttpStatus.OK);
    }

    @Test
    public void testUpdateEmployerProfile() throws IOException {
        // Given
        Profile profile = buildProfile();
        CreateProfileRequest createProfileRequest = getCreateProfileRequest();

        // When
        when(profileService.updateEmployerProfile(createProfileRequest)).thenReturn(profile);

        // Then
        ResponseEntity<Profile> result = profileController.updateEmployerProfile(createProfileRequest);
        assertEquals(result.getBody(), profile);
        assertEquals(result.getStatusCode(), HttpStatus.OK);
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
