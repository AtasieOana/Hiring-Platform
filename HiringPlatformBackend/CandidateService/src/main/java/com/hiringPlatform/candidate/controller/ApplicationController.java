package com.hiringPlatform.candidate.controller;

import com.hiringPlatform.candidate.model.Application;
import com.hiringPlatform.candidate.model.request.ApplyToJobRequest;
import com.hiringPlatform.candidate.model.request.RefuseApplicationRequest;
import com.hiringPlatform.candidate.model.response.ApplicationResponse;
import com.hiringPlatform.candidate.service.ApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class ApplicationController {

    private final ApplicationService applicationService;

    @Autowired
    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping("/applyToJob")
    public ResponseEntity<Application> applyToJob(@RequestBody ApplyToJobRequest applyToJobRequest) {
        Application application =  applicationService.applyToJob(applyToJobRequest.getJobId(),
                applyToJobRequest.getCandidateId(), applyToJobRequest.getCvId());
        return ResponseEntity.ok(application);
    }

    @GetMapping("/getAllApplicationsForCandidate/{candidateId}")
    public ResponseEntity<List<ApplicationResponse>> getAllApplicationsForCandidate(@PathVariable String candidateId) {
        List<ApplicationResponse> responses =  applicationService.getAllApplicationsForCandidate(candidateId);
        return ResponseEntity.ok(responses);
    }

    @PostMapping("/refuseApplication")
    public ResponseEntity<Boolean> refuseApplication(@RequestBody RefuseApplicationRequest request) {
        Boolean b =  applicationService.refuseApplication(request.getJobId(), request.getCandidateId(), request.getReason());
        return ResponseEntity.ok(b);
    }

    @GetMapping("/checkApplication/{candidateId}/{jobId}")
    public ResponseEntity<Boolean> checkApplication(@PathVariable String candidateId, @PathVariable String jobId) {
        Boolean b =  applicationService.checkIfCandidateAppliedToJob(jobId, candidateId);
        return ResponseEntity.ok(b);
    }
}
