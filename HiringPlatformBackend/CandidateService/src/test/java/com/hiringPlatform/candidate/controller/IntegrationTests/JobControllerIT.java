package com.hiringPlatform.candidate.controller.IntegrationTests;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hiringPlatform.candidate.controller.JobController;
import com.hiringPlatform.candidate.model.Employer;
import com.hiringPlatform.candidate.model.Role;
import com.hiringPlatform.candidate.model.User;
import com.hiringPlatform.candidate.model.response.JobResponse;
import com.hiringPlatform.candidate.security.JwtService;
import com.hiringPlatform.candidate.service.JobService;
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

import java.util.ArrayList;
import java.util.Date;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
@WebMvcTest(controllers = JobController.class)
@ContextConfiguration(classes = {JwtService.class, RedisService.class})
@WithMockUser
@ActiveProfiles("test")
@Import(JobController.class)
public class JobControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    JobService jobService;

    @MockBean
    JwtService jwtService;

    @MockBean
    RedisService redisService;

    @Test
    public void testGetAllJobs() throws Exception {
        // Given
        JobResponse jobResponse = buildJobResponse();
        ArrayList<JobResponse> jobResponses = new ArrayList<>();
        jobResponses.add(jobResponse);

        // When
        when(jobService.getAllJobs()).thenReturn(jobResponses);

        // Then
        mockMvc.perform(get("/getAllJobs"))
                .andExpect(status().isOk())
                .andExpect(content().string(objectMapper.writeValueAsString(jobResponses)));
    }

    @Test
    public void testGetAllJobsForEmployer() throws Exception {
        // Given
        JobResponse jobResponse = buildJobResponse();
        ArrayList<JobResponse> jobResponses = new ArrayList<>();
        jobResponses.add(jobResponse);

        // When
        when(jobService.getAllJobsForEmployer(anyString())).thenReturn(jobResponses);

        // Then
        mockMvc.perform(get("/getNrJobsForEmployer/1"))
                .andExpect(status().isOk())
                .andExpect(content().string(objectMapper.writeValueAsString(jobResponses.size())));
    }

    private JobResponse buildJobResponse(){
        JobResponse jobResponse = new JobResponse();
        jobResponse.setJobId("1");
        jobResponse.setTitle("test");
        jobResponse.setDescription("test");
        jobResponse.setContractType("test");
        jobResponse.setExperience("test");
        jobResponse.setPostingDate(new Date(2000));
        jobResponse.setIndustry("test");
        jobResponse.setCityName("cityName");
        jobResponse.setEmploymentRegime("test");
        jobResponse.setEmployer(buildEmployer());
        jobResponse.setRegionName("regionName");
        jobResponse.setStatus("deschis");
        jobResponse.setWorkMode("test");
        jobResponse.setQuestions(new ArrayList<>());
        jobResponse.setStages(new ArrayList<>());
        jobResponse.setEmployerProfile(null);
        return jobResponse;
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
