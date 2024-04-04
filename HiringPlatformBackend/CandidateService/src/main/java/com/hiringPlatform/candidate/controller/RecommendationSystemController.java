package com.hiringPlatform.candidate.controller;

import com.hiringPlatform.candidate.model.response.JobResponse;
import com.hiringPlatform.candidate.service.RecommendationSystemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class RecommendationSystemController {

    private final RecommendationSystemService recommendationSystemService;

    @Autowired
    public RecommendationSystemController(RecommendationSystemService recommendationSystemService) {
        this.recommendationSystemService = recommendationSystemService;
    }

    @GetMapping("/getRecommendedJobs/{candidateId}")
    public ResponseEntity<List<JobResponse>> getRecommendedJobs(@PathVariable String candidateId) {
        List<JobResponse> list = recommendationSystemService.generateJobRecommendations(candidateId);
        return ResponseEntity.ok(list);
    }
}
