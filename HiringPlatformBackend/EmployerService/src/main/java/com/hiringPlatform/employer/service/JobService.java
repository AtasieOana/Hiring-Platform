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


    @Autowired
    public JobService(JobRepository jobRepository, EmployerRepository employerRepository, AddressService addressService,
                      StageService stageService, QuestionService questionService) {
        this.jobRepository = jobRepository;
        this.employerRepository = employerRepository;
        this.addressService = addressService;
        this.stageService = stageService;
        this.questionService = questionService;
    }

    public Job addJob(AddJobRequest addJobRequest){
        Optional<Employer> employerOptional = employerRepository.findById(addJobRequest.getEmployerId());
        if(employerOptional.isPresent()){
            // First create the job entry
            Job job = new Job();
            job.setEmployer(employerOptional.get());
            City city = addressService.saveCityIfNotExist(addJobRequest.getCityName(), addJobRequest.getRegionName(), addJobRequest.getCountryName());
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

    public Boolean deleteJob(String jobId){
        Optional<Job> jobOptional = jobRepository.findById(jobId);
        if(jobOptional.isPresent()){
            jobRepository.delete(jobOptional.get());
            return true;
        }
        else{
            throw new JobNotFoundException("Job was not found in database");
        }
    }

    public List<JobResponse> getAllJobsForEmployer(String employerId){
        List<JobResponse> jobResponseList = new ArrayList<>();
        List<Job> jobs = jobRepository.findByJobEmployer(employerId);
        for(Job job: jobs){
            JobResponse jobResponse = new JobResponse();
            jobResponse.setDescription(job.getDescription());
            jobResponse.setContractType(job.getContractType());
            jobResponse.setExperience(job.getExperience());
            jobResponse.setEmploymentRegime(job.getEmploymentRegime());
            jobResponse.setCityName(job.getCity().getCityName());
            jobResponse.setRegionName(job.getCity().getRegion().getRegionName());
            jobResponse.setCountryName(job.getCity().getRegion().getCountry().getCountryName());
            jobResponse.setEmployerId(job.getEmployer().getEmployerId());
            jobResponse.setQuestions(questionService.getAllQuestionsForJob(job.getJobId()));
            jobResponse.setStages(stageService.getAllStagesForJob(job.getJobId()));
            jobResponse.setIndustry(job.getIndustry());
            jobResponse.setWorkMode(jobResponse.getWorkMode());
            jobResponse.setTitle(job.getTitle());
            jobResponseList.add(jobResponse);
        }
        return jobResponseList;
    }
}
