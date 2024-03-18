package com.hiringPlatform.candidate.controller;

import com.hiringPlatform.candidate.model.response.JobResponse;
import com.hiringPlatform.candidate.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class JobController {

    private final JobService jobService;

    @Autowired
    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    /**
     * Method used for getting all jobs
     */
    @GetMapping("/getAllJobs")
    public ResponseEntity<List<JobResponse>> getAllJobs() {
        List<JobResponse> list =  jobService.getAllJobs();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/getNrJobsForEmployer/{employerId}")
    public ResponseEntity<Number> getNrJobsForEmployer(@PathVariable String employerId) {
        List<JobResponse> jobResponseList =  jobService.getAllJobsForEmployer(employerId);
        return ResponseEntity.ok(jobResponseList.size());
    }
}
