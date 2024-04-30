package com.hiringPlatform.admin.service;


import com.hiringPlatform.admin.model.*;
import com.hiringPlatform.admin.model.key.ApplicationId;
import com.hiringPlatform.admin.model.response.OverviewResponse;
import com.hiringPlatform.admin.repository.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class ChartServiceTest {

    @InjectMocks
    ChartService chartService;

    @Mock
    JobRepository jobRepository;

    @Mock
    ApplicationRepository applicationRepository;

    @Mock
    UserRepository userRepository;

    @Mock
    CandidateRepository candidateRepository;

    @Mock
    EmployerRepository employerRepository;

    @Mock
    AdminRepository adminRepository;

    @Test
    public void testGetJobCategoryDistribution() {
        Job job = buildJob();
        List<Job> jobs = new ArrayList<>();
        jobs.add(job);
        Map<String, Integer> distribution = new HashMap<>();
        distribution.put(job.getIndustry(), 1);

        // When
        when(jobRepository.findAll()).thenReturn(jobs);

        // Then
        Map<String, Integer> result = chartService.getJobCategoryDistribution();
        assertEquals(result, distribution);
    }

    @Test
    public void testGetApplicationStatusPercentage() {
        // Given
        Application application1 = buildApplication();
        Application application2 = buildApplication();
        application2.setStatus("finalizat");
        Application application3 = buildApplication();
        application3.setStatus("refuzat");
        List<Application> applications = new ArrayList<>();
        applications.add(application1);
        applications.add(application2);
        applications.add(application3);
        Map<String, Integer> percentageMap = new HashMap<>();
        percentageMap.put("finalizat", 1);
        percentageMap.put("refuzat", 1);
        percentageMap.put("in_curs", 1);

        // When
        when(applicationRepository.findAll()).thenReturn(applications);

        // Then
        Map<String, Integer> result = chartService.getApplicationStatusPercentage();
        assertEquals(result, percentageMap);
    }

    @Test
    public void testGetApplicationsPerDate() {
        Application application = buildApplication();
        List<Application> applications = new ArrayList<>();
        applications.add(application);
        Map<String, Integer> applicationsByDate = new HashMap<>();
        Instant instant = application.getApplicationDate().toInstant();
        LocalDate localDate = instant.atZone(ZoneId.systemDefault()).toLocalDate();
        String formattedDate = localDate.toString();
        applicationsByDate.put(formattedDate, 1);

        // When
        when(applicationRepository.findAll()).thenReturn(applications);

        // Then
        Map<String, Integer> result = chartService.getApplicationsPerDate();
        assertEquals(result, applicationsByDate);
    }

    @Test
    public void testGetJobsExperiencePercentage() {
        // Given
        Job job1 = buildJob();
        Job job2 = buildJob();
        job2.setExperience("Junior");
        Job job3 = buildJob();
        job3.setExperience("Intermediar");
        List<Job> jobs = new ArrayList<>();
        jobs.add(job1);
        jobs.add(job2);
        jobs.add(job3);
        Map<String, Double> percentageMap = new HashMap<>();
        percentageMap.put("Junior", ((double) 1/3)*100);
        percentageMap.put("Intermediar", ((double) 1/3)*100);
        percentageMap.put("Entry-Level", ((double) 1/3)*100);

        // When
        when(jobRepository.findAll()).thenReturn(jobs);

        // Then
        Map<String, Double> result = chartService.getJobsExperiencePercentage();
        assertEquals(result.get("Junior"), percentageMap.get("Junior"));
        assertEquals(result.get("Intermediar"), percentageMap.get("Intermediar"));
        assertEquals(result.get("Entry-Level"), percentageMap.get("Entry-Level"));
    }

    @Test
    public void testGetAccountCreationTrend() {
        // Given
        User user = buildCandidate().getUserDetails();
        List<User> userList = List.of(user);
        Map<String, Map<String, Long>> response = new HashMap<>();
        Map<String, Long> responseValue = new HashMap<>();
        LocalDate registrationDate = user.getRegistrationDate().toInstant()
                .atZone(ZoneId.systemDefault()).toLocalDate();
        String formattedDate = registrationDate.toString();
        responseValue.put(formattedDate, 1L);
        response.put("ROLE_CANDIDATE", responseValue);

        // When
        when(userRepository.findAll()).thenReturn(userList);

        // Then
        Map<String, Map<String, Long>> result = chartService.getAccountCreationTrend();
        assertEquals(result, response);
    }

    @Test
    public void testGetTopEmployersWithApplications() {
        // Given
        List<Object[]> testData = new ArrayList<>();
        testData.add(new Object[]{"Company A", 10});
        testData.add(new Object[]{"Company B", 8});
        testData.add(new Object[]{"Company C", 8});
        testData.add(new Object[]{"Company D", 5});

        // When
        when(applicationRepository.findEmployersWithApplicationsCount()).thenReturn(testData);

        // Then
        Map<String, Integer> result = chartService.getTopEmployersWithApplications();

        // Verify results
        assertEquals(3, result.size());
        assertEquals(10, result.get("Company A").intValue());
        assertEquals(8, result.get("Company B").intValue());
        assertEquals(8, result.get("Company C").intValue());
    }

    @Test
    public void testGetOverview() {
        // Given
        OverviewResponse overviewResponse = new OverviewResponse();
        overviewResponse.setNumberOfJobs(1);
        overviewResponse.setNumberOfEmployers(1);
        overviewResponse.setNumberOfCandidates(1);
        overviewResponse.setNumberOfAdmins(0);
        overviewResponse.setNumberOfApplications(1);

        // When
        when(jobRepository.findAll()).thenReturn(List.of(buildJob()));
        when(applicationRepository.findAll()).thenReturn(List.of(buildApplication()));
        when(candidateRepository.findAll()).thenReturn(List.of(buildCandidate()));
        when(employerRepository.findAll()).thenReturn(List.of(buildEmployer()));
        when(adminRepository.findAll()).thenReturn(new ArrayList<>());

        // Then
        OverviewResponse result = chartService.getOverview();
        assertEquals(result, overviewResponse);
        }

    private Application buildApplication() {
        Application object = new Application();
        ApplicationId applicationId = new ApplicationId();
        applicationId.setCandidate(buildCandidate());
        applicationId.setCv(new CV("1", "test", new Date(2000), buildCandidate()));
        applicationId.setJob(buildJob());
        object.setApplicationId(applicationId);
        object.setStatus("in_curs");
        object.setApplicationDate(new Date(2000));
        object.setRefusalReason("");
        object.setStage(new Stage("1", "test"));
        return object;
    }

    private Candidate buildCandidate(){
        Candidate candidate = new Candidate();
        User user = new User();
        user.setUserId("1");
        user.setEmail("test@example.com");
        user.setPassword("testPassword");
        user.setRegistrationDate(new Date(2000));
        Role role = new Role("1", "ROLE_CANDIDATE", "description");
        user.setUserRole(role);
        String lastname = "test";
        String firstname = "test";
        candidate.setUserDetails(user);
        candidate.setFirstname(firstname);
        candidate.setLastname(lastname);
        candidate.setCandidateId("1");
        return candidate;
    }

    private Job buildJob(){
        Job job = new Job();
        job.setJobId("1");
        job.setDescription("test");
        job.setTitle("test");
        job.setContractType("test");
        job.setExperience("Entry-Level");
        job.setPostingDate(new Date(2000));
        job.setIndustry("test");
        job.setEmploymentRegime("test");
        job.setWorkMode("test");
        job.setCity(buildCity());
        job.setEmployer(buildEmployer());
        return job;
    }

    private Region buildRegion(){
        Region region = new Region();
        region.setRegionId("1");
        region.setRegionName("regionName");
        return region;
    }

    private City buildCity(){
        City city = new City();
        city.setCityId("1");
        city.setCityName("cityName");
        city.setRegion(buildRegion());
        return city;
    }

    private Employer buildEmployer(){
        Employer employer = new Employer();
        User user = new User();
        user.setUserId("1");
        user.setEmail("test@example.com");
        user.setPassword("testPassword");
        Role role = new Role("1", "ROLE_EMPLOYER", "description");
        user.setUserRole(role);
        user.setAccountEnabled(1);
        employer.setUserDetails(user);
        employer.setCompanyName("test");
        employer.setEmployerId("1");
        return employer;
    }
}
