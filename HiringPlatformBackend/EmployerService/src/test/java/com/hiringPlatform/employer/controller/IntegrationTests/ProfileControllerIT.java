package com.hiringPlatform.employer.controller.IntegrationTests;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hiringPlatform.employer.controller.ProfileController;
import com.hiringPlatform.employer.model.*;
import com.hiringPlatform.employer.model.request.CreateProfileRequest;
import com.hiringPlatform.employer.model.response.GetProfileResponse;
import com.hiringPlatform.employer.security.JwtService;
import com.hiringPlatform.employer.service.ProfileService;
import com.hiringPlatform.employer.service.RedisService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
@WebMvcTest(controllers = ProfileController.class)
@ContextConfiguration(classes = {JwtService.class, RedisService.class})
@WithMockUser
@ActiveProfiles("test")
@Import(ProfileController.class)
public class ProfileControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    ProfileService profileService;

    @MockBean
    JwtService jwtService;

    @MockBean
    RedisService redisService;

    @Test
    public void testHasEmployerProfile() throws Exception {
        // When
        when(profileService.hasEmployerProfile(anyString())).thenReturn(true);

        // Then
        mockMvc.perform(get("/hasEmployerProfile/email"))
                .andExpect(status().isOk())
                .andExpect(content().string(objectMapper.writeValueAsString(true)));
    }

    @Test
    public void testAddEmployerProfile() throws Exception {
        // Given
        Profile profile = buildProfile();
        CreateProfileRequest createProfileRequest = getCreateProfileRequest();

        // When
        when(profileService.addEmployerProfile(any(CreateProfileRequest.class))).thenReturn(profile);

        // Then
        mockMvc.perform(post("/addEmployerProfile").contentType("application/json")
                        .content(objectMapper.writeValueAsString(createProfileRequest)).with(csrf()))
                .andExpect(status().isOk())
                .andExpect(content().string(profile.getEmployer().getEmployerId()));
    }

    @Test
    public void testGetProfile() throws Exception {
        // Given
        Profile profile = buildProfile();
        GetProfileResponse getProfileResponse = buildGetProfileResponse();

        // When
        when(profileService.getProfile(anyString())).thenReturn(getProfileResponse);

        // Then
        mockMvc.perform(get("/getProfile/" + profile.getEmployer().getEmployerId()))
                .andExpect(status().isOk())
                .andExpect(content().string(objectMapper.writeValueAsString(getProfileResponse)));
    }

    @Test
    public void testUpdateEmployerProfile() throws Exception {
        // Given
        Profile profile = buildProfile();
        CreateProfileRequest createProfileRequest = getCreateProfileRequest();

        // When
        when(profileService.updateEmployerProfile(any(CreateProfileRequest.class))).thenReturn(profile);

        // Then
        mockMvc.perform(post("/updateEmployerProfile").contentType("application/json")
                        .content(objectMapper.writeValueAsString(createProfileRequest)).with(csrf()))
                .andExpect(status().isOk())
                .andExpect(content().string(objectMapper.writeValueAsString(profile)));
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
