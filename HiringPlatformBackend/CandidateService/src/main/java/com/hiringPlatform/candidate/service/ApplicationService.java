package com.hiringPlatform.candidate.service;

import com.hiringPlatform.candidate.model.*;
import com.hiringPlatform.candidate.model.response.ApplicationResponse;
import com.hiringPlatform.candidate.repository.ApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.hiringPlatform.candidate.model.request.SendMailRequest;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import static com.hiringPlatform.candidate.constant.Constant.SEND_MAIL_URL;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobService jobService;
    private final CVService cvService;
    private final CandidateService candidateService;
    private final StageService stageService;
    private final RestTemplate restTemplate;


    @Autowired
    public ApplicationService(ApplicationRepository applicationRepository, JobService jobService,
                              CandidateService candidateService,
                              CVService cvService, StageService stageService,
                              RestTemplate restTemplate) {
        this.applicationRepository = applicationRepository;
        this.jobService = jobService;
        this.cvService = cvService;
        this.candidateService = candidateService;
        this.stageService = stageService;
        this.restTemplate = restTemplate;
    }

    public Application applyToJob(String jobId, String candidateId, String cvId){
        Application application = new Application();
        application.setApplicationDate(new Date());
        application.setStatus("in_curs");
        application.setRefusalReason("");
        application.setApplicationId();
        // CV:
        CV cv = cvService.getCv(cvId);
        application.setCv(cv);
        // Job:
        Job job = jobService.getJob(jobId);
        application.setJob(job);
        // Candidate:
        Candidate candidate = candidateService.getCandidateById(candidateId);
        application.setCandidate(candidate);
        // Stage:
        Stage stage = stageService.getStageBasedOnJobIdAndStageNumber(jobId, 0);
        application.setStage(stage);
        return applicationRepository.save(application);
    }

    public List<ApplicationResponse> getAllApplicationsForCandidate(String candidateId){
        return applicationRepository.findApplicationsForCandidate(candidateId).stream().map(a -> {
            ApplicationResponse applicationResponse = new ApplicationResponse();
            applicationResponse.setCvId(a.getCv().getCvId());
            applicationResponse.setCvName(a.getCv().getCvName());
            applicationResponse.setStatus(a.getStatus());
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
            return applicationResponse;
        }).toList();
    }

    public Boolean refuseApplication(String jobId, String candidateId, String reason){
        Optional<Application> applicationOptional = applicationRepository.findByApplicationId(jobId, candidateId);
        if(applicationOptional.isPresent()){
            Application application = applicationOptional.get();
            application.setStatus("refuzat");
            application.setRefusalReason(reason);
            applicationRepository.save(application);
            buildMail(application.getJob().getEmployer().getUserDetails().getEmail(),
                    application.getJob(), application.getCandidate());
            return true;
        }
        return false;
    }

    public Boolean checkIfCandidateAppliedToJob(String jobId, String candidateId){
        Optional<Application> applicationOptional = applicationRepository.findByApplicationId(jobId, candidateId);
        return applicationOptional.isPresent();
    }

    private void buildMail(String email, Job job, Candidate candidate){
        String emailTitle = "Update regarding an application on " + job.getTitle() + " job";
        String emailContent = "<div style='background-color: #f4f4f4; padding: 20px;'>" +
                "<p>Hello,</p>" +
                "</br><p>This email is related to the application of the candidate <b>" + candidate.getFirstname() + " " +
                candidate.getLastname() + "</b> for the job <b>" + job.getTitle() + "</b> in your company <b>" + job.getEmployer().getCompanyName() + "</b> after applying on the <b>Joblistic</b> platform. Unfortunately, your recruitment process has been stopped by the candidate. The reason for this can be viewed within the platform on the Applications page for this job.</p>" +
                "<p>We wish you luck with the other applicants,</p>" +
                "<p><b>Joblistic Team</b></p>" +
                "</div>";

        this.sendMailCall(email, emailContent, emailTitle);
    }

    private void sendMailCall(String email, String content, String subject){
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        SendMailRequest requestEmail = new SendMailRequest(email, content, subject);
        HttpEntity<SendMailRequest> request = new HttpEntity<>(requestEmail, headers);
        restTemplate.postForObject(SEND_MAIL_URL, request, String.class);
    }
}
