package com.hiringPlatform.employer.service;

import com.hiringPlatform.employer.model.Job;
import com.hiringPlatform.employer.model.Question;
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

    public void associateQuestionWithJob(List<String> questions, Job job){
        for(String question: questions){
            Question questionToBeSaved = new Question();
            questionToBeSaved.setJob(job);
            questionToBeSaved.setQuestionText(question);
            questionRepository.save(questionToBeSaved);
        }
    }

    public List<String> getAllQuestionsForJob(String jobId){
        return questionRepository.findAllByJobId(jobId)
                .stream()
                .map(Question::getQuestionText)
                .collect(Collectors.toList());
    }
}
