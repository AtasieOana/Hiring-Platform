package com.hiringPlatform.admin.controller.IntegrationTests;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.hiringPlatform.admin.controller.ChartController;
import com.hiringPlatform.admin.model.*;
import com.hiringPlatform.admin.model.key.ApplicationId;
import com.hiringPlatform.admin.model.response.OverviewResponse;
import com.hiringPlatform.admin.security.JwtService;
import com.hiringPlatform.admin.service.ChartService;
import com.hiringPlatform.admin.service.RedisService;
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

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
@WebMvcTest(controllers = ChartController.class)
@ContextConfiguration(classes = {JwtService.class, RedisService.class})
@WithMockUser
@ActiveProfiles("test")
@Import(ChartController.class)
public class ChartControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    ChartService chartService;

    @MockBean
    JwtService jwtService;

    @MockBean
    RedisService redisService;

    @Test
    public void testGetJobCategoryDistribution() throws Exception {
        Job job = buildJob();
        Map<String, Integer> distribution = new HashMap<>();
        distribution.put(job.getIndustry(), 1);

        // When
        when(chartService.getJobCategoryDistribution()).thenReturn(distribution);

        // Then
        mockMvc.perform(get("/getJobCategoryDistribution"))
                .andExpect(status().isOk())
                .andExpect(content().string(objectMapper.writeValueAsString(distribution)));
    }

    @Test
    public void testGetApplicationStatusPercentage() throws Exception {
        // Given
        Map<String, Integer> percentageMap = new HashMap<>();
        percentageMap.put("finalizat", 1);
        percentageMap.put("refuzat", 1);
        percentageMap.put("in_curs", 1);

        // When
        when(chartService.getApplicationStatusPercentage()).thenReturn(percentageMap);

        // Then
        mockMvc.perform(get("/getApplicationStatusPercentage"))
                .andExpect(status().isOk())
                .andExpect(content().string(objectMapper.writeValueAsString(percentageMap)));
    }

    @Test
    public void testGetApplicationsPerDate() throws Exception {
        Application application = buildApplication();
        Map<String, Integer> applicationsByDate = new HashMap<>();
        Instant instant = application.getApplicationDate().toInstant();
        LocalDate localDate = instant.atZone(ZoneId.systemDefault()).toLocalDate();
        String formattedDate = localDate.toString();
        applicationsByDate.put(formattedDate, 1);

        // When
        when(chartService.getApplicationsPerDate()).thenReturn(applicationsByDate);

        // Then
        mockMvc.perform(get("/getApplicationsPerDate"))
                .andExpect(status().isOk())
                .andExpect(content().string(objectMapper.writeValueAsString(applicationsByDate)));
    }

    @Test
    public void testGetJobsExperiencePercentage() throws Exception {
        // Given
        Map<String, Double> percentageMap = new HashMap<>();
        percentageMap.put("Junior", ((double) 1/3)*100);
        percentageMap.put("Intermediar", ((double) 1/3)*100);
        percentageMap.put("Entry-Level", ((double) 1/3)*100);

        // When
        when(chartService.getJobsExperiencePercentage()).thenReturn(percentageMap);

        // Then
        mockMvc.perform(get("/getJobsExperiencePercentage"))
                .andExpect(status().isOk())
                .andExpect(content().string(objectMapper.writeValueAsString(percentageMap)));
    }

    @Test
    public void testGetAccountCreationTrend() throws Exception {
        // Given
        User user = buildCandidate().getUserDetails();
        Map<String, Map<String, Long>> response = new HashMap<>();
        Map<String, Long> responseValue = new HashMap<>();
        LocalDate registrationDate = user.getRegistrationDate().toInstant()
                .atZone(ZoneId.systemDefault()).toLocalDate();
        String formattedDate = registrationDate.toString();
        responseValue.put(formattedDate, 1L);
        response.put("ROLE_CANDIDATE", responseValue);

        // When
        when(chartService.getAccountCreationTrend()).thenReturn(response);

        // Then
        mockMvc.perform(get("/getAccountCreationTrend"))
                .andExpect(status().isOk())
                .andExpect(content().string(objectMapper.writeValueAsString(response)));
    }

    @Test
    public void testGetTopEmployersWithApplications() throws Exception {
        // Given
        Map<String, Integer> response = new HashMap<>();
        response.put("Company A", 10);
        response.put("Company B", 8);
        response.put("Company C", 8);

        // When
        when(chartService.getTopEmployersWithApplications()).thenReturn(response);

        // Verify results
        mockMvc.perform(get("/getTopEmployersWithApplications"))
                .andExpect(status().isOk())
                .andExpect(content().string(objectMapper.writeValueAsString(response)));
    }

    @Test
    public void testGetOverview() throws Exception {
        // Given
        OverviewResponse overviewResponse = new OverviewResponse();
        overviewResponse.setNumberOfJobs(1);
        overviewResponse.setNumberOfEmployers(1);
        overviewResponse.setNumberOfCandidates(1);
        overviewResponse.setNumberOfAdmins(0);
        overviewResponse.setNumberOfApplications(1);

        // When
        when(chartService.getOverview()).thenReturn(overviewResponse);

        // Then
        mockMvc.perform(get("/getOverview"))
                .andExpect(status().isOk())
                .andExpect(content().string(objectMapper.writeValueAsString(overviewResponse)));
    }

    private Application buildApplication() {
        Application object = new Application();
        ApplicationId applicationId = new ApplicationId();
        applicationId.setCandidate(buildCandidate());
        applicationId.setCv(new CV("1", "test", new Date(2000), buildCandidate()));
        applicationId.setJob(buildJob());
        object.setApplicationId(applicationId);
        object.setStatus("in_curs");
        object.setApplicationDate(new Date(2000));
        object.setRefusalReason("");
        object.setStage(new Stage("1", "test"));
        return object;
    }

    private Candidate buildCandidate(){
        Candidate candidate = new Candidate();
        User user = new User();
        user.setUserId("1");
        user.setEmail("test@example.com");
        user.setPassword("testPassword");
        user.setRegistrationDate(new Date(2000));
        Role role = new Role("1", "ROLE_CANDIDATE", "description");
        user.setUserRole(role);
        String lastname = "test";
        String firstname = "test";
        candidate.setUserDetails(user);
        candidate.setFirstname(firstname);
        candidate.setLastname(lastname);
        candidate.setCandidateId("1");
        return candidate;
    }

    private Job buildJob(){
        Job job = new Job();
        job.setJobId("1");
        job.setDescription("test");
        job.setTitle("test");
        job.setContractType("test");
        job.setExperience("Entry-Level");
        job.setPostingDate(new Date(2000));
        job.setIndustry("test");
        job.setEmploymentRegime("test");
        job.setWorkMode("test");
        job.setCity(buildCity());
        job.setEmployer(buildEmployer());
        return job;
    }

    private Region buildRegion(){
        Region region = new Region();
        region.setRegionId("1");
        region.setRegionName("regionName");
        return region;
    }

    private City buildCity(){
        City city = new City();
        city.setCityId("1");
        city.setCityName("cityName");
        city.setRegion(buildRegion());
        return city;
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
}
