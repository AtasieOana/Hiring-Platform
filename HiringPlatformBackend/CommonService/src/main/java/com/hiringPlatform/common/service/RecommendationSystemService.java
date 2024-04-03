package com.hiringPlatform.common.service;

import com.hiringPlatform.common.model.*;
import com.hiringPlatform.common.repository.ApplicationRepository;
import com.hiringPlatform.common.repository.EmployerRepository;
import com.hiringPlatform.common.repository.JobRepository;
import com.hiringPlatform.common.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class RecommendationSystemService {

    private final UserService userService;

    private final ApplicationRepository applicationRepository;

    private final EmployerRepository employerRepository;

    private final ReviewRepository reviewRepository;
    private final JobRepository jobRepository;

    @Autowired
    public RecommendationSystemService(UserService userService,
                                       ApplicationRepository applicationRepository,
                                       EmployerRepository employerRepository,
                                       ReviewRepository reviewRepository,
                                       JobRepository jobRepository) {
        this.userService = userService;
        this.applicationRepository = applicationRepository;
        this.employerRepository = employerRepository;
        this.reviewRepository = reviewRepository;
        this.jobRepository = jobRepository;
    }

    /**
     * Make job recommendation for user
     * @param userId the id of the user
      */
    public List<Job> generateJobRecommendations(String userId) {
        User user = userService.getUser(userId);
        List<Job> recommendedJobs;

        // If the user doesn't have applications then initial recommendation are used
        if (!checkIfUserHasApplications(userId)) {
            // Calculates the similarity between the user and other users based on applications
            Map<User, Double> similarityScores = calculateSimilarityScores(user);

            // Sort similar users by similarity
            List<User> similarUsers = sortUsersBySimilarity(similarityScores);

            // Generate recommendations based on other users' interactions with jobs
            recommendedJobs = generateRecommendedJobs(similarUsers);
        } else {
            // Generate initial recommendations
            recommendedJobs = generateInitialRecommendations();
        }

        return recommendedJobs;
    }

    private Map<User, Double> calculateSimilarityScores(User user) {
        Map<User, Double> similarityScores = new HashMap<>();
        List<User> allCandidates = userService.findUsersByRole("ROLE_CANDIDATE");

        // Iterate through each user and calculate the similarity to the given user
        for (User otherUser : allCandidates) {
            // Avoid calculating similarity to the received user
            if (!otherUser.getUserId().equals(user.getUserId())) {
                double similarity = calculatePearsonSimilarity(user, otherUser);
                similarityScores.put(otherUser, similarity);
            }
        }

        return similarityScores;
    }

    /**
     * Calculates Pearson similarity between two users based on job applications
     * @param user1 user1
     * @param user2 user2
     * @return Pearson similarity
     */
    private double calculatePearsonSimilarity(User user1, User user2) {
        // Get each user's application lists
        List<Application> applications1 = applicationRepository.findApplicationsForCandidate(user1.getUserId());
        List<Application> applications2 = applicationRepository.findApplicationsForCandidate(user2.getUserId());

        // Calculates sum of products and sums of squares
        double sumXY = 0.0;
        double sumX = 0.0;
        double sumY = 0.0;
        double sumXSquare = 0.0;
        double sumYSquare = 0.0;
        int n = Math.min(applications1.size(), applications2.size());

        for (int i = 0; i < n; i++) {
            Application app1 = applications1.get(i);
            Application app2 = applications2.get(i);
            // App exists or not for user 1
            int x = (app1 != null) ? 1 : 0;
            // App exists or not for user 2
            int y = (app2 != null) ? 1 : 0;

            sumXY += x * y;
            sumX += x;
            sumY += y;
            sumXSquare += x * x;
            sumYSquare += y * y;
        }

        // Calculate the Pearson correlation coefficient
        double numerator = sumXY - (sumX * sumY / n);
        double denominator = Math.sqrt((sumXSquare - Math.pow(sumX, 2) / n) *
                (sumYSquare - Math.pow(sumY, 2) / n));

        if (denominator == 0) {
            return 0; // Similarity is 0 if the vectors are identical, meaning no correlation
        }

        return numerator / denominator;
    }

    /**
     * Sort users by similarity scores
     * @param similarityScores the similarity scores
     * @return sorted users
     */
    private List<User> sortUsersBySimilarity(Map<User, Double> similarityScores) {
        List<User> similarUsers = new ArrayList<>(similarityScores.keySet());

        // Sort users by similarity scores
        similarUsers.sort((user1, user2) -> {
            double score1 = similarityScores.get(user1);
            double score2 = similarityScores.get(user2);
            return Double.compare(score2, score1);
        });

        return similarUsers;
    }

    /**
     * Generate recommendations based on other users' interactions with jobs
     * @param similarUsers the sorted user by similarity
     * @return the jobs sorted by recommendation
     */
    private List<Job> generateRecommendedJobs(List<User> similarUsers) {
        // Set to hold the IDs of added jobs
        Set<String> addedJobIds = new HashSet<>();
        List<Job> recommendedJobs = new ArrayList<>();

        // Implement logic to generate recommendations based on other users' interactions with jobs
        // Iterate through each similar user and add the jobs they applied to the referral list
        for (User user : similarUsers) {
            List<Application> userAppliedJobs = applicationRepository.findApplicationsForCandidate(user.getUserId());
            for (Application application : userAppliedJobs) {
                Job job = application.getJob();
                // Checks if the job ID has already been added to the set of added IDs
                if (!addedJobIds.contains(job.getJobId())) {
                    recommendedJobs.add(job);
                    addedJobIds.add(job.getJobId());
                }
            }
        }

        // Find all jobs that are not covered by similar users
        List<Job> allJobs = jobRepository.findAll();
        List<Job> uncoveredJobs = new ArrayList<>();
        for (Job job : allJobs) {
            if (!addedJobIds.contains(job.getJobId())) {
                uncoveredJobs.add(job);
            }
        }

        // Sort uncovered jobs by the number of applications and reviews
        uncoveredJobs.sort((job1, job2) -> {
            Integer applications1 = applicationRepository.findNrOfApplicationForJob(job1.getJobId());
            Integer applications2 = applicationRepository.findNrOfApplicationForJob(job2.getJobId());
            Double rating1 = reviewRepository.getAvgGradeForEmployer(job1.getEmployer().getEmployerId());
            Double rating2 = reviewRepository.getAvgGradeForEmployer(job2.getEmployer().getEmployerId());
            // Sort in descending order of number of applications
            if (!Objects.equals(applications1, applications2)) {
                return Integer.compare(applications2, applications1);
            }
            // If the number of apps is the same, sort in descending order of average reviews
            return Double.compare(rating2, rating1);
        });

        // Add uncovered jobs to recommended jobs list
        recommendedJobs.addAll(uncoveredJobs);

        return recommendedJobs;
    }

    /**
     *  Generate initial recommendations based on company reviews
     *  and the number of applications received for each job
     */
    private List<Job> generateInitialRecommendations() {
        // Calculate the nr of applications for each job
        Map<Job, Integer> jobApplications = calculateJobApplications();
        // Calculate the average of reviews for each company
        Map<Employer, Double> companyRatings = calculateCompanyRatings();

        // Sort jobs by number of applications received and average reviews for each company
        return sortJobsByApplicationsAndRatings(jobApplications, companyRatings);
    }

    /**
     * Sort jobs by number of applications received and average reviews for each company
     * @param jobApplications applications received
     * @param companyRatings average reviews
     * @return sorted jobs
     */
    private List<Job> sortJobsByApplicationsAndRatings(Map<Job, Integer> jobApplications, Map<Employer, Double> companyRatings) {
        List<Job> sortedJobs = new ArrayList<>(jobApplications.keySet());

        sortedJobs.sort((job1, job2) -> {
            Integer applications1 = jobApplications.get(job1);
            Integer applications2 = jobApplications.get(job2);
            Double rating1 = companyRatings.get(job1.getEmployer());
            Double rating2 = companyRatings.get(job2.getEmployer());

            // Sort in descending order of number of applications
            if (!Objects.equals(applications1, applications2)) {
                return Integer.compare(applications2, applications1);
            }

            // If the number of apps is the same, sort in descending order of average reviews
            return Double.compare(rating2, rating1);
        });

        return sortedJobs;
    }

    /**
     * Calculate the number of applications per job
     * @return a map with jobs as keys and number of applications as value
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
     * Calculate the average of reviews grade for each company
     * @return a map with employers as keys and grade average as value
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
     *  Return true if the user doesn't have application and false otherwise
     */
    private boolean checkIfUserHasApplications(String userId){
        List<Application> applications = applicationRepository.findApplicationsForCandidate(userId);
        return applications.isEmpty();
    }
}
