package com.hiringPlatform.employer.controller.UnitTests;

import com.hiringPlatform.employer.controller.JobController;
import com.hiringPlatform.employer.model.*;
import com.hiringPlatform.employer.model.request.AddJobRequest;
import com.hiringPlatform.employer.model.request.UpdateJobDescRequest;
import com.hiringPlatform.employer.model.response.JobResponse;
import com.hiringPlatform.employer.service.JobService;
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
import java.util.Objects;

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
    public void testAddJob() {
        // Given
        Job job = buildJob();
        AddJobRequest addJobRequest = buildAddJobRequest();

        // When
        when(jobService.addJob(addJobRequest)).thenReturn(job);

        // Then
        ResponseEntity<Job> result = jobController.addJob(addJobRequest);
        assertEquals(Objects.requireNonNull(result.getBody()).getDescription(), job.getDescription());
        assertEquals(result.getBody().getStatus(), job.getStatus());
        assertEquals(result.getBody().getTitle(), job.getTitle());
        assertEquals(result.getStatusCode(), HttpStatus.OK);
    }

    @Test
    public void testCloseJob() {
        // When
        when(jobService.closeJob(anyString())).thenReturn(true);

        // Then
        ResponseEntity<Boolean> result = jobController.closeJob("1");
        assertEquals(result.getBody(), true);
        assertEquals(result.getStatusCode(), HttpStatus.OK);
    }


    @Test
    public void testGetAllOpenedJobsForEmployer() {
        // Given
        JobResponse jobResponse = buildJobResponse();
        List<JobResponse> jobResponseList = new ArrayList<>();
        jobResponseList.add(jobResponse);

        // When
        when(jobService.getAllOpenedJobsForEmployer(anyString())).thenReturn(jobResponseList);

        // Then
        ResponseEntity<Number> result = jobController.getNrJobsForEmployer("1");
        assertEquals(result.getBody(), 1);
        assertEquals(result.getStatusCode(), HttpStatus.OK);
    }

    @Test
    public void testGetAllJobsForEmployer() {
        // Given
        JobResponse jobResponse = buildJobResponse();
        List<JobResponse> jobResponseList = new ArrayList<>();
        jobResponseList.add(jobResponse);

        // When
        when(jobService.getAllJobsForEmployer(anyString())).thenReturn(jobResponseList);

        // Then
        ResponseEntity<List<JobResponse>> result = jobController.getAllJobsForEmployer("1");
        assertEquals(result.getBody(), jobResponseList);
        assertEquals(result.getStatusCode(), HttpStatus.OK);
    }

    @Test
    public void testUpdateJobDescription() {
        // Given
        UpdateJobDescRequest request = new UpdateJobDescRequest("1", "newDesc");
        JobResponse jobResponse = buildJobResponse();
        jobResponse.setDescription("newDesc");

        // When
        when(jobService.updateJobDescription(anyString(), anyString())).thenReturn(jobResponse);

        // Then
        ResponseEntity<JobResponse> result = jobController.updateJobDescription(request);
        assertEquals(result.getBody(), jobResponse);
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
