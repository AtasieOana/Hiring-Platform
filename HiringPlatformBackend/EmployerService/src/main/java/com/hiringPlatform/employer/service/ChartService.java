package com.hiringPlatform.employer.service;

import com.hiringPlatform.employer.model.Application;
import com.hiringPlatform.employer.repository.ApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ChartService {

    private final ApplicationRepository applicationRepository;

    @Autowired
    public ChartService(ApplicationRepository applicationRepository) {
        this.applicationRepository = applicationRepository;
    }

    /**
     * A graph showing the number of applications per day for
     * the jobs posted by an employer.
     */
    public Map<String, Integer> getApplicationsPerDayByEmployer(String employerId) {
        Map<String, Integer> appCountMap = new HashMap<>();
        List<Application> applications = applicationRepository.findApplicationsForEmployer(employerId);
        for (Application app : applications) {
            // Using the LocalDate method to get the date the application was done
            Date applicationDate = app.getApplicationDate();
            Instant instant = applicationDate.toInstant();
            LocalDate localDate = instant.atZone(ZoneId.systemDefault()).toLocalDate();
            String formattedDate = localDate.toString();
            appCountMap.put(formattedDate, appCountMap.getOrDefault(formattedDate, 0) + 1);
        }
        return appCountMap;
    }

    /**
     * A graph showing the number of applications per job for an employer.
     */
    public Map<String, Integer> getApplicationsPerJobByEmployer(String employerId) {
        Map<String, Integer> appCountMap = new HashMap<>();
        List<Application> applications = applicationRepository.findApplicationsForEmployer(employerId);
        for (Application app : applications) {
            String jobName = app.getJob().getTitle();
            appCountMap.put(jobName, appCountMap.getOrDefault(jobName, 0) + 1);
        }
        return appCountMap;
    }

    /**
     * A graph showing the numbers of applications that have been accepted,
     * rejected, or are pending the jobs of an employer.
     */
    public Map<String, Double> getApplicationStatusNumbers(String employerId) {
        Map<String, Double> percentageMap = new HashMap<>();
        List<Application> applications = applicationRepository.findApplicationsForEmployer(employerId);
        int totalApplications = applications.size();
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
        percentageMap.put("finalizat", ((double) acceptedCount / totalApplications) * 100);
        percentageMap.put("refuzat", ((double) rejectedCount / totalApplications) * 100);
        percentageMap.put("in_curs", ((double) pendingCount / totalApplications) * 100);
        return percentageMap;
    }
}
