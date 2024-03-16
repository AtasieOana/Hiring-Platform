package com.hiringPlatform.candidate.controller;

import com.hiringPlatform.candidate.model.Answer;
import com.hiringPlatform.candidate.model.request.AnswerQuestionRequest;
import com.hiringPlatform.candidate.service.AnswerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3002")
public class AnswerController {

    private final AnswerService answerService;

    @Autowired
    public AnswerController(AnswerService answerService) {
        this.answerService = answerService;
    }

    @PostMapping("/addAnswersForQuestions")
    public ResponseEntity<List<Answer>> addAnswersForQuestions(@RequestBody AnswerQuestionRequest request) {
        List<Answer> answerList =  answerService.addAnswersForQuestions(request);
        return ResponseEntity.ok(answerList);
    }
}
