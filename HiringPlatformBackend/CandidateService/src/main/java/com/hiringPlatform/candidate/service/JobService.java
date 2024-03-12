package com.hiringPlatform.candidate.service;

import com.hiringPlatform.candidate.exception.CandidateNotFoundException;
import com.hiringPlatform.candidate.exception.JobNotFoundException;
import com.hiringPlatform.candidate.model.City;
import com.hiringPlatform.candidate.model.Employer;
import com.hiringPlatform.candidate.model.Job;
import com.hiringPlatform.candidate.model.response.JobResponse;
import com.hiringPlatform.candidate.repository.*;
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

    private JobResponse buildJobResponse(Job savedJob) {
        JobResponse jobResponse = new JobResponse();
        jobResponse.setJobId(savedJob.getJobId());
        jobResponse.setDescription(savedJob.getDescription());
        jobResponse.setContractType(savedJob.getContractType());
        jobResponse.setExperience(savedJob.getExperience());
        jobResponse.setEmploymentRegime(savedJob.getEmploymentRegime());
        jobResponse.setCityName(savedJob.getCity().getCityName());
        jobResponse.setRegionName(savedJob.getCity().getRegion().getRegionName());
        jobResponse.setCountryName(savedJob.getCity().getRegion().getCountry().getCountryName());
        jobResponse.setEmployerId(savedJob.getEmployer().getEmployerId());
        jobResponse.setQuestions(questionService.getAllQuestionsForJob(savedJob.getJobId()));
        jobResponse.setStages(stageService.getAllStagesForJob(savedJob.getJobId()));
        jobResponse.setIndustry(savedJob.getIndustry());
        jobResponse.setPostingDate(savedJob.getPostingDate());
        jobResponse.setWorkMode(savedJob.getWorkMode());
        jobResponse.setTitle(savedJob.getTitle());
        return jobResponse;
    }
}
