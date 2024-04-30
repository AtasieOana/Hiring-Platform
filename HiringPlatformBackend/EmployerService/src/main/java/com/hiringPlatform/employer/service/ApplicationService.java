package com.hiringPlatform.employer.service;

import com.hiringPlatform.employer.model.Contains;
import com.hiringPlatform.employer.model.Application;
import com.hiringPlatform.employer.model.Job;
import com.hiringPlatform.employer.model.Stage;
import com.hiringPlatform.employer.model.request.SendMailRequest;
import com.hiringPlatform.employer.model.response.ApplicationResponse;
import com.hiringPlatform.employer.model.response.JobResponse;
import com.hiringPlatform.employer.repository.ApplicationRepository;
import com.hiringPlatform.employer.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

import static com.hiringPlatform.employer.constant.Constant.SEND_MAIL_URL;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final AnswerService answerService;
    private final StageService stageService;
    private final RestTemplate restTemplate;
    private final QuestionService questionService;

    @Autowired
    public ApplicationService(ApplicationRepository applicationRepository, JobRepository jobRepository,
                              AnswerService answerService, StageService stageService,
                              RestTemplate restTemplate, QuestionService questionService) {
        this.applicationRepository = applicationRepository;
        this.jobRepository = jobRepository;
        this.answerService = answerService;
        this.stageService = stageService;
        this.restTemplate = restTemplate;
        this.questionService = questionService;
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
            buildMailBasedOnStatus(application.getCandidate().getUserDetails().getEmail(),
                    0, application.getJob(), application.getStage());
            return true;
        }
        return false;
    }

    public void refuseApplicationAfterJobClosing(String jobId){
        List<Application> list = applicationRepository.findApplicationsForJob(jobId);
        list.forEach(application -> {
            if(Objects.equals(application.getStatus(), "in_curs")){
                refuseApplication(jobId, application.getCandidate().getCandidateId(), "The employer has closed the job advertisement.");
            }
        });
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
                buildMailBasedOnStatus(app.getCandidate().getUserDetails().getEmail(),
                        2, app.getJob(), allStageContains.get(stageSize-1).getStage());
            }
            else{
                // The candidate only go to the next step
                app.setStage(allStageContains.get(currentStageContains.getStageNr() + 1).getStage());
                buildMailBasedOnStatus(app.getCandidate().getUserDetails().getEmail(),
                        1, app.getJob(), allStageContains.get(currentStageContains.getStageNr() + 1).getStage());
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
        applicationResponse.setJob(getJobResponse(a.getJob().getJobId()));
        Contains contains = stageService.getCurrentStageForApplication(a.getStage().getStageId(), a.getJob().getJobId());
        applicationResponse.setStageName(contains.getStage().getStageName());
        applicationResponse.setStageNr(contains.getStageNr());
        applicationResponse.setAllStages(stageService.getAllStagesForJob(a.getJob().getJobId()));
        applicationResponse.setAllAnswers(answerService.getAnswersForJobQuestions(a.getJob().getJobId(), a.getCandidate().getCandidateId()));
        return applicationResponse;
    }

    private void buildMailBasedOnStatus(String email, Integer status, Job job, Stage nextStage){
        String emailContent = "";
        String emailTitle = "Update regarding your application on " + job.getEmployer().getCompanyName();
        if(status == 0){
             // if 0, then the user is refused
             emailContent = "<div style='background-color: #f4f4f4; padding: 20px;'>" +
                    "<p>Hello,</p>" +
                    "</br><p>This email is related to your application for the job <b>" + job.getTitle() + "</b> in the company <b>" + job.getEmployer().getCompanyName() + "</b> after applying on the <b>Joblistic</b> platform. Unfortunately, your recruitment process has been stopped by the employer. The reason for this can be viewed within the platform on the Applications page.</p>" +
                    "<p>We wish you good luck in everything you want to achieve,</p>" +
                    "<p><b>Joblistic Team</b></p>" +
                    "</div>";
        }
        else if(status == 1){
            // if 1, then the user go to next stage
            emailContent = "<div style='background-color: #f4f4f4; padding: 20px;'>" +
                    "<p>Hello,</p>" +
                    "</br><p>This email is related to your application for the job <b>" + job.getTitle() + "</b> in the company <b>" + job.getEmployer().getCompanyName() + "</b> after applying on the <b>Joblistic</b> platform. We are happy to announce that your recruitment process has progressed to the next stage: <b>" + nextStage.getStageName() + "</b>. You can see more information in the application.</p>" +
                    "<p>We wish you good luck in the next step,</p>" +
                    "<p><b>Joblistic Team</b></p>" +
                    "</div>";
        } else{
            // if 2, then the user is employed
            emailContent = "<div style='background-color: #f4f4f4; padding: 20px;'>" +
                    "<p>Hello,</p>" +
                    "</br><p>This email is related to your application for the job <b>" + job.getTitle() + "</b> in the company <b>" + job.getEmployer().getCompanyName() + "</b> after applying on the <b>Joblistic</b> platform. We are happy to announce that your recruitment process has been successfully completed. You can see more details in the application.</p>" +
                    "<p>Congratulations and all the best,</p>" +
                    "<p><b>Joblistic Team</b></p>" +
                    "</div>";
        }
        this.sendMailCall(email, emailContent, emailTitle);
    }

    private void sendMailCall(String email, String content, String subject){
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        SendMailRequest requestEmail = new SendMailRequest(email, content, subject);
        HttpEntity<SendMailRequest> request = new HttpEntity<>(requestEmail, headers);
        restTemplate.postForObject(SEND_MAIL_URL, request, String.class);
    }

    private JobResponse buildJobResponse(Job savedJob) {
        JobResponse jobResponse = new JobResponse();
        jobResponse.setJobId(savedJob.getJobId());
        jobResponse.setDescription(savedJob.getDescription());
        jobResponse.setContractType(savedJob.getContractType());
        jobResponse.setExperience(savedJob.getExperience());
        jobResponse.setEmploymentRegime(savedJob.getEmploymentRegime());
        jobResponse.setCityName(savedJob.getCity().getCityName());
        jobResponse.setRegionName(savedJob.getCity().getRegion().getRegionName());
        jobResponse.setEmployerId(savedJob.getEmployer().getEmployerId());
        jobResponse.setQuestions(questionService.getAllQuestionsForJob(savedJob.getJobId()));
        jobResponse.setStages(stageService.getAllStagesForJob(savedJob.getJobId()));
        jobResponse.setIndustry(savedJob.getIndustry());
        jobResponse.setStatus(savedJob.getStatus());
        jobResponse.setPostingDate(savedJob.getPostingDate());
        jobResponse.setWorkMode(savedJob.getWorkMode());
        jobResponse.setTitle(savedJob.getTitle());
        return jobResponse;
    }

    private JobResponse getJobResponse(String jobId){
        Optional<Job> job = jobRepository.findById(jobId);
        return job.map(this::buildJobResponse).orElse(null);
    }

}
