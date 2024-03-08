package com.hiringPlatform.employer.controller;

import com.hiringPlatform.employer.model.Job;
import com.hiringPlatform.employer.model.request.AddJobRequest;
import com.hiringPlatform.employer.model.request.UpdateJobDescRequest;
import com.hiringPlatform.employer.model.response.JobResponse;
import com.hiringPlatform.employer.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3001")
public class JobController {

    private final JobService jobService;

    @Autowired
    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @GetMapping("/getNrJobsForEmployer/{employerId}")
    public ResponseEntity<Number> getNrJobsForEmployer(@PathVariable String employerId) {
        List<JobResponse> jobResponseList =  jobService.getAllJobsForEmployer(employerId);
        return ResponseEntity.ok(jobResponseList.size());
    }

    /**
     * Method used for getting the list of jobs for the employer
     * @return the list of jobs
     */
    @GetMapping("/getAllJobsForEmployer/{employerId}")
    public ResponseEntity<List<JobResponse>> getAllJobsForEmployer(@PathVariable String employerId) {
        List<JobResponse> jobResponseList =  jobService.getAllJobsForEmployer(employerId);
        return ResponseEntity.ok(jobResponseList);
    }

    /**
     * Method used for deleting a job
     * @return the status of the deleting
     */
    @PostMapping("/deleteJob/{jobId}")
    public ResponseEntity<Boolean> deleteJob(@PathVariable String jobId) {
        Boolean value =  jobService.deleteJob(jobId);
        return ResponseEntity.ok(value);
    }

    /**
     * Method used for adding a job
     * @return the added job
     */
    @PostMapping("/addJob")
    public ResponseEntity<Job> addJob(@RequestBody AddJobRequest addJobRequest) {
        Job job =  jobService.addJob(addJobRequest);
        return ResponseEntity.ok(job);
    }

    /**
     * Method used for updating a job
     * @return the updated job
     */
    @PostMapping("/updateJobDescription")
    public ResponseEntity<JobResponse> updateJobDescription(@RequestBody UpdateJobDescRequest request) {
        JobResponse job =  jobService.updateJobDescription(request.getJobId(), request.getDescription());
        return ResponseEntity.ok(job);
    }
}
