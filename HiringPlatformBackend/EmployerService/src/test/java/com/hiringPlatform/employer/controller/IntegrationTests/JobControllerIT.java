package com.hiringPlatform.employer.controller.IntegrationTests;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hiringPlatform.employer.controller.JobController;
import com.hiringPlatform.employer.model.*;
import com.hiringPlatform.employer.model.request.AddJobRequest;
import com.hiringPlatform.employer.model.request.UpdateJobDescRequest;
import com.hiringPlatform.employer.model.response.JobResponse;
import com.hiringPlatform.employer.security.JwtService;
import com.hiringPlatform.employer.service.JobService;
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

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
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
    public void testAddJob() throws Exception {
        // Given
        Job job = buildJob();
        AddJobRequest addJobRequest = buildAddJobRequest();

        // When
        when(jobService.addJob(addJobRequest)).thenReturn(job);

        // Then
        mockMvc.perform(post("/addJob").contentType("application/json")
                        .content(objectMapper.writeValueAsString(addJobRequest)).with(csrf()))
                .andExpect(status().isOk())
                .andExpect(content().string(objectMapper.writeValueAsString(job)));
    }

    @Test
    public void testCloseJob() throws Exception {
        // When
        when(jobService.closeJob(anyString())).thenReturn(true);

        // Then
        mockMvc.perform(post("/closeJob/1").with(csrf()))
                .andExpect(status().isOk())
                .andExpect(content().string(objectMapper.writeValueAsString(true)));
    }


    @Test
    public void testGetAllOpenedJobsForEmployer() throws Exception {
        // Given
        JobResponse jobResponse = buildJobResponse();
        List<JobResponse> jobResponseList = new ArrayList<>();
        jobResponseList.add(jobResponse);

        // When
        when(jobService.getAllOpenedJobsForEmployer(anyString())).thenReturn(jobResponseList);

        // Then
        mockMvc.perform(get("/getNrJobsForEmployer/" + jobResponse.getEmployerId()))
                .andExpect(status().isOk())
                .andExpect(content().string(objectMapper.writeValueAsString(jobResponseList.size())));
    }

    @Test
    public void testGetAllJobsForEmployer() throws Exception {
        // Given
        JobResponse jobResponse = buildJobResponse();
        List<JobResponse> jobResponseList = new ArrayList<>();
        jobResponseList.add(jobResponse);

        // When
        when(jobService.getAllJobsForEmployer(anyString())).thenReturn(jobResponseList);

        // Then
        mockMvc.perform(get("/getAllJobsForEmployer/" + jobResponse.getEmployerId()))
                .andExpect(status().isOk())
                .andExpect(content().string(objectMapper.writeValueAsString(jobResponseList)));
    }

    @Test
    public void testUpdateJobDescription() throws Exception {
        // Given
        UpdateJobDescRequest request = new UpdateJobDescRequest("1", "newDesc");
        JobResponse jobResponse = buildJobResponse();
        jobResponse.setDescription("newDesc");

        // When
        when(jobService.updateJobDescription(anyString(), anyString())).thenReturn(jobResponse);

        // Then
        mockMvc.perform(post("/updateJobDescription").contentType("application/json")
                        .content(objectMapper.writeValueAsString(request)).with(csrf()))
                .andExpect(status().isOk())
                .andExpect(content().string(objectMapper.writeValueAsString(jobResponse)));
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
