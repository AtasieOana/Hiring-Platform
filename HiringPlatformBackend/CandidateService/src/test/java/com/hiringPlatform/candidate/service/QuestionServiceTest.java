package com.hiringPlatform.candidate.service;

import com.hiringPlatform.candidate.model.Job;
import com.hiringPlatform.candidate.model.Question;
import com.hiringPlatform.candidate.model.request.QuestionHelperRequest;
import com.hiringPlatform.candidate.repository.QuestionRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class QuestionServiceTest {

    @InjectMocks
    QuestionService questionService;

    @Mock
    QuestionRepository questionRepository;

    @Test
    public void testGetAllQuestionsForJob() {
        // Given
        Question question = buildQuestion();
        List<Question> questions = new ArrayList<>();
        questions.add(question);
        QuestionHelperRequest questionHelperRequest = buildQuestionHelperRequest();
        List<QuestionHelperRequest> questionHelperRequests = new ArrayList<>();
        questionHelperRequests.add(questionHelperRequest);

        // When
        when(questionRepository.findAllByJobId(anyString())).thenReturn(questions);

        // Then
        List<QuestionHelperRequest> result = questionService.getAllQuestionsForJob("1");
        assertEquals(result, questionHelperRequests);
    }

    @Test
    public void testGetQuestionByJobIdAndNumber() {
        // Given
        Question question = buildQuestion();

        // When
        when(questionRepository.findByJobIdAndQuestionNumber(anyString(), anyInt())).thenReturn(Optional.of(question));

        // Then
        Question result = questionService.getQuestionByJobIdAndNumber("1", 1);
        assertEquals(result, question);
    }

    @Test
    public void testGetQuestionByJobIdAndNumberNotPresent() {
        // When
        when(questionRepository.findByJobIdAndQuestionNumber(anyString(), anyInt())).thenReturn(Optional.empty());

        // Then
        Question result = questionService.getQuestionByJobIdAndNumber("1", 1);
        assertNull(result);
    }

    private Question buildQuestion(){
        Question question = new Question();
        question.setQuestionText("test");
        question.setQuestionNumber(1);
        question.setQuestionId("1");
        question.setJob(new Job());
        return question;
    }

    private QuestionHelperRequest buildQuestionHelperRequest(){
        QuestionHelperRequest question = new QuestionHelperRequest();
        question.setQuestionText("test");
        question.setQuestionNumber(1);
        return question;
    }
}
