package com.hiringPlatform.candidate.service;

import com.hiringPlatform.candidate.model.Answer;
import com.hiringPlatform.candidate.model.Candidate;
import com.hiringPlatform.candidate.model.Question;
import com.hiringPlatform.candidate.model.request.AnswerQuestionRequest;
import com.hiringPlatform.candidate.repository.AnswerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AnswerService {

    private final AnswerRepository answerRepository;

    private final CandidateService candidateService;

    private final QuestionService questionService;

    @Autowired
    public AnswerService(AnswerRepository answerRepository,
                         CandidateService candidateService,
                         QuestionService questionService,
                         JobService jobService) {
        this.answerRepository = answerRepository;
        this.candidateService = candidateService;
        this.questionService = questionService;
    }

    /**
     * Method used for retrieving all CV for a candidate
     * @return the list of all CV for candidate
     */
    public List<Answer> addAnswersForQuestions(AnswerQuestionRequest request){
        Candidate candidate = candidateService.getCandidateById(request.getCandidateId());
        return request.getAnswerQuestionHelperList().stream().map(qa -> {
            Answer answer = new Answer();
            answer.setAnswerText(qa.getAnswer());
            Question question = questionService.getQuestionByJobIdAndNumber(request.getJobId(), qa.getQuestionNumber());
            answer.setQuestion(question);
            answer.setCandidate(candidate);
            return answerRepository.save(answer);
        }).toList();
    }
}
