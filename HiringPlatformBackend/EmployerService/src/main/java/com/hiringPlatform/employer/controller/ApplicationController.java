package com.hiringPlatform.employer.controller;

import com.hiringPlatform.employer.model.request.UpdateApplicationRequest;
import com.hiringPlatform.employer.model.response.ApplicationResponse;
import com.hiringPlatform.employer.service.ApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.hiringPlatform.employer.model.request.RefuseApplicationRequest;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3001")
public class ApplicationController {

    private final ApplicationService applicationService;

    @Autowired
    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }


    @GetMapping("/getAllApplicationsForJob/{jobId}")
    public ResponseEntity<List<ApplicationResponse>> getAllApplicationsForJob(@PathVariable String jobId) {
        List<ApplicationResponse> responses =  applicationService.getAllApplicationsForJob(jobId);
        return ResponseEntity.ok(responses);
    }

    @PostMapping("/refuseApplication")
    public ResponseEntity<Boolean> refuseApplication(@RequestBody RefuseApplicationRequest request) {
        Boolean b =  applicationService.refuseApplication(request.getJobId(), request.getCandidateId(), request.getReason());
        return ResponseEntity.ok(b);
    }

    @PostMapping("/setNextStage")
    public ResponseEntity<ApplicationResponse> setNextStage(@RequestBody UpdateApplicationRequest request) {
        ApplicationResponse b =  applicationService.setNextStage(request.getJobId(), request.getCandidateId());
        return ResponseEntity.ok(b);
    }
}
