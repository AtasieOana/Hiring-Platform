package com.hiringPlatform.candidate.service;

import com.hiringPlatform.candidate.model.*;
import com.hiringPlatform.candidate.model.response.JobResponse;
import com.hiringPlatform.candidate.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class JobService {

    private final JobRepository jobRepository;

    private final ProfileService profileService;

    private final StageService stageService;

    private final QuestionService questionService;


    @Autowired
    public JobService(JobRepository jobRepository, ProfileService profileService,
                      StageService stageService, QuestionService questionService) {
        this.jobRepository = jobRepository;
        this.profileService = profileService;
        this.stageService = stageService;
        this.questionService = questionService;
    }

    /**
     * Method used for getting the list of jobs
     * @return the list of jobs
     */
    public List<JobResponse> getAllJobs(){
        List<JobResponse> jobResponseList = new ArrayList<>();
        List<Job> jobs = jobRepository.findAllJobsOrderByDate();
        for(Job job: jobs){
            jobResponseList.add(buildJobResponse(job));
        }
        return jobResponseList;
    }

    /**
     * Method used for getting the list of jobs for the employer
     * @return the list of jobs
     */
    public List<JobResponse> getAllJobsForEmployer(String employerId){
        List<JobResponse> jobResponseList = new ArrayList<>();
        List<Job> jobs = jobRepository.findByJobEmployer(employerId);
        for(Job job: jobs){
            jobResponseList.add(buildJobResponse(job));
        }
        return jobResponseList;
    }

    public Job getJob(String jobId){
        Optional<Job> job = jobRepository.findById(jobId);
        return job.orElse(null);
    }

    public JobResponse getJobResponse(String jobId){
        Optional<Job> job = jobRepository.findById(jobId);
        return job.map(this::buildJobResponse).orElse(null);
    }

    protected JobResponse buildJobResponse(Job savedJob) {
        JobResponse jobResponse = new JobResponse();
        jobResponse.setJobId(savedJob.getJobId());
        jobResponse.setDescription(savedJob.getDescription());
        jobResponse.setContractType(savedJob.getContractType());
        jobResponse.setExperience(savedJob.getExperience());
        jobResponse.setEmploymentRegime(savedJob.getEmploymentRegime());
        jobResponse.setCityName(savedJob.getCity().getCityName());
        jobResponse.setRegionName(savedJob.getCity().getRegion().getRegionName());
        jobResponse.setCountryName(savedJob.getCity().getRegion().getCountry().getCountryName());
        jobResponse.setEmployer(savedJob.getEmployer());
        jobResponse.setEmployerProfile(profileService.getProfile(savedJob.getEmployer().getUserDetails().getEmail()));
        jobResponse.setQuestions(questionService.getAllQuestionsForJob(savedJob.getJobId()));
        jobResponse.setStages(stageService.getAllStagesForJob(savedJob.getJobId()));
        jobResponse.setIndustry(savedJob.getIndustry());
        jobResponse.setStatus(savedJob.getStatus());
        jobResponse.setPostingDate(savedJob.getPostingDate());
        jobResponse.setWorkMode(savedJob.getWorkMode());
        jobResponse.setTitle(savedJob.getTitle());
        return jobResponse;
    }
}
