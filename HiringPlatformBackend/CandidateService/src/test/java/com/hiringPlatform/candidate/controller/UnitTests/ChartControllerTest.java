package com.hiringPlatform.candidate.controller.UnitTests;


import com.hiringPlatform.candidate.controller.ChartController;
import com.hiringPlatform.candidate.model.*;
import com.hiringPlatform.candidate.service.ChartService;
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
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class ChartControllerTest {

    @InjectMocks
    ChartController chartController;

    @Mock
    ChartService chartService;

    @Test
    public void testGetJobsPublishedPerDayInCurrentYear() {
        Job job = buildJob();
        Map<String, Integer> jobCountMap = new HashMap<>();
        Instant instant = job.getPostingDate().toInstant();
        LocalDate localDate = instant.atZone(ZoneId.systemDefault()).toLocalDate();
        String formattedDate = localDate.toString();
        jobCountMap.put(formattedDate, 1);

        // When
        when(chartService.getJobsPublishedPerDayInCurrentYear()).thenReturn(jobCountMap);

        // Then
        ResponseEntity<Map<String, Integer>> result = chartController.getJobsPublishedPerDay();
        assertEquals(result.getBody(), jobCountMap);
        assertEquals(result.getStatusCode(), HttpStatus.OK);
    }

    @Test
    public void testGetApplicationStatusNumbers() {
        // Given
        Map<String, Integer> percentageMap = new HashMap<>();
        percentageMap.put("finalizat", 1);
        percentageMap.put("refuzat", 1);
        percentageMap.put("in_curs", 1);

        // When
        when(chartService.getApplicationStatusNumbers(anyString())).thenReturn(percentageMap);

        // Then
        ResponseEntity<Map<String, Integer>> result = chartController.getApplicationStatusPercentage("1");
        assertEquals(result.getBody(), percentageMap);
        assertEquals(result.getStatusCode(), HttpStatus.OK);
    }

    @Test
    public void testGetApplicationViewedNumbers() {
        // Given
        Map<String, Double> percentageMap = new HashMap<>();
        percentageMap.put("vazut", ((double) 1 / 2) * 100);
        percentageMap.put("nevazut", ((double) 1 / 2) * 100);

        // When
        when(chartService.getApplicationViewedNumbers(anyString())).thenReturn(percentageMap);

        // Then
        ResponseEntity<Map<String, Double>> result = chartController.getApplicationViewedNumbers("1");
        assertEquals(result.getBody(), percentageMap);
        assertEquals(result.getStatusCode(), HttpStatus.OK);
    }

    private Job buildJob(){
        Job job = new Job();
        job.setJobId("1");
        job.setDescription("test");
        job.setTitle("test");
        job.setStatus("test");
        job.setContractType("test");
        job.setExperience("test");
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
