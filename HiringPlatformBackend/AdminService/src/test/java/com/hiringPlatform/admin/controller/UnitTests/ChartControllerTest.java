package com.hiringPlatform.admin.controller.UnitTests;


import com.hiringPlatform.admin.controller.ChartController;
import com.hiringPlatform.admin.model.*;
import com.hiringPlatform.admin.model.key.ApplicationId;
import com.hiringPlatform.admin.model.response.OverviewResponse;
import com.hiringPlatform.admin.service.ChartService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class ChartControllerTest {

    @InjectMocks
    ChartController chartController;

    @Mock
    ChartService chartService;

    @Test
    public void testGetJobCategoryDistribution() {
        Job job = buildJob();
        Map<String, Integer> distribution = new HashMap<>();
        distribution.put(job.getIndustry(), 1);

        // When
        when(chartService.getJobCategoryDistribution()).thenReturn(distribution);

        // Then
        ResponseEntity<Map<String, Integer>> result = chartController.getJobCategoryDistribution();
        assertEquals(result.getBody(), distribution);
        assertEquals(result.getStatusCode(), HttpStatus.OK);
    }

    @Test
    public void testGetApplicationStatusPercentage() {
        // Given
        Map<String, Integer> percentageMap = new HashMap<>();
        percentageMap.put("finalizat", 1);
        percentageMap.put("refuzat", 1);
        percentageMap.put("in_curs", 1);

        // When
        when(chartService.getApplicationStatusPercentage()).thenReturn(percentageMap);

        // Then
        ResponseEntity<Map<String, Integer>> result = chartController.getApplicationStatusPercentage();
        assertEquals(result.getBody(), percentageMap);
        assertEquals(result.getStatusCode(), HttpStatus.OK);
    }

    @Test
    public void testGetApplicationsPerDate() {
        Application application = buildApplication();
        Map<String, Integer> applicationsByDate = new HashMap<>();
        Instant instant = application.getApplicationDate().toInstant();
        LocalDate localDate = instant.atZone(ZoneId.systemDefault()).toLocalDate();
        String formattedDate = localDate.toString();
        applicationsByDate.put(formattedDate, 1);

        // When
        when(chartService.getApplicationsPerDate()).thenReturn(applicationsByDate);

        // Then
        ResponseEntity<Map<String, Integer>> result = chartController.getApplicationsPerDate();
        assertEquals(result.getBody(), applicationsByDate);
        assertEquals(result.getStatusCode(), HttpStatus.OK);
    }

    @Test
    public void testGetJobsExperiencePercentage() {
        // Given
        Map<String, Double> percentageMap = new HashMap<>();
        percentageMap.put("Junior", ((double) 1/3)*100);
        percentageMap.put("Intermediar", ((double) 1/3)*100);
        percentageMap.put("Entry-Level", ((double) 1/3)*100);

        // When
        when(chartService.getJobsExperiencePercentage()).thenReturn(percentageMap);

        // Then
        ResponseEntity<Map<String, Double>> result = chartController.getJobsExperiencePercentage();
        assertEquals(Objects.requireNonNull(result.getBody()).get("Junior"), percentageMap.get("Junior"));
        assertEquals(result.getBody().get("Intermediar"), percentageMap.get("Intermediar"));
        assertEquals(result.getBody().get("Entry-Level"), percentageMap.get("Entry-Level"));
        assertEquals(result.getStatusCode(), HttpStatus.OK);
    }

    @Test
    public void testGetAccountCreationTrend() {
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
        ResponseEntity<Map<String, Map<String, Long>>> result = chartController.getAccountCreationTrend();
        assertEquals(result.getBody(), response);
        assertEquals(result.getStatusCode(), HttpStatus.OK);
    }

    @Test
    public void testGetTopEmployersWithApplications() {
        // Given
        Map<String, Integer> response = new HashMap<>();
        response.put("Company A", 10);
        response.put("Company B", 8);
        response.put("Company C", 8);

        // When
        when(chartService.getTopEmployersWithApplications()).thenReturn(response);

        // Then
        ResponseEntity<Map<String, Integer>> result = chartController.getTopEmployersWithApplications();

        // Verify results
        assertEquals(3, Objects.requireNonNull(result.getBody()).size());
        assertEquals(10, result.getBody().get("Company A").intValue());
        assertEquals(8, result.getBody().get("Company B").intValue());
        assertEquals(8, result.getBody().get("Company C").intValue());
        assertEquals(result.getStatusCode(), HttpStatus.OK);
    }

    @Test
    public void testGetOverview() {
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
        ResponseEntity<OverviewResponse> result = chartController.getOverview();
        assertEquals(result.getBody(), overviewResponse);
        assertEquals(result.getStatusCode(), HttpStatus.OK);
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
