package com.hiringPlatform.employer.controller.IntegrationTests;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hiringPlatform.employer.controller.ApplicationController;
import com.hiringPlatform.employer.model.request.*;
import com.hiringPlatform.employer.model.response.ApplicationResponse;
import com.hiringPlatform.employer.model.response.JobResponse;
import com.hiringPlatform.employer.security.JwtService;
import com.hiringPlatform.employer.service.ApplicationService;
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
@WebMvcTest(controllers = ApplicationController.class)
@ContextConfiguration(classes = {JwtService.class, RedisService.class})
@WithMockUser
@ActiveProfiles("test")
@Import(ApplicationController.class)
public class ApplicationControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    ApplicationService applicationService;

    @MockBean
    JwtService jwtService;

    @MockBean
    RedisService redisService;

    @Test
    public void testGetAllApplicationsForJob() throws Exception {
        // Given
        ApplicationResponse applicationResponse = buildAppResponse();
        List<ApplicationResponse> applicationResponses = new ArrayList<>();
        applicationResponses.add(applicationResponse);

        // When
        when(applicationService.getAllApplicationsForJob(anyString())).thenReturn(applicationResponses);

        // Then
        mockMvc.perform(get("/getAllApplicationsForJob/" + applicationResponse.getJob().getJobId()))
                .andExpect(status().isOk())
                .andExpect(content().string(objectMapper.writeValueAsString(applicationResponses)));
    }

    @Test
    public void testRefuseApplication() throws Exception {
        // Given
        RefuseApplicationRequest request = new RefuseApplicationRequest();
        request.setCandidateId("1");
        request.setReason("test");
        request.setJobId("1");

        // When
        when(applicationService.refuseApplication(anyString(), anyString(), anyString())).thenReturn(true);

        // Then
        mockMvc.perform(post("/refuseApplication").contentType("application/json")
                        .content(objectMapper.writeValueAsString(request)).with(csrf()))
                .andExpect(status().isOk())
                .andExpect(content().string(objectMapper.writeValueAsString(true)));
    }

    @Test
    public void testSetNextStage() throws Exception {
        // Given
        ApplicationResponse applicationResponse = buildAppResponse();
        applicationResponse.setStatus("finalizat");
        UpdateApplicationRequest request = new UpdateApplicationRequest();
        request.setJobId("1");
        request.setCandidateId("1");

        // When
        when(applicationService.setNextStage(anyString(), anyString())).thenReturn(applicationResponse);

        // Then
        mockMvc.perform(post("/setNextStage").contentType("application/json")
                        .content(objectMapper.writeValueAsString(request)).with(csrf()))
                .andExpect(status().isOk())
                .andExpect(content().string(objectMapper.writeValueAsString(applicationResponse)));
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
