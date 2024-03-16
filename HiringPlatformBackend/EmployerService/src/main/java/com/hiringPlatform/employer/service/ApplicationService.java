package com.hiringPlatform.employer.service;


import com.hiringPlatform.employer.model.Contains;
import com.hiringPlatform.employer.model.Application;
import com.hiringPlatform.employer.model.response.ApplicationResponse;
import com.hiringPlatform.employer.repository.ApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;

    private final JobService jobService;
    private final AnswerService answerService;
    private final StageService stageService;


    @Autowired
    public ApplicationService(ApplicationRepository applicationRepository, JobService jobService,
                              AnswerService answerService, StageService stageService) {
        this.applicationRepository = applicationRepository;
        this.jobService = jobService;
        this.answerService = answerService;
        this.stageService = stageService;
    }
    public List<ApplicationResponse> getAllApplicationsForJob(String jobId){
        return applicationRepository.findApplicationsForJob(jobId).stream().map(this::buildAppResponse).toList();
    }

    public Boolean refuseApplication(String jobId, String candidateId, String reason){
        Optional<Application> applicationOptional = applicationRepository.findByApplicationId(jobId, candidateId);
        if(applicationOptional.isPresent()){
            Application application = applicationOptional.get();
            application.setStatus("refuzat");
            application.setRefusalReason(reason);
            applicationRepository.save(application);
            return true;
        }
        return false;
    }

    public ApplicationResponse setNextStage(String jobId, String candidateId){
        Optional<Application> applicationOptional = applicationRepository.findByApplicationId(jobId, candidateId);
        if(applicationOptional.isPresent()){
            Application app = applicationOptional.get();
            Contains currentStageContains = stageService.getCurrentStageForApplication(app.getStage().getStageId(), jobId);
            List<Contains> allStageContains = stageService.getAllContainsForJob(jobId);
            int stageSize = allStageContains.size();
            if((stageSize - 2) == currentStageContains.getStageNr()){
                // The candidate is hired
                app.setStatus("finalizat");
                app.setStage(allStageContains.get(stageSize-1).getStage());
            }
            else{
                // The candidate only go to the next step
                app.setStage(allStageContains.get(currentStageContains.getStageNr() + 1).getStage());
            }
            Application savedApp = applicationRepository.save(app);
            return buildAppResponse(savedApp);
        }
        return null;
    }

    private ApplicationResponse buildAppResponse(Application a){
        ApplicationResponse applicationResponse = new ApplicationResponse();
        applicationResponse.setCvId(a.getCv().getCvId());
        applicationResponse.setCvName(a.getCv().getCvName());
        applicationResponse.setStatus(a.getStatus());
        applicationResponse.setCandidateId(a.getCandidate().getCandidateId());
        applicationResponse.setRefusalReason(a.getRefusalReason());
        applicationResponse.setCandidateFirstname(a.getCandidate().getFirstname());
        applicationResponse.setCandidateEmail(a.getCandidate().getUserDetails().getEmail());
        applicationResponse.setCandidateLastname(a.getCandidate().getLastname());
        applicationResponse.setEmployerEmail(a.getJob().getEmployer().getUserDetails().getEmail());
        applicationResponse.setEmployerCompanyName(a.getJob().getEmployer().getCompanyName());
        applicationResponse.setAppDate(a.getApplicationDate());
        applicationResponse.setJob(jobService.getJobResponse(a.getJob().getJobId()));
        Contains contains = stageService.getCurrentStageForApplication(a.getStage().getStageId(), a.getJob().getJobId());
        applicationResponse.setStageName(contains.getStage().getStageName());
        applicationResponse.setStageNr(contains.getStageNr());
        applicationResponse.setAllStages(stageService.getAllStagesForJob(a.getJob().getJobId()));
        applicationResponse.setAllAnswers(answerService.getAnswersForJobQuestions(a.getJob().getJobId()));
        return applicationResponse;
    }
}
