package com.hiringPlatform.employer.controller.UnitTests;

import com.hiringPlatform.employer.controller.ApplicationController;
import com.hiringPlatform.employer.model.request.*;
import com.hiringPlatform.employer.model.response.ApplicationResponse;
import com.hiringPlatform.employer.model.response.JobResponse;
import com.hiringPlatform.employer.service.ApplicationService;
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
    public void testGetAllApplicationsForJob() {
        // Given
        ApplicationResponse applicationResponse = buildAppResponse();
        List<ApplicationResponse> applicationResponses = new ArrayList<>();
        applicationResponses.add(applicationResponse);

        // When
        when(applicationService.getAllApplicationsForJob(anyString())).thenReturn(applicationResponses);

        // Then
        ResponseEntity<List<ApplicationResponse>> result = applicationController.getAllApplicationsForJob("1");
        assertEquals(result.getBody(), applicationResponses);
        assertEquals(result.getStatusCode(), HttpStatus.OK);
    }

    @Test
    public void testRefuseApplication() {
        // Given
        RefuseApplicationRequest request = new RefuseApplicationRequest();
        request.setCandidateId("1");
        request.setReason("test");
        request.setJobId("1");

        // When
        when(applicationService.refuseApplication(anyString(), anyString(), anyString())).thenReturn(true);

        // Then
        ResponseEntity<Boolean> result = applicationController.refuseApplication(request);
        assertEquals(result.getBody(), true);
        assertEquals(result.getStatusCode(), HttpStatus.OK);
    }

    @Test
    public void testSetNextStage() {
        // Given
        ApplicationResponse applicationResponse = buildAppResponse();
        applicationResponse.setStatus("finalizat");
        UpdateApplicationRequest request = new UpdateApplicationRequest();
        request.setJobId("1");
        request.setCandidateId("1");

        // When
        when(applicationService.setNextStage(anyString(), anyString())).thenReturn(applicationResponse);

        // Then
        ResponseEntity<ApplicationResponse> result = applicationController.setNextStage(request);
        assertEquals(result.getBody(), applicationResponse);
        assertEquals(result.getStatusCode(), HttpStatus.OK);
    }

    private ApplicationResponse buildAppResponse(){
        ApplicationResponse object = new ApplicationResponse();
        object.setCvId("1");
        object.setCvName("test");
        object.setStatus("test");
        object.setAppDate(new Date(2000));
        object.setRefusalReason("");
        object.setCandidateId("1");
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
        object.setAllAnswers(buildListAnswerHelperRequest());
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
        jobResponse.setEmployerId("1");
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

    private AnswerHelperRequest buildAnswerHelperRequest(){
        return new AnswerHelperRequest("test", 1, "test");
    }

    private List<AnswerHelperRequest> buildListAnswerHelperRequest(){
        ArrayList<AnswerHelperRequest> requests = new ArrayList<>();
        requests.add(buildAnswerHelperRequest());
        return requests;
    }
}
