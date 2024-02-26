package com.hiringPlatform.employer.controller;

import com.hiringPlatform.employer.model.Job;
import com.hiringPlatform.employer.model.Stage;
import com.hiringPlatform.employer.model.request.AddJobRequest;
import com.hiringPlatform.employer.model.response.JobResponse;
import com.hiringPlatform.employer.service.JobService;
import com.hiringPlatform.employer.service.StageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3001")
public class StageController {

    private final StageService stageService;

    @Autowired
    public StageController(StageService stageService) {
        this.stageService = stageService;
    }

    /**
     * Method used for getting the list of stages
     * @return the list of stages
     */
    @GetMapping("/getAllStages")
    public ResponseEntity<List<Stage>> getAllStages() {
        List<Stage> stages =  stageService.getAllStages();
        return ResponseEntity.ok(stages);
    }
}
