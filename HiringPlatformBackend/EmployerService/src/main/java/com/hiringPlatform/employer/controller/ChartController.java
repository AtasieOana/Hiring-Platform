package com.hiringPlatform.employer.controller;

import com.hiringPlatform.employer.service.ChartService;
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

    @GetMapping("/getAppsPerDayByEmployer/{employerId}")
    public ResponseEntity<Map<String, Integer>> getApplicationsPerDayByEmployer(@PathVariable String employerId) {
        Map<String, Integer> response = chartService.getApplicationsPerDayByEmployer(employerId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/getAppsPerJobByEmployer/{employerId}")
    public ResponseEntity<Map<String, Integer>> getApplicationsPerJobByEmployer(@PathVariable String employerId) {
        Map<String, Integer> response = chartService.getApplicationsPerJobByEmployer(employerId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/getAppsStatusNumbers/{employerId}")
    public ResponseEntity<Map<String, Double>> getApplicationStatusNumbers(@PathVariable String employerId) {
        Map<String, Double> response = chartService.getApplicationStatusNumbers(employerId);
        return ResponseEntity.ok(response);
    }
}
