package com.hiringPlatform.employer.service;

import com.hiringPlatform.employer.model.Job;
import com.hiringPlatform.employer.model.Question;
import com.hiringPlatform.employer.model.request.QuestionHelperRequest;
import com.hiringPlatform.employer.repository.QuestionRepository;
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

    public void associateQuestionWithJob(List<QuestionHelperRequest> questions, Job job){
        for(QuestionHelperRequest question: questions){
            Question questionToBeSaved = new Question();
            questionToBeSaved.setJob(job);
            questionToBeSaved.setQuestionText(question.getQuestionText());
            questionToBeSaved.setQuestionNumber(question.getQuestionNumber());
            questionRepository.save(questionToBeSaved);
        }
    }

    public List<QuestionHelperRequest> getAllQuestionsForJob(String jobId){
        return questionRepository.findAllByJobId(jobId)
                .stream()
                .map(question -> new QuestionHelperRequest(question.getQuestionText(), question.getQuestionNumber()))
                .collect(Collectors.toList());
    }
}
