package com.hiringPlatform.candidate.controller.IntegrationTests;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.hiringPlatform.candidate.controller.ChartController;
import com.hiringPlatform.candidate.model.*;
import com.hiringPlatform.candidate.security.JwtService;
import com.hiringPlatform.candidate.service.ChartService;
import com.hiringPlatform.candidate.service.RedisService;
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

import static org.mockito.ArgumentMatchers.anyString;
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
    public void testGetJobsPublishedPerDayInCurrentYear() throws Exception {
        Job job = buildJob();
        Map<String, Integer> jobCountMap = new HashMap<>();
        Instant instant = job.getPostingDate().toInstant();
        LocalDate localDate = instant.atZone(ZoneId.systemDefault()).toLocalDate();
        String formattedDate = localDate.toString();
        jobCountMap.put(formattedDate, 1);

        // When
        when(chartService.getJobsPublishedPerDayInCurrentYear()).thenReturn(jobCountMap);

        // Then
        mockMvc.perform(get("/getJobsPublishedPerDay"))
                .andExpect(status().isOk())
                .andExpect(content().string(objectMapper.writeValueAsString(jobCountMap)));
    }

    @Test
    public void testGetApplicationStatusNumbers() throws Exception {
        // Given
        Map<String, Integer> percentageMap = new HashMap<>();
        percentageMap.put("finalizat", 1);
        percentageMap.put("refuzat", 1);
        percentageMap.put("in_curs", 1);

        // When
        when(chartService.getApplicationStatusNumbers(anyString())).thenReturn(percentageMap);

        // Then
        mockMvc.perform(get("/getApplicationStatusNumbers/1"))
                .andExpect(status().isOk())
                .andExpect(content().string(objectMapper.writeValueAsString(percentageMap)));
    }

    @Test
    public void testGetApplicationViewedNumbers() throws Exception {
        // Given
        Map<String, Double> percentageMap = new HashMap<>();
        percentageMap.put("vazut", ((double) 1 / 2) * 100);
        percentageMap.put("nevazut", ((double) 1 / 2) * 100);

        // When
        when(chartService.getApplicationViewedNumbers(anyString())).thenReturn(percentageMap);

        // Then
        mockMvc.perform(get("/getApplicationViewedNumbers/1"))
                .andExpect(status().isOk())
                .andExpect(content().string(objectMapper.writeValueAsString(percentageMap)));
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
