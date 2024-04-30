package com.hiringPlatform.employer.service;

import com.hiringPlatform.employer.model.Contains;
import com.hiringPlatform.employer.model.Job;
import com.hiringPlatform.employer.model.Stage;
import com.hiringPlatform.employer.model.request.StageHelperRequest;
import com.hiringPlatform.employer.repository.ContainsRepository;
import com.hiringPlatform.employer.repository.StageRepository;
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

    protected Stage saveStageIfNotExist(String name){
        Optional<Stage> stage = stageRepository.findByStageName(name);
        if(stage.isPresent()){
            return stage.get();
        }
        else{
            Stage newStage = new Stage();
            newStage.setStageName(name);
            return stageRepository.save(newStage);
        }
    }

    public void associateStageWithJob(List<StageHelperRequest> stages, Job job){
        for(StageHelperRequest stage: stages){
            // Save stage object
            Stage dbStage = saveStageIfNotExist(stage.getStageName());
            // Save contains object
            Contains contains = new Contains();
            contains.setContainsId();
            contains.setStage(dbStage);
            contains.setJob(job);
            contains.setStageNr(stage.getStageNr());
            containsRepository.save(contains);
        }
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

    public List<Stage> getStagesForJob(String jobId){
        return containsRepository.findAllByJobId(jobId)
                .stream()
                .map(Contains::getStage)
                .collect(Collectors.toList());
    }

    public Contains getCurrentStageForApplication(String stageId, String jobId){
        Optional<Contains> optionalStage = containsRepository.findByJobIdAndStageId(jobId, stageId);
        return optionalStage.orElse(null);
    }

    public List<Contains> getAllContainsForJob(String jobId){
        return containsRepository.findAllByJobId(jobId);
    }

}
