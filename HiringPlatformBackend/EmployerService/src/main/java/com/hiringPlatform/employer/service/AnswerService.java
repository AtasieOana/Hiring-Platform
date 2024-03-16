package com.hiringPlatform.employer.service;

import com.hiringPlatform.employer.model.request.AnswerHelperRequest;
import com.hiringPlatform.employer.repository.AnswerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AnswerService {

    private final AnswerRepository answerRepository;


    @Autowired
    public AnswerService(AnswerRepository answerRepository) {
        this.answerRepository = answerRepository;
    }

    public List<AnswerHelperRequest> getAnswersForJobQuestions(String jobId){
        return answerRepository.findAnswersByJob(jobId).stream().map(a -> {
            AnswerHelperRequest answer = new AnswerHelperRequest();
            answer.setAnswer(a.getAnswerText());
            answer.setQuestionText(a.getQuestion().getQuestionText());
            answer.setQuestionNumber(a.getQuestion().getQuestionNumber());
            return answer;
        }).toList();
    }
}
