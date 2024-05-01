package com.hiringPlatform.candidate.controller.UnitTests;


import com.hiringPlatform.candidate.controller.AnswerController;
import com.hiringPlatform.candidate.model.*;
import com.hiringPlatform.candidate.model.request.AnswerQuestionHelper;
import com.hiringPlatform.candidate.model.request.AnswerQuestionRequest;
import com.hiringPlatform.candidate.service.AnswerService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class AnswerControllerTest {

    @InjectMocks
    AnswerController answerController;
    @Mock
    AnswerService answerService;

    @Test
    public void testAddAnswersForQuestions() {
        // Given
        AnswerQuestionRequest request = buildAnswerQuestionRequest();
        Answer answer = buildAnswer();

        // When
        when(answerService.addAnswersForQuestions(request)).thenReturn(List.of(answer));

        // Then
        ResponseEntity<List<Answer>> result = answerController.addAnswersForQuestions(request);
        assertEquals(result.getBody(), List.of(answer));
        assertEquals(result.getStatusCode(), HttpStatus.OK);
    }

    private Question buildQuestion(){
        Question object = new Question();
        object.setQuestionId("1");
        object.setQuestionNumber(1);
        object.setQuestionText("test");
        object.setJob(buildJob());
        return object;
    }

    private Answer buildAnswer(){
        Answer object = new Answer();
        object.setAnswerId("1");
        object.setCandidate(buildCandidate());
        object.setAnswerText("test");
        object.setQuestion(buildQuestion());
        return object;
    }

    private AnswerQuestionRequest buildAnswerQuestionRequest(){
        AnswerQuestionRequest object = new AnswerQuestionRequest();
        object.setCandidateId("1");
        object.setJobId("1");
        object.setAnswerQuestionHelperList(buildAnswerQuestionHelperList());
        return object;
    }

    private AnswerQuestionHelper buildAnswerQuestionHelper(){
        AnswerQuestionHelper object = new AnswerQuestionHelper();
        object.setAnswer("text");
        object.setQuestionNumber(1);
        object.setQuestionText("text");
        return object;
    }

    private List<AnswerQuestionHelper> buildAnswerQuestionHelperList(){
        return List.of(buildAnswerQuestionHelper());
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
