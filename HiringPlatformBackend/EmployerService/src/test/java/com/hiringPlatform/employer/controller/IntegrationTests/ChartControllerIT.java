package com.hiringPlatform.employer.controller.IntegrationTests;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hiringPlatform.employer.controller.ChartController;
import com.hiringPlatform.employer.model.*;
import com.hiringPlatform.employer.model.key.ApplicationId;
import com.hiringPlatform.employer.security.JwtService;
import com.hiringPlatform.employer.service.ChartService;
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
    public void testGetApplicationsPerDayByEmployer() throws Exception {
        // Given
        Application application = buildApplication();
        Map<String, Integer> appCountMap = new HashMap<>();
        Instant instant = application.getApplicationDate().toInstant();
        LocalDate localDate = instant.atZone(ZoneId.systemDefault()).toLocalDate();
        String formattedDate = localDate.toString();
        appCountMap.put(formattedDate, 1);

        // When
        when(chartService.getApplicationsPerDayByEmployer(anyString())).thenReturn(appCountMap);

        // Then
        mockMvc.perform(get("/getAppsPerDayByEmployer/" + application.getJob().getEmployer().getEmployerId()))
                .andExpect(status().isOk())
                .andExpect(content().string(objectMapper.writeValueAsString(appCountMap)));
    }

    @Test
    public void testGetApplicationsPerJobByEmployer() throws Exception {
        // Given
        Application application = buildApplication();
        Map<String, Integer> appCountMap = new HashMap<>();
        appCountMap.put(application.getJob().getTitle(), 1);

        // When
        when(chartService.getApplicationsPerJobByEmployer(anyString())).thenReturn(appCountMap);

        // Then
        mockMvc.perform(get("/getAppsPerJobByEmployer/" + application.getJob().getEmployer().getEmployerId()))
                .andExpect(status().isOk())
                .andExpect(content().string(objectMapper.writeValueAsString(appCountMap)));
    }

    @Test
    public void testGetApplicationStatusNumbers() throws Exception {
        // Given
        Map<String, Double> percentageMap = new HashMap<>();
        percentageMap.put("finalizat", ((double) 0) * 100);
        percentageMap.put("refuzat", ((double) 0) * 100);
        percentageMap.put("in_curs", ((double) 1) * 100);

        // When
        when(chartService.getApplicationStatusNumbers(anyString())).thenReturn(percentageMap);

        // Then
        mockMvc.perform(get("/getAppsStatusNumbers/1"))
                .andExpect(status().isOk())
                .andExpect(content().string(objectMapper.writeValueAsString(percentageMap)));
    }

    private Application buildApplication(){
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
