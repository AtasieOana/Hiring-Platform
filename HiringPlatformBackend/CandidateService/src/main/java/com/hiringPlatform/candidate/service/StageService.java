package com.hiringPlatform.candidate.service;

import com.hiringPlatform.candidate.model.Contains;
import com.hiringPlatform.candidate.model.Stage;
import com.hiringPlatform.candidate.model.request.StageHelperRequest;
import com.hiringPlatform.candidate.repository.ContainsRepository;
import com.hiringPlatform.candidate.repository.StageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class StageService {

    private final StageRepository stageRepository;

    private final ContainsRepository containsRepository;

    @Autowired
    public StageService(StageRepository stageRepository, ContainsRepository containsRepository) {
        this.stageRepository = stageRepository;
        this.containsRepository = containsRepository;
    }

    public List<StageHelperRequest> getAllStagesForJob(String jobId){
        return containsRepository.findAllByJobId(jobId)
                .stream()
                .map(contains -> new StageHelperRequest(contains.getStage().getStageName(),
                        contains.getStageNr()))
                .collect(Collectors.toList());
    }

    public List<Stage> getAllStages(){
        return stageRepository.findAll().stream().sorted(Comparator.comparing(Stage::getStageName))
                .collect(Collectors.toList());
    }

    public Stage getStageBasedOnJobIdAndStageNumber(String jobId, Number stageNr){
        Optional<Contains> optionalStage = containsRepository.findByJobIdAndStageNumber(jobId, stageNr);
        return optionalStage.map(Contains::getStage).orElse(null);
    }

    public Contains getCurrentStageForApplication(String stageId, String jobId){
        Optional<Contains> optionalStage = containsRepository.findByJobIdAndStageId(jobId, stageId);
        return optionalStage.orElse(null);
    }
}
