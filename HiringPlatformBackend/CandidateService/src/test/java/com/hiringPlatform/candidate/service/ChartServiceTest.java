package com.hiringPlatform.candidate.service;


import com.hiringPlatform.candidate.model.*;
import com.hiringPlatform.candidate.model.key.ApplicationId;
import com.hiringPlatform.candidate.model.key.ContainsId;
import com.hiringPlatform.candidate.repository.ApplicationRepository;
import com.hiringPlatform.candidate.repository.JobRepository;
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
import static org.mockito.ArgumentMatchers.anyString;
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
    StageService stageService;

    @Test
    public void testGetJobsPublishedPerDayInCurrentYear() {
        Job job = buildJob();
        List<Job> jobs = new ArrayList<>();
        jobs.add(job);
        Map<String, Integer> jobCountMap = new HashMap<>();
        Instant instant = job.getPostingDate().toInstant();
        LocalDate localDate = instant.atZone(ZoneId.systemDefault()).toLocalDate();
        String formattedDate = localDate.toString();
        jobCountMap.put(formattedDate, 1);

        // When
        when(jobRepository.findAll()).thenReturn(jobs);

        // Then
        Map<String, Integer> result = chartService.getJobsPublishedPerDayInCurrentYear();
        assertEquals(result, jobCountMap);
    }

    @Test
    public void testGetApplicationStatusNumbers() {
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
        when(applicationRepository.findApplicationsForCandidate(anyString())).thenReturn(applications);

        // Then
        Map<String, Integer> result = chartService.getApplicationStatusNumbers("1");
        assertEquals(result, percentageMap);
    }

    @Test
    public void testGetApplicationViewedNumbers() {
        // Given
        Application application1 = buildApplication();
        Application application2 = buildApplicationStageNotSeen();
        List<Application> applications = new ArrayList<>();
        applications.add(application1);
        applications.add(application2);
        Map<String, Double> percentageMap = new HashMap<>();
        percentageMap.put("vazut", ((double) 1 / 2) * 100);
        percentageMap.put("nevazut", ((double) 1 / 2) * 100);

        // When
        when(applicationRepository.findApplicationsForCandidate(anyString())).thenReturn(applications);
        when(stageService.getCurrentStageForApplication("1", "1")).thenReturn(buildContains());
        when(stageService.getCurrentStageForApplication("2", "2")).thenReturn(buildContainsNotSeen());

        // Then
        Map<String, Double> result = chartService.getApplicationViewedNumbers("1");
        assertEquals(result, percentageMap);
    }

    private Application buildApplication(){
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

    private Application buildApplicationStageNotSeen(){
        Application object = new Application();
        ApplicationId applicationId = new ApplicationId();
        applicationId.setCandidate(buildCandidate());
        applicationId.setCv(new CV("1", "test", new Date(2000), buildCandidate()));
        applicationId.setJob(buildJobStageNotSeen());
        object.setApplicationId(applicationId);
        object.setStatus("in_curs");
        object.setApplicationDate(new Date(2000));
        object.setRefusalReason("");
        object.setStage(new Stage("2", "test2"));
        return object;
    }

    private Candidate buildCandidate(){
        Candidate candidate = new Candidate();
        User user = new User();
        user.setUserId("1");
        user.setEmail("test@example.com");
        user.setPassword("testPassword");
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
        job.setStatus("test");
        job.setContractType("test");
        job.setExperience("test");
        job.setPostingDate(new Date(2000));
        job.setIndustry("test");
        job.setEmploymentRegime("test");
        job.setWorkMode("test");
        job.setCity(buildCity());
        job.setEmployer(buildEmployer());
        return job;
    }

    private Job buildJobStageNotSeen(){
        Job job = new Job();
        job.setJobId("2");
        job.setDescription("test");
        job.setTitle("test");
        job.setStatus("test");
        job.setContractType("test");
        job.setExperience("test");
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

    private Contains buildContains(){
        Contains object = new Contains();
        ContainsId containsId = new ContainsId();
        containsId.setJob(buildJob());
        containsId.setStage(new Stage("1", "test"));
        object.setContainsId(containsId);
        object.setStageNr(1);
        return object;
    }

    private Contains buildContainsNotSeen(){
        Contains object = new Contains();
        ContainsId containsId = new ContainsId();
        containsId.setJob(buildJob());
        containsId.setStage(new Stage("0", "test2"));
        object.setContainsId(containsId);
        object.setStageNr(0);
        return object;
    }
}
