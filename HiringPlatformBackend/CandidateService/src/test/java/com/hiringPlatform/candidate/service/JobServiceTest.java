package com.hiringPlatform.candidate.service;

import com.hiringPlatform.candidate.model.*;
import com.hiringPlatform.candidate.model.response.JobResponse;
import com.hiringPlatform.candidate.repository.JobRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class JobServiceTest {

    @InjectMocks
    JobService jobService;

    @Mock
    JobRepository jobRepository;

    @Mock
    ProfileService profileService;

    @Mock
    StageService stageService;

    @Mock
    QuestionService questionService;

    @Test
    public void testGetAllJobs(){
        // Given
        Job job = buildJob();
        ArrayList<Job> jobs = new ArrayList<>();
        jobs.add(job);
        JobResponse jobResponse = buildJobResponse();
        ArrayList<JobResponse> jobResponses = new ArrayList<>();
        jobResponses.add(jobResponse);

        // When
        when(jobRepository.findAllJobsOrderByDate()).thenReturn(jobs);
        when(profileService.getProfile(anyString())).thenReturn(jobResponse.getEmployerProfile());
        when(questionService.getAllQuestionsForJob(anyString())).thenReturn(jobResponse.getQuestions());
        when(stageService.getAllStagesForJob(anyString())).thenReturn(jobResponse.getStages());

        // Then
        List<JobResponse> result = jobService.getAllJobs();
        assertEquals(result, jobResponses);
    }

    @Test
    public void testGetAllJobsForEmployer(){
        // Given
        Job job = buildJob();
        ArrayList<Job> jobs = new ArrayList<>();
        jobs.add(job);
        JobResponse jobResponse = buildJobResponse();
        ArrayList<JobResponse> jobResponses = new ArrayList<>();
        jobResponses.add(jobResponse);

        // When
        when(jobRepository.findByJobEmployer(anyString())).thenReturn(jobs);
        when(profileService.getProfile(anyString())).thenReturn(jobResponse.getEmployerProfile());
        when(questionService.getAllQuestionsForJob(anyString())).thenReturn(jobResponse.getQuestions());
        when(stageService.getAllStagesForJob(anyString())).thenReturn(jobResponse.getStages());

        // Then
        List<JobResponse> result = jobService.getAllJobsForEmployer("1");
        assertEquals(result, jobResponses);
    }

    @Test
    public void testGetJob(){
        // Given
        Job job = buildJob();

        // When
        when(jobRepository.findById(anyString())).thenReturn(Optional.of(job));

        // Then
        Job result = jobService.getJob("1");
        assertEquals(result, job);
    }

    @Test
    public void testGetJobNotPresent(){
        // When
        when(jobRepository.findById(anyString())).thenReturn(Optional.empty());

        // Then
        Job result = jobService.getJob("1");
        assertNull(result);
    }

    @Test
    public void testGetJobResponse(){
        // Given
        Job job = buildJob();
        JobResponse jobResponse = buildJobResponse();

        // When
        when(jobRepository.findById(anyString())).thenReturn(Optional.of(job));
        when(profileService.getProfile(anyString())).thenReturn(jobResponse.getEmployerProfile());
        when(questionService.getAllQuestionsForJob(anyString())).thenReturn(jobResponse.getQuestions());
        when(stageService.getAllStagesForJob(anyString())).thenReturn(jobResponse.getStages());

        // Then
        JobResponse result = jobService.getJobResponse("1");
        assertEquals(result, jobResponse);
    }

    @Test
    public void testGetJobResponseNotPresent(){
        // When
        when(jobRepository.findById(anyString())).thenReturn(Optional.empty());

        // Then
        JobResponse result = jobService.getJobResponse("1");
        assertNull(result);
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

    private Job buildJob(){
        Job job = new Job();
        job.setJobId("1");
        job.setDescription("test");
        job.setTitle("test");
        job.setStatus("deschis");
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
