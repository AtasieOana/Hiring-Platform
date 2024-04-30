package com.hiringPlatform.employer.service;

import com.hiringPlatform.employer.model.Answer;
import com.hiringPlatform.employer.model.Candidate;
import com.hiringPlatform.employer.model.Job;
import com.hiringPlatform.employer.model.Question;
import com.hiringPlatform.employer.model.request.AnswerHelperRequest;
import com.hiringPlatform.employer.repository.AnswerRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class AnswerServiceTest {

    @InjectMocks
    AnswerService answerService;

    @Mock
    AnswerRepository answerRepository;

    @Test
    public void testGetAnswersForJobQuestions() {
        // Given
        Answer answer = buildAnswer();
        List<Answer> answers = new ArrayList<>();
        answers.add(answer);
        AnswerHelperRequest answerHelperRequest = buildAnswerHelperRequest();
        List<AnswerHelperRequest> answerHelperRequests = new ArrayList<>();
        answerHelperRequests.add(answerHelperRequest);

        // When
        when(answerRepository.findAnswersByJobAndCandidateId(anyString(), anyString())).thenReturn(answers);

        // Then
        List<AnswerHelperRequest> result = answerService.getAnswersForJobQuestions("1", "1");
        assertEquals(result, answerHelperRequests);
    }

    private Answer buildAnswer(){
        Answer object = new Answer();
        object.setAnswerId("1");
        object.setAnswerText("text");
        object.setCandidate(new Candidate());
        object.setQuestion(new Question("1", "text", 1, new Job()));
        return object;
    }

    private AnswerHelperRequest buildAnswerHelperRequest(){
        AnswerHelperRequest object = new AnswerHelperRequest();
        object.setAnswer("text");
        object.setQuestionNumber(1);
        object.setQuestionText("text");
        return object;
    }
}
