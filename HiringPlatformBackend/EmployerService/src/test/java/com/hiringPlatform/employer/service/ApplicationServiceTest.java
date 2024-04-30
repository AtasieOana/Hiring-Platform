package com.hiringPlatform.employer.service;

import com.hiringPlatform.employer.model.*;
import com.hiringPlatform.employer.model.key.ApplicationId;
import com.hiringPlatform.employer.model.key.ContainsId;
import com.hiringPlatform.employer.model.request.AnswerHelperRequest;
import com.hiringPlatform.employer.model.request.QuestionHelperRequest;
import com.hiringPlatform.employer.model.request.StageHelperRequest;
import com.hiringPlatform.employer.model.response.ApplicationResponse;
import com.hiringPlatform.employer.model.response.JobResponse;
import com.hiringPlatform.employer.repository.ApplicationRepository;
import com.hiringPlatform.employer.repository.JobRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ApplicationServiceTest {

    @InjectMocks
    ApplicationService applicationService;
    @Mock
    ApplicationRepository applicationRepository;
    @Mock
    JobRepository jobRepository;
    @Mock
    AnswerService answerService;
    @Mock
    StageService stageService;
    @Mock
    RestTemplate restTemplate;
    @Mock
    QuestionService questionService;

    @Test
    public void testGetAllApplicationsForJob() {
        // Given
        Application application = buildApplication();
        List<Application> applications = new ArrayList<>();
        applications.add(application);
        ApplicationResponse applicationResponse = buildAppResponse();
        List<ApplicationResponse> applicationResponses = new ArrayList<>();
        applicationResponses.add(applicationResponse);

        // When
        when(applicationRepository.findApplicationsForJob(anyString())).thenReturn(applications);
        when(questionService.getAllQuestionsForJob(anyString())).thenReturn(buildListQuestionHelperRequest());
        when(stageService.getAllStagesForJob(anyString())).thenReturn(buildListStageHelperRequest());
        when(stageService.getCurrentStageForApplication(anyString(), anyString())).thenReturn(buildContains());
        when(jobRepository.findById(anyString())).thenReturn(Optional.of(buildJob()));
        when(answerService.getAnswersForJobQuestions(anyString(), anyString())).thenReturn(buildListAnswerHelperRequest());

        // Then
        List<ApplicationResponse> result = applicationService.getAllApplicationsForJob("1");
        assertEquals(result, applicationResponses);
    }

    @Test
    public void testRefuseApplicationAfterJobClosing() {
        // Given
        Application application = buildApplication();
        List<Application> applications = new ArrayList<>();
        applications.add(application);

        // When
        when(applicationRepository.findApplicationsForJob(anyString())).thenReturn(applications);

        // Then
        applicationService.refuseApplicationAfterJobClosing("1");
        verify(applicationRepository, times(1)).findApplicationsForJob(anyString());
    }

    @Test
    public void testRefuseApplicationNotPresent() {
        // When
        when(applicationRepository.findByApplicationId(anyString(), anyString())).thenReturn(Optional.empty());

        // Then
        Boolean result = applicationService.refuseApplication("1", "1", "test");
        assertEquals(result, false);
    }

    @Test
    public void testRefuseApplicationPresent() {
        // Given
        Application application = buildApplication();

        // When
        when(applicationRepository.findByApplicationId(anyString(), anyString())).thenReturn(Optional.of(application));
        when(applicationRepository.save(any(Application.class))).thenReturn(application);

        // Then
        Boolean result = applicationService.refuseApplication("1", "1", "test");
        assertEquals(result, true);
    }

    @Test
    public void testSetNextStage() {
        // Given
        Application application = buildApplication();
        ApplicationResponse applicationResponse = buildAppResponse();
        applicationResponse.setStatus("finalizat");

        // When
        when(applicationRepository.findByApplicationId(anyString(), anyString())).thenReturn(Optional.of(application));
        when(stageService.getCurrentStageForApplication(anyString(), anyString())).thenReturn(buildContains());
        when(stageService.getAllContainsForJob(anyString())).thenReturn(buildContainsList());
        when(applicationRepository.save(any(Application.class))).thenReturn(application);
        when(stageService.getAllStagesForJob(anyString())).thenReturn(buildListStageHelperRequest());
        when(jobRepository.findById(anyString())).thenReturn(Optional.of(buildJob()));
        when(answerService.getAnswersForJobQuestions(anyString(), anyString())).thenReturn(buildListAnswerHelperRequest());
        when(questionService.getAllQuestionsForJob(anyString())).thenReturn(buildListQuestionHelperRequest());

        // Then
        ApplicationResponse result = applicationService.setNextStage("1", "1");
        assertEquals(result, applicationResponse);
    }

    @Test
    public void testSetNextStageUserNotPresent() {
        // When
        when(applicationRepository.findByApplicationId(anyString(), anyString())).thenReturn(Optional.empty());

        // Then
        ApplicationResponse result = applicationService.setNextStage("1", "1");
        assertNull(result);
    }

    private Contains buildContains(){
        Contains object = new Contains();
        ContainsId containsId = new ContainsId();
        containsId.setJob(buildJob());
        containsId.setStage(new Stage("1", "test"));
        object.setContainsId(containsId);
        object.setStageNr(1);
        return object;
    }

    private Contains buildContains2(){
        Contains object = new Contains();
        ContainsId containsId = new ContainsId();
        containsId.setJob(buildJob());
        containsId.setStage(new Stage("2", "test"));
        object.setContainsId(containsId);
        object.setStageNr(2);
        return object;
    }

    private Contains buildContains3(){
        Contains object = new Contains();
        ContainsId containsId = new ContainsId();
        containsId.setJob(buildJob());
        containsId.setStage(new Stage("3", "test"));
        object.setContainsId(containsId);
        object.setStageNr(3);
        return object;
    }

    private List<Contains> buildContainsList(){
        ArrayList<Contains> containsArrayList = new ArrayList<>();
        containsArrayList.add(buildContains());
        containsArrayList.add(buildContains2());
        containsArrayList.add(buildContains3());
        return containsArrayList;
    }

    private Application buildApplication(){
        Application object = new Application();
        ApplicationId applicationId = new ApplicationId();
        applicationId.setCandidate(buildCandidate());
        applicationId.setCv(new CV("1", "test", new Date(2000), buildCandidate()));
        applicationId.setJob(buildJob());
        object.setApplicationId(applicationId);
        object.setStatus("test");
        object.setApplicationDate(new Date(2000));
        object.setRefusalReason("");
        object.setStage(new Stage("1", "test"));
        return object;
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
