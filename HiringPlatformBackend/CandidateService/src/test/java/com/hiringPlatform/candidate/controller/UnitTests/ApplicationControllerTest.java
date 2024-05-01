package com.hiringPlatform.candidate.controller.UnitTests;


import com.hiringPlatform.candidate.controller.ApplicationController;
import com.hiringPlatform.candidate.model.*;
import com.hiringPlatform.candidate.model.key.ApplicationId;
import com.hiringPlatform.candidate.model.request.ApplyToJobRequest;
import com.hiringPlatform.candidate.model.request.QuestionHelperRequest;
import com.hiringPlatform.candidate.model.request.RefuseApplicationRequest;
import com.hiringPlatform.candidate.model.request.StageHelperRequest;
import com.hiringPlatform.candidate.model.response.ApplicationResponse;
import com.hiringPlatform.candidate.model.response.JobResponse;
import com.hiringPlatform.candidate.service.ApplicationService;
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
public class ApplicationControllerTest {

    @InjectMocks
    ApplicationController applicationController;
    @Mock
    ApplicationService applicationService;
    
    @Test
    public void testApplyToJob() {
        // Given
        Application application = buildApplication();
        ApplyToJobRequest request = new ApplyToJobRequest("1", "1", "1");
        // When
        when(applicationService.applyToJob(anyString(), anyString(), anyString())).thenReturn(application);

        // Then
        ResponseEntity<Application> result = applicationController.applyToJob(request);
        assertEquals(result.getBody(), application);
        assertEquals(result.getStatusCode(), HttpStatus.OK);
    }

    @Test
    public void testGetAllApps() {
        // Given
        List<ApplicationResponse> responses = List.of(buildAppResponse());

        // When
        when(applicationService.getAllApplicationsForCandidate(anyString())).thenReturn(responses);

        // Then
        ResponseEntity<List<ApplicationResponse>> result = applicationController.getAllApplicationsForCandidate("1");
        assertEquals(result.getBody(), responses);
        assertEquals(result.getStatusCode(), HttpStatus.OK);
    }

    @Test
    public void testRefuseApplication() {
        // Given
        RefuseApplicationRequest request = new RefuseApplicationRequest("1", "1", "reason");


        // When
        when(applicationService.refuseApplication(anyString(), anyString(), anyString())).thenReturn(true);

        // Then
        ResponseEntity<Boolean> result = applicationController.refuseApplication(request);
        assertEquals(result.getBody(), true);
        assertEquals(result.getStatusCode(), HttpStatus.OK);
    }

    @Test
    public void testCheckIfCandidateAppliedToJobTrue() {
        // When
        when(applicationService.checkIfCandidateAppliedToJob(anyString(), anyString())).thenReturn(true);

        // Then
        ResponseEntity<Boolean> result = applicationController.checkApplication("1", "1");
        assertEquals(result.getBody(), true);
        assertEquals(result.getStatusCode(), HttpStatus.OK);
    }


    private Application buildApplication(){
        Application object = new Application();
        ApplicationId applicationId = new ApplicationId();
        applicationId.setCandidate(buildCandidate());
        applicationId.setCv(buildCV());
        applicationId.setJob(buildJob());
        object.setApplicationId(applicationId);
        object.setStatus("test");
        object.setApplicationDate(new Date(2000));
        object.setRefusalReason("");
        object.setStage(buildStage());
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

    private CV buildCV(){
        CV cv = new CV();
        cv.setCandidate(buildCandidate());
        cv.setCvName("test");
        cv.setCvId("1");
        cv.setUploadDate(new Date(2000));
        return cv;
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

    private Stage buildStage(){
        return new Stage("1", "test");
    }

    private ApplicationResponse buildAppResponse(){
        ApplicationResponse object = new ApplicationResponse();
        object.setCvId("1");
        object.setCvName("test");
        object.setStatus("test");
        object.setAppDate(new Date(2000));
        object.setRefusalReason("");
        object.setCandidateLastname("test");
        object.setCandidateFirstname("test");
        object.setCandidateEmail("test@example.com");
        object.setEmployerEmail("test@example.com");
        object.setEmployerCompanyName("test");
        object.setJob(buildJobResponse());
        object.setStageNr(1);
        object.setStageName("test");
        object.setStatus("test");
        object.setAllStages(buildListStageHelperRequest());
        return object;
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
        jobResponse.setStatus("test");
        jobResponse.setWorkMode("test");
        jobResponse.setQuestions(buildListQuestionHelperRequest());
        jobResponse.setStages(buildListStageHelperRequest());
        return jobResponse;
    }

    private QuestionHelperRequest buildQuestionHelperRequest(){
        return new QuestionHelperRequest("test", 1);
    }

    private List<QuestionHelperRequest> buildListQuestionHelperRequest(){
        ArrayList<QuestionHelperRequest> requests = new ArrayList<>();
        requests.add(buildQuestionHelperRequest());
        return requests;
    }

    private StageHelperRequest buildStageHelperRequest(){
        return new StageHelperRequest("test", 1);
    }

    private List<StageHelperRequest> buildListStageHelperRequest(){
        ArrayList<StageHelperRequest> requests = new ArrayList<>();
        requests.add(buildStageHelperRequest());
        return requests;
    }

}
