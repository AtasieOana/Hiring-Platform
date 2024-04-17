package com.hiringPlatform.candidate.service;

import com.hiringPlatform.candidate.model.Application;
import com.hiringPlatform.candidate.model.Contains;
import com.hiringPlatform.candidate.model.Job;
import com.hiringPlatform.candidate.repository.ApplicationRepository;
import com.hiringPlatform.candidate.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;

@Service
public class ChartService {

    private final JobRepository jobRepository;

    private final ApplicationRepository applicationRepository;

    private final StageService stageService;

    @Autowired
    public ChartService(JobRepository jobRepository,
                        ApplicationRepository applicationRepository,
                        StageService stageService) {
        this.applicationRepository = applicationRepository;
        this.jobRepository = jobRepository;
        this.stageService = stageService;
    }

    /**
     * A graph showing the number of jobs published per day in the current year.
     */
    public Map<String, Integer> getJobsPublishedPerDayInCurrentYear() {
        Map<String, Integer> jobCountMap = new HashMap<>();
        List<Job> jobs = jobRepository.findAll();
        for (Job job : jobs) {
            // Using the LocalDate method to get the date the job was published
            Date postingDate = job.getPostingDate();
            Instant instant = postingDate.toInstant();
            LocalDate localDate = instant.atZone(ZoneId.systemDefault()).toLocalDate();
            String formattedDate = localDate.toString();
            jobCountMap.put(formattedDate, jobCountMap.getOrDefault(formattedDate, 0) + 1);
        }
        return jobCountMap;
    }

    /**
     * A graph showing the numbers of applications that have been accepted,
     * rejected, or are pending for a candidate.
     */
    public Map<String, Integer> getApplicationStatusNumbers(String candidateId) {
        Map<String, Integer> percentageMap = new HashMap<>();
        List<Application> applications = applicationRepository.findApplicationsForCandidate(candidateId);
        int acceptedCount = 0, rejectedCount = 0, pendingCount = 0;
        for (Application application : applications) {
            switch (application.getStatus()) {
                case "finalizat":
                    acceptedCount++;
                    break;
                case "refuzat":
                    rejectedCount++;
                    break;
                case "in_curs":
                    pendingCount++;
                    break;
            }
        }
        percentageMap.put("finalizat", acceptedCount);
        percentageMap.put("refuzat", rejectedCount);
        percentageMap.put("in_curs", pendingCount);
        return percentageMap;
    }

    /**
     * A graph showing the numbers of applications that have been viewed or not
     * for a candidate
     */
    public Map<String, Double> getApplicationViewedNumbers(String candidateId) {
        Map<String, Double> percentageMap = new HashMap<>();
        List<Application> applications = applicationRepository.findApplicationsForCandidate(candidateId);
        int totalApplications = applications.size();
        int seenCount = 0, notSeenCount = 0;
        for (Application application : applications) {
            Contains contains = stageService.getCurrentStageForApplication(application.getStage().getStageId(), application.getJob().getJobId());
            if(contains.getStageNr() == 0){
                notSeenCount++;
            }
            else{
                seenCount++;
            }
        }
        percentageMap.put("vazut", ((double) seenCount / totalApplications) * 100);
        percentageMap.put("nevazut", ((double) notSeenCount / totalApplications) * 100);
        return percentageMap;
    }

}
