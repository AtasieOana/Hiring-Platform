package com.hiringPlatform.employer.service;

import com.hiringPlatform.employer.exception.EmployerNotFoundException;
import com.hiringPlatform.employer.exception.JobNotFoundException;
import com.hiringPlatform.employer.model.*;
import com.hiringPlatform.employer.model.request.AddJobRequest;
import com.hiringPlatform.employer.model.response.JobResponse;
import com.hiringPlatform.employer.repository.EmployerRepository;
import com.hiringPlatform.employer.repository.JobRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class JobServiceTest {

    @InjectMocks
    JobService jobService;

    @Mock
    JobRepository jobRepository;

    @Mock
    EmployerRepository employerRepository;

    @Mock
    AddressService addressService;

    @Mock
    StageService stageService;

    @Mock
    QuestionService questionService;

    @Mock
    ApplicationService applicationService;

    @Test
    public void testAddJob() {
        // Given
        Employer employer = buildEmployer();
        Job job = buildJob();
        AddJobRequest addJobRequest = buildAddJobRequest();

        // When
        when(employerRepository.findById(anyString())).thenReturn(Optional.of(employer));
        when(addressService.getCity(anyString(), anyString())).thenReturn(buildCity());
        when(jobRepository.save(any(Job.class))).thenReturn(job);

        // Then
        Job result = jobService.addJob(addJobRequest);
        assertEquals(result.getDescription(), job.getDescription());
        assertEquals(result.getStatus(), job.getStatus());
        assertEquals(result.getTitle(), job.getTitle());
    }

    @Test
    public void testAddJobEmployerNotPresent() {
        // Given
        AddJobRequest addJobRequest = buildAddJobRequest();

        // When
        when(employerRepository.findById(anyString())).thenReturn(Optional.empty());

        // Then
        EmployerNotFoundException employerNotFoundException = assertThrows(EmployerNotFoundException.class, () -> jobService.addJob(addJobRequest));
        assertEquals("Employer was not found in database", employerNotFoundException.getMessage());
    }

    @Test
    public void testCloseJob() {
        // Given
        Job job = buildJob();

        // When
        when(jobRepository.findById(anyString())).thenReturn(Optional.of(job));
        when(jobRepository.save(any(Job.class))).thenReturn(job);

        // Then
        Boolean result = jobService.closeJob("1");
        assertEquals(result, true);
    }

    @Test
    public void testCloseJobNotFound() {
        // When
        when(jobRepository.findById(anyString())).thenReturn(Optional.empty());

        // Then
        JobNotFoundException jobNotFoundException = assertThrows(JobNotFoundException.class, () -> jobService.closeJob("1"));
        assertEquals("Job was not found in database", jobNotFoundException.getMessage());
    }

    @Test
    public void testGetAllOpenedJobsForEmployer() {
        // Given
        Job job = buildJob();
        List<Job> jobs = new ArrayList<>();
        jobs.add(job);
        JobResponse jobResponse = buildJobResponse();
        List<JobResponse> jobResponseList = new ArrayList<>();
        jobResponseList.add(jobResponse);

        // When
        when(jobRepository.findOpenedJobByEmployer(anyString())).thenReturn(jobs);
        when(questionService.getAllQuestionsForJob(anyString())).thenReturn(new ArrayList<>());
        when(stageService.getAllStagesForJob(anyString())).thenReturn(new ArrayList<>());

        // Then
        List<JobResponse> result = jobService.getAllOpenedJobsForEmployer("1");
        assertEquals(result, jobResponseList);
    }

    @Test
    public void testGetAllJobsForEmployer() {
        // Given
        Job job = buildJob();
        List<Job> jobs = new ArrayList<>();
        jobs.add(job);
        JobResponse jobResponse = buildJobResponse();
        List<JobResponse> jobResponseList = new ArrayList<>();
        jobResponseList.add(jobResponse);

        // When
        when(jobRepository.findByJobEmployer(anyString())).thenReturn(jobs);
        when(questionService.getAllQuestionsForJob(anyString())).thenReturn(new ArrayList<>());
        when(stageService.getAllStagesForJob(anyString())).thenReturn(new ArrayList<>());

        // Then
        List<JobResponse> result = jobService.getAllJobsForEmployer("1");
        assertEquals(result, jobResponseList);
    }

    @Test
    public void testUpdateJobDescription() {
        // Given
        Job job = buildJob();
        JobResponse jobResponse = buildJobResponse();
        jobResponse.setDescription("newDesc");

        // When
        when(jobRepository.findById(anyString())).thenReturn(Optional.of(job));
        when(jobRepository.save(any(Job.class))).thenReturn(job);

        // Then
        JobResponse result = jobService.updateJobDescription("1", "newDesc");
        assertEquals(result, jobResponse);
    }

    @Test
    public void testUpdateJobDescriptionNotFound() {
        // When
        when(jobRepository.findById(anyString())).thenReturn(Optional.empty());

        // Then
        JobNotFoundException jobNotFoundException = assertThrows(JobNotFoundException.class, () -> jobService.updateJobDescription("1", "newDesc"));
        assertEquals("Job was not found in database", jobNotFoundException.getMessage());
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
        jobResponse.setEmployerId("1");
        jobResponse.setRegionName("regionName");
        jobResponse.setStatus("deschis");
        jobResponse.setWorkMode("test");
        jobResponse.setQuestions(new ArrayList<>());
        jobResponse.setStages(new ArrayList<>());
        return jobResponse;
    }

    private AddJobRequest buildAddJobRequest(){
        AddJobRequest request = new AddJobRequest();
        request.setTitle("test");
        request.setDescription("test");
        request.setContractType("test");
        request.setExperience("test");
        request.setIndustry("test");
        request.setEmploymentRegime("test");
        request.setWorkMode("test");
        request.setQuestions(new ArrayList<>());
        request.setStages(new ArrayList<>());
        request.setEmployerId("1");
        request.setCityName("cityName");
        request.setRegionName("regionName");
        return request;
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
