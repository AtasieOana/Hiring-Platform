package com.hiringPlatform.candidate.controller;

import com.hiringPlatform.candidate.model.request.CVRequest;
import com.hiringPlatform.candidate.model.request.UpdateCandidateAccount;
import com.hiringPlatform.candidate.model.response.CVResponse;
import com.hiringPlatform.candidate.model.response.CandidateResponse;
import com.hiringPlatform.candidate.service.CVService;
import com.hiringPlatform.candidate.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3002")
public class CVController {

    private final CVService cvService;

    @Autowired
    public CVController(CVService cvService) {
        this.cvService = cvService;
    }


    @GetMapping("/getCvListForCandidate/{candidateId}")
    public ResponseEntity<List<CVResponse>> getCvListForCandidate(@PathVariable String candidateId) {
        List<CVResponse> list =  cvService.getAllCvsForCandidate(candidateId);
        return ResponseEntity.ok(list);
    }

    @PostMapping("/addCV")
    public ResponseEntity<List<CVResponse>> addCV(@RequestBody CVRequest request) {
        List<CVResponse> list =  cvService.addCV(request.getFileName(), request.getCandidateId());
        return ResponseEntity.ok(list);
    }
}
