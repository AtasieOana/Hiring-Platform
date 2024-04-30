package com.hiringPlatform.employer.service;

import com.hiringPlatform.employer.model.Job;
import com.hiringPlatform.employer.model.Question;
import com.hiringPlatform.employer.model.request.QuestionHelperRequest;
import com.hiringPlatform.employer.repository.QuestionRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class QuestionServiceTest {

    @InjectMocks
    QuestionService questionService;
    @Mock
    QuestionRepository questionRepository;

    @Test
    public void testAssociateQuestionWithJob() {
        // Given
        Job job = new Job();
        List<QuestionHelperRequest> questions = new ArrayList<>();
        questions.add(new QuestionHelperRequest("Question 1", 1));
        questions.add(new QuestionHelperRequest("Question 2", 2));

        // When
        when(questionRepository.save(any(Question.class))).thenReturn(buildQuestion());

        // Then
        questionService.associateQuestionWithJob(questions, job);

        verify(questionRepository, times(questions.size())).save(any(Question.class));

        ArgumentCaptor<Question> questionCaptor = ArgumentCaptor.forClass(Question.class);
        verify(questionRepository, times(questions.size())).save(questionCaptor.capture());

        List<Question> capturedQuestions = questionCaptor.getAllValues();
        for (int i = 0; i < questions.size(); i++) {
            assertEquals(job, capturedQuestions.get(i).getJob());
            assertEquals(questions.get(i).getQuestionText(), capturedQuestions.get(i).getQuestionText());
            assertEquals(questions.get(i).getQuestionNumber(), capturedQuestions.get(i).getQuestionNumber());
        }
    }

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
