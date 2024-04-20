package com.hiringPlatform.admin.service;

import com.hiringPlatform.admin.model.*;
import com.hiringPlatform.admin.model.response.OverviewResponse;
import com.hiringPlatform.admin.repository.*;
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

    private final UserRepository userRepository;

    private final CandidateRepository candidateRepository;

    private final EmployerRepository employerRepository;

    private final AdminRepository adminRepository;

    @Autowired
    public ChartService(JobRepository jobRepository,
                        ApplicationRepository applicationRepository,
                        UserRepository userRepository,
                        CandidateRepository candidateRepository,
                        AdminRepository adminRepository,
                        EmployerRepository employerRepository) {
        this.applicationRepository = applicationRepository;
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
        this.candidateRepository = candidateRepository;
        this.adminRepository = adminRepository;
        this.employerRepository = employerRepository;
    }

    /**
     * Job Distribution Chart by Category
     * A chart showing how many jobs are available in each industry,
     * helping the admin understand which fields are most in demand.
     */
    public Map<String, Integer> getJobCategoryDistribution() {
        Map<String, Integer> distribution = new HashMap<>();
        List<Job> jobs = jobRepository.findAll();
        for (Job job : jobs) {
            String category = job.getIndustry();
            distribution.put(category, distribution.getOrDefault(category, 0) + 1);
        }
        return distribution;
    }

    /**
     * Application Status Graph:
     * A graph showing the percentage of applications that have been accepted,
     * rejected, or are pending.
     */
    public Map<String, Integer> getApplicationStatusPercentage() {
        Map<String, Integer> valueMap = new HashMap<>();
        List<Application> applications = applicationRepository.findAll();
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
        valueMap.put("finalizat", acceptedCount);
        valueMap.put("refuzat", rejectedCount);
        valueMap.put("in_curs", pendingCount);
        return valueMap;
    }

    /**
     * Graph of the number of applications uploaded over time:
     * Displaying the number of applications over time can give an idea
     * of the activity and interest of users on the platform.
     */
    public Map<String, Integer> getApplicationsPerDate() {
        Map<String, Integer> applicationsByDate = new HashMap<>();
        List<Application> applications = applicationRepository.findAll();

        for (Application application : applications) {
            Date date = application.getApplicationDate();
            Instant instant = date.toInstant();
            LocalDate localDate = instant.atZone(ZoneId.systemDefault()).toLocalDate();
            String formattedDate = localDate.toString();
            applicationsByDate.put(formattedDate, applicationsByDate.getOrDefault(formattedDate, 0) + 1);
        }

        return applicationsByDate;
    }


    /**
     * Job Experience Graph:
     * A graph showing the percentage of jobs that have been based on the required experience
     */
    public Map<String, Double> getJobsExperiencePercentage() {
        Map<String, Double> percentageMap = new HashMap<>();
        List<Job> jobs = jobRepository.findAll();
        int totalJobs = jobs.size();
        int entryLevel = 0, junior = 0, intermediate = 0;
        for (Job job : jobs) {
            switch (job.getExperience()) {
                case "Entry-Level":
                    entryLevel++;
                    break;
                case "Junior":
                    junior++;
                    break;
                case "Intermediar":
                    intermediate++;
                    break;
            }
        }
        percentageMap.put("Entry-Level", ((double) entryLevel / totalJobs) * 100);
        percentageMap.put("Junior", ((double) junior / totalJobs) * 100);
        percentageMap.put("Intermediar", ((double) intermediate / totalJobs) * 100);
        return percentageMap;
    }

    /**
     * Top Employees Graph:
     * A graph showing top 3 employers based on application count
     */
    public Map<String, Integer> getTopEmployersWithApplications() {
        List<Object[]> topEmployersWithApplicationsCount = applicationRepository.findEmployersWithApplicationsCount();

        // Build the Map with the names of the companies and the number of applications
        Map<String, Integer> topEmployers = new LinkedHashMap<>();
        int previousApplicationsCount = -1;
        for (Object[] result : topEmployersWithApplicationsCount) {
            String companyName = (String) result[0];
            int applicationsCount = ((Number) result[1]).intValue();

            if (applicationsCount != previousApplicationsCount && topEmployers.size() >= 3) {
                break;
                // Exit if we have already processed the first 3 employers with different number of applications
            }

            topEmployers.put(companyName, applicationsCount);
            previousApplicationsCount = applicationsCount;
        }

        return topEmployers;
    }

    /**
     * Graph with the number of accounts created over time:
     * Display of the number of accounts created over time depending on the role
     */
    public Map<String, Map<String, Long>> getAccountCreationTrend() {
        List<User> users = userRepository.findAll();

        Map<String, Map<String, Long>> usersByRoleAndDate = new HashMap<>();

        for (User user : users) {
            LocalDate registrationDate = user.getRegistrationDate().toInstant()
                    .atZone(ZoneId.systemDefault()).toLocalDate();
            String roleName = user.getUserRole().getRoleName();
            String formattedDate = registrationDate.toString();

            usersByRoleAndDate.computeIfAbsent(roleName, k -> new HashMap<>())
                    .merge(formattedDate, 1L, Long::sum);
        }

        return usersByRoleAndDate;
    }

    /**
     * Display of the number of candidates, employers, admins, jobs and applications
     */
    public OverviewResponse getOverview() {
        OverviewResponse response = new OverviewResponse();
        List<Job> jobs = jobRepository.findAll();
        List<Application> applications = applicationRepository.findAll();
        List<Candidate> candidates = candidateRepository.findAll();
        List<Employer> employers = employerRepository.findAll();
        List<Admin> admins = adminRepository.findAll();
        response.setNumberOfAdmins(admins.size());
        response.setNumberOfApplications(applications.size());
        response.setNumberOfCandidates(candidates.size());
        response.setNumberOfEmployers(employers.size());
        response.setNumberOfJobs(jobs.size());
        return response;
    }
}
