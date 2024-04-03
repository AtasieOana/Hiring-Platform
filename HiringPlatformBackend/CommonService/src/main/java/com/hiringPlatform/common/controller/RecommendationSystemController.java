package com.hiringPlatform.common.controller;

import com.hiringPlatform.common.model.Job;
import com.hiringPlatform.common.service.RecommendationSystemService;
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
    public ResponseEntity<List<Job>> getRecommendedJobs(@PathVariable String candidateId) {
        List<Job> list = recommendationSystemService.generateJobRecommendations(candidateId);
        return ResponseEntity.ok(list);
    }
}
