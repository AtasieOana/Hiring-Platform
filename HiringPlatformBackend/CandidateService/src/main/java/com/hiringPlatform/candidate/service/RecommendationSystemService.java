package com.hiringPlatform.candidate.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hiringPlatform.candidate.model.*;
import com.hiringPlatform.candidate.model.response.JobResponse;
import com.hiringPlatform.candidate.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.*;
import java.util.*;

@Service
public class RecommendationSystemService {
    private final ApplicationRepository applicationRepository;
    private final EmployerRepository employerRepository;
    private final ReviewRepository reviewRepository;
    private final JobRepository jobRepository;
    private final JobService jobService;

    @Autowired
    public RecommendationSystemService(ApplicationRepository applicationRepository,
                                       EmployerRepository employerRepository,
                                       ReviewRepository reviewRepository,
                                       JobRepository jobRepository,
                                       JobService jobService) {
        this.applicationRepository = applicationRepository;
        this.employerRepository = employerRepository;
        this.reviewRepository = reviewRepository;
        this.jobRepository = jobRepository;
        this.jobService = jobService;
    }

    /**
     * Generate job recommendations for a user.
     *
     * @param userId the ID of the user
     * @return a list of recommended jobs
     */
    public List<JobResponse> generateJobRecommendations(String userId) {
        List<Job> recommendedJobs;
        List<Application> applicationsForUsers = applicationRepository.findAll();
        List<Job> jobs = jobRepository.findAll();

        // Map to store application data
        Map<String, List<String>> applicationData = new HashMap<>();

        // Populate application data map
        for (Application application : applicationsForUsers) {
            String userIdInside = application.getCandidate().getCandidateId();
            if (!applicationData.containsKey(userIdInside)) {
                applicationData.put(userIdInside, new ArrayList<>());
            }
            applicationData.get(userIdInside).add(application.getJob().getJobId());
        }

        // Map to store job descriptions
        Map<String, String> jobDescriptions = new HashMap<>();
        for (Job job : jobs) {
            jobDescriptions.put(job.getJobId(), job.getDescription().replace('"', ' '));
        }

        if (!checkIfUserHasApplications(userId)) {
            recommendedJobs = runRecommendationPythonScript(userId, applicationData, jobDescriptions);
        } else {
            recommendedJobs = generateInitialRecommendations();
        }

        return recommendedJobs.stream().map(jobService::buildJobResponse).toList();
    }

    /**
     * Generate initial recommendations based on company reviews
     * and the number of applications received for each job.
     *
     * @return a list of recommended jobs
     */
    private List<Job> generateInitialRecommendations() {
        Map<Job, Integer> jobApplications = calculateJobApplications();
        Map<Employer, Double> companyRatings = calculateCompanyRatings();
        return sortJobsByApplicationsAndRatings(jobApplications, companyRatings);
    }

    /**
     * Sort jobs by number of applications received and average reviews for each company.
     *
     * @param jobApplications map of jobs and number of applications
     * @param companyRatings  map of employers and average ratings
     * @return sorted list of jobs
     */
    private List<Job> sortJobsByApplicationsAndRatings(Map<Job, Integer> jobApplications, Map<Employer, Double> companyRatings) {
        List<Job> sortedJobs = new ArrayList<>(jobApplications.keySet());
        sortedJobs.sort((job1, job2) -> {
            Integer applications1 = jobApplications.get(job1);
            Integer applications2 = jobApplications.get(job2);
            Double rating1 = companyRatings.get(job1.getEmployer());
            Double rating2 = companyRatings.get(job2.getEmployer());
            if (!Objects.equals(applications1, applications2)) {
                return Integer.compare(applications2, applications1);
            }
            return Double.compare(rating2, rating1);
        });
        return sortedJobs;
    }

    /**
     * Calculate the number of applications per job.
     *
     * @return a map with jobs as keys and number of applications as values
     */
    private Map<Job, Integer> calculateJobApplications() {
        Map<Job, Integer> jobApplications = new HashMap<>();
        List<Job> allJobs = jobRepository.findAll();
        for (Job job : allJobs) {
            Integer nrApps = applicationRepository.findNrOfApplicationForJob(job.getJobId());
            jobApplications.put(job, nrApps);
        }
        return jobApplications;
    }

    /**
     * Calculate the average of reviews grade for each company.
     *
     * @return a map with employers as keys and grade average as values
     */
    private Map<Employer, Double> calculateCompanyRatings() {
        Map<Employer, Double> companyRatings = new HashMap<>();
        List<Employer> allEmployers = employerRepository.findAll();
        for (Employer employer : allEmployers) {
            Double rating = reviewRepository.getAvgGradeForEmployer(employer.getEmployerId());
            companyRatings.put(employer, rating);
        }
        return companyRatings;
    }

    /**
     * Check if the user has any applications.
     *
     * @param userId the ID of the user
     * @return true if the user has applications, false otherwise
     */
    private boolean checkIfUserHasApplications(String userId) {
        List<Application> applications = applicationRepository.findApplicationsForCandidate(userId);
        return applications.isEmpty();
    }

    private List<Job> runRecommendationPythonScript(String userId, Map<String, List<String>> applicationData, Map<String, String> jobDescriptions) {
        try {
            String pythonScriptPath = new ClassPathResource("recommendation_script.py").getFile().getAbsolutePath();
            ObjectMapper objectMapper = new ObjectMapper();
            String applicationDataJson = objectMapper.writeValueAsString(applicationData);
            String jobDescriptionsJson = objectMapper.writeValueAsString(jobDescriptions);

            // Start the Python process
            ProcessBuilder pb = new ProcessBuilder("python", pythonScriptPath);
            Process process = pb.start();

            // Write JSON data to the standard input of the Python process
            try (BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(process.getOutputStream()))) {
                writer.write(userId);
                writer.newLine();
                writer.write(applicationDataJson);
                writer.newLine();
                writer.write(jobDescriptionsJson);
                writer.newLine();
            }
            // Read output from the Python process
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String jobsId;
            List<Job> recommendedJobs = new ArrayList<>();
            while ((jobsId = reader.readLine()) != null) {
                System.out.println("Recommendations" + jobsId);
                String cleanedResponse = jobsId.replace("'", "").replaceAll("[\\[\\]\\s+]", "");
                String[] jobIdArray = cleanedResponse.split(",");
                for (String jobId : jobIdArray) {
                    Optional<Job> job = jobRepository.findById(jobId);
                    job.ifPresent(recommendedJobs::add);
                }
            }

            return recommendedJobs;
        } catch (Exception e) {
            // In case of any error, return all jobs
            return jobRepository.findAll();
        }
    }
}
