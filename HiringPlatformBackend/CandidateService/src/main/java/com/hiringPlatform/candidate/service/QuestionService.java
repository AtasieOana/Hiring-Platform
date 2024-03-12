package com.hiringPlatform.candidate.service;

import com.hiringPlatform.candidate.model.request.QuestionHelperRequest;
import com.hiringPlatform.candidate.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class QuestionService {

    private final QuestionRepository questionRepository;

    @Autowired
    public QuestionService(QuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
    }

    public List<QuestionHelperRequest> getAllQuestionsForJob(String jobId){
        return questionRepository.findAllByJobId(jobId)
                .stream()
                .map(question -> new QuestionHelperRequest(question.getQuestionText(), question.getQuestionNumber()))
                .collect(Collectors.toList());
    }
}
