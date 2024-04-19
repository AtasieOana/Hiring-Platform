package com.hiringPlatform.employer.service;

import com.hiringPlatform.employer.exception.EmployerNotFoundException;
import com.hiringPlatform.employer.exception.JobNotFoundException;
import com.hiringPlatform.employer.model.City;
import com.hiringPlatform.employer.model.Employer;
import com.hiringPlatform.employer.model.Job;
import com.hiringPlatform.employer.model.request.AddJobRequest;
import com.hiringPlatform.employer.model.response.JobResponse;
import com.hiringPlatform.employer.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class JobService {

    private final JobRepository jobRepository;

    private final EmployerRepository employerRepository;

    private final AddressService addressService;

    private final StageService stageService;

    private final QuestionService questionService;

    private final ApplicationService applicationService;

    @Autowired
    public JobService(JobRepository jobRepository, EmployerRepository employerRepository, AddressService addressService,
                      StageService stageService, QuestionService questionService, ApplicationService applicationService) {
        this.jobRepository = jobRepository;
        this.employerRepository = employerRepository;
        this.addressService = addressService;
        this.stageService = stageService;
        this.questionService = questionService;
        this.applicationService = applicationService;
    }

    /**
     * Method used for adding a job
     * @return the added job
     */
    public Job addJob(AddJobRequest addJobRequest){
        Optional<Employer> employerOptional = employerRepository.findById(addJobRequest.getEmployerId());
        if(employerOptional.isPresent()){
            // First create the job entry
            Job job = new Job();
            job.setEmployer(employerOptional.get());
            City city = addressService.getCity(addJobRequest.getCityName(), addJobRequest.getRegionName());
            job.setCity(city);
            job.setDescription(addJobRequest.getDescription());
            job.setContractType(addJobRequest.getContractType());
            job.setEmploymentRegime(addJobRequest.getEmploymentRegime());
            job.setPostingDate(new Date());
            job.setExperience(addJobRequest.getExperience());
            job.setTitle(addJobRequest.getTitle());
            job.setWorkMode(addJobRequest.getWorkMode());
            job.setIndustry(addJobRequest.getIndustry());
            Job savedJob = jobRepository.save(job);
            job.setStatus("deschis");
            // Associate stages
            stageService.associateStageWithJob(addJobRequest.getStages(), savedJob);
            // Associate questions
            questionService.associateQuestionWithJob(addJobRequest.getQuestions(), savedJob);
            return job;
        }
        else{
            throw new EmployerNotFoundException("Employer was not found in database");
        }
    }

    /**
     * Method used for deleting a job
     * @return the status of the deleting
     */
    public Boolean closeJob(String jobId){
        Optional<Job> jobOptional = jobRepository.findById(jobId);
        if(jobOptional.isPresent()){
            Job updatedJob = jobOptional.get();
            updatedJob.setStatus("inchis");
            jobRepository.save(updatedJob);
            applicationService.refuseApplicationAfterJobClosing(jobId);
            return true;
        }
        else{
            throw new JobNotFoundException("Job was not found in database");
        }
    }

    /**
     * Method used for getting the list of opened jobs for the employer
     * @return the list of jobs
     */
    public List<JobResponse> getAllOpenedJobsForEmployer(String employerId){
        List<JobResponse> jobResponseList = new ArrayList<>();
        List<Job> jobs = jobRepository.findOpenedJobByEmployer(employerId);
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

    /**
     * Method used for updating a job
     * @return the updated job
     */
    public JobResponse updateJobDescription(String jobId, String description){
        Optional<Job> jobOptional = jobRepository.findById(jobId);
        if(jobOptional.isPresent()){
            Job updatedJob = jobOptional.get();
            updatedJob.setDescription(description);
            Job savedJob = jobRepository.save(updatedJob);
            buildJobResponse(savedJob);
            return buildJobResponse(savedJob);
        }
        else{
            throw new JobNotFoundException("Job was not found in database");
        }
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
}
