package com.hiringPlatform.candidate.controller;

import com.hiringPlatform.candidate.service.ChartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class ChartController {

    private final ChartService chartService;

    @Autowired
    public ChartController(ChartService chartService) {
        this.chartService = chartService;
    }

    @GetMapping("/getJobsPublishedPerDay")
    public ResponseEntity<Map<String, Integer>> getJobsPublishedPerDay() {
        Map<String, Integer> response = chartService.getJobsPublishedPerDayInCurrentYear();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/getApplicationStatusNumbers/{candidateId}")
    public ResponseEntity<Map<String, Integer>> getApplicationStatusPercentage(@PathVariable String candidateId) {
        Map<String, Integer> response = chartService.getApplicationStatusNumbers(candidateId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/getApplicationViewedNumbers/{candidateId}")
    public ResponseEntity<Map<String, Double>> getApplicationViewedNumbers(@PathVariable String candidateId) {
        Map<String, Double> response = chartService.getApplicationViewedNumbers(candidateId);
        return ResponseEntity.ok(response);
    }
}
