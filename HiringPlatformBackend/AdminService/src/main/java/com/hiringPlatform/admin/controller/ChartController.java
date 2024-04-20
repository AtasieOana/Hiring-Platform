package com.hiringPlatform.admin.controller;

import com.hiringPlatform.admin.model.response.OverviewResponse;
import com.hiringPlatform.admin.service.ChartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class ChartController {

    private final ChartService chartService;

    @Autowired
    public ChartController(ChartService chartService) {
        this.chartService = chartService;
    }

    @GetMapping("/getJobCategoryDistribution")
    public ResponseEntity<Map<String, Integer>> getJobCategoryDistribution() {
        Map<String, Integer> response = chartService.getJobCategoryDistribution();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/getApplicationStatusPercentage")
    public ResponseEntity<Map<String, Integer>> getApplicationStatusPercentage() {
        Map<String, Integer> response = chartService.getApplicationStatusPercentage();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/getApplicationsPerDate")
    public ResponseEntity<Map<String, Integer>> getApplicationsPerDate() {
        Map<String, Integer> response = chartService.getApplicationsPerDate();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/getJobsExperiencePercentage")
    public ResponseEntity<Map<String, Double>> getJobsExperiencePercentage() {
        Map<String, Double> response = chartService.getJobsExperiencePercentage();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/getTopEmployersWithApplications")
    public ResponseEntity<Map<String, Integer>> getTopEmployersWithApplications() {
        Map<String, Integer> response = chartService.getTopEmployersWithApplications();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/getAccountCreationTrend")
    public ResponseEntity<Map<String, Map<String, Long>>> getAccountCreationTrend() {
        Map<String, Map<String, Long>> response = chartService.getAccountCreationTrend();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/getOverview")
    public ResponseEntity<OverviewResponse> getOverview() {
        OverviewResponse response = chartService.getOverview();
        return ResponseEntity.ok(response);
    }

}
