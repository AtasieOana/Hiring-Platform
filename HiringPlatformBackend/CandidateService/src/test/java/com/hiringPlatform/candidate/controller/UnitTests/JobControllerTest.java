package com.hiringPlatform.candidate.controller.UnitTests;

import com.hiringPlatform.candidate.controller.JobController;
import com.hiringPlatform.candidate.model.*;
import com.hiringPlatform.candidate.model.response.JobResponse;
import com.hiringPlatform.candidate.service.JobService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class JobControllerTest {

    @InjectMocks
    JobController jobController;

    @Mock
    JobService jobService;

    @Test
    public void testGetAllJobs(){
        // Given
        JobResponse jobResponse = buildJobResponse();
        ArrayList<JobResponse> jobResponses = new ArrayList<>();
        jobResponses.add(jobResponse);

        // When
        when(jobService.getAllJobs()).thenReturn(jobResponses);

        // Then
        ResponseEntity<List<JobResponse>> result = jobController.getAllJobs();
        assertEquals(result.getBody(), jobResponses);
        assertEquals(result.getStatusCode(), HttpStatus.OK);
    }

    @Test
    public void testGetAllJobsForEmployer(){
        // Given
        JobResponse jobResponse = buildJobResponse();
        ArrayList<JobResponse> jobResponses = new ArrayList<>();
        jobResponses.add(jobResponse);

        // When
        when(jobService.getAllJobsForEmployer(anyString())).thenReturn(jobResponses);

        // Then
        ResponseEntity<Number> result = jobController.getNrJobsForEmployer("1");
        assertEquals(result.getBody(), jobResponses.size());
        assertEquals(result.getStatusCode(), HttpStatus.OK);
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
