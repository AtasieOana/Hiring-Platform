package com.hiringPlatform.employer.service;

import com.hiringPlatform.employer.model.*;
import com.hiringPlatform.employer.model.key.ContainsId;
import com.hiringPlatform.employer.model.request.StageHelperRequest;
import com.hiringPlatform.employer.repository.ContainsRepository;
import com.hiringPlatform.employer.repository.StageRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class StageServiceTest {

    @InjectMocks
    StageService stageService;
    @Mock
    StageRepository stageRepository;
    @Mock
    ContainsRepository containsRepository;


    @Test
    public void testSaveStageIfNotExistPresent() {
        // Given
        Stage stage = buildStage();

        // When
        when(stageRepository.findByStageName(anyString())).thenReturn(Optional.of(stage));

        // Then
        Stage result = stageService.saveStageIfNotExist("test");
        assertEquals(result, stage);
    }

    @Test
    public void testSaveStageIfNotExist() {
        // Given
        Stage stage = buildStage();

        // When
        when(stageRepository.findByStageName(anyString())).thenReturn(Optional.empty());
        when(stageRepository.save(any(Stage.class))).thenReturn(stage);

        // Then
        Stage result = stageService.saveStageIfNotExist("test");
        assertEquals(result, stage);
    }

    @Test
    public void testAssociateStageWithJob() {
        // Given
        StageHelperRequest stageHelperRequest = buildStageHelperRequest();
        List<StageHelperRequest> stageHelperRequests = new ArrayList<>();
        stageHelperRequests.add(stageHelperRequest);
        Stage stage = buildStage();
        Contains contains = buildContains();

        // When
        when(stageRepository.findByStageName(anyString())).thenReturn(Optional.empty());
        when(stageRepository.save(any(Stage.class))).thenReturn(stage);
        when(containsRepository.save(any(Contains.class))).thenReturn(contains);

        // Then
        stageService.associateStageWithJob(stageHelperRequests, buildJob());

        verify(containsRepository, times(1)).save(any(Contains.class));
    }

    @Test
    public void testGetAllStages() {
        // Given
        Stage stage = buildStage();
        List<Stage> stages = new ArrayList<>();
        stages.add(stage);

        // When
        when(stageRepository.findAll()).thenReturn(stages);

        // Then
        List<Stage> result = stageService.getAllStages();
        assertEquals(result, stages);
    }

    @Test
    public void testGetAllStagesForJob() {
        // Given
        StageHelperRequest stageHelperRequest = buildStageHelperRequest();
        List<StageHelperRequest> stageHelperRequests = new ArrayList<>();
        stageHelperRequests.add(stageHelperRequest);
        Contains contains = buildContains();
        List<Contains> containsList = new ArrayList<>();
        containsList.add(contains);

        // When
        when(containsRepository.findAllByJobId(anyString())).thenReturn(containsList);

        // Then
        List<StageHelperRequest> result = stageService.getAllStagesForJob("1");
        assertEquals(result, stageHelperRequests);
    }

    @Test
    public void testGetStagesForJob() {
        // Given
        Stage stage = buildStage();
        List<Stage> stages = new ArrayList<>();
        stages.add(stage);
        Contains contains = buildContains();
        List<Contains> containsList = new ArrayList<>();
        containsList.add(contains);

        // When
        when(containsRepository.findAllByJobId(anyString())).thenReturn(containsList);

        // Then
        List<Stage> result = stageService.getStagesForJob("1");
        assertEquals(result, stages);
    }

    @Test
    public void testGetCurrentStageForApplication() {
        // Given
        Contains contains = buildContains();

        // When
        when(containsRepository.findByJobIdAndStageId(anyString(), anyString())).thenReturn(Optional.of(contains));

        // Then
        Contains result = stageService.getCurrentStageForApplication("1", "1");
        assertEquals(result, contains);
    }

    @Test
    public void testGetCurrentStageForApplicationNotPresent() {
        // When
        when(containsRepository.findByJobIdAndStageId(anyString(), anyString())).thenReturn(Optional.empty());

        // Then
        Contains result = stageService.getCurrentStageForApplication("1", "1");
        assertNull(result);
    }

    @Test
    public void testGetAllContainsForJob() {
        // Given
        Contains contains = buildContains();
        List<Contains> containsList = new ArrayList<>();
        containsList.add(contains);

        // When
        when(containsRepository.findAllByJobId(anyString())).thenReturn(containsList);

        // Then
        List<Contains> result = stageService.getAllContainsForJob("1");
        assertEquals(result, containsList);
    }

    private Stage buildStage(){
        Stage stage = new Stage();
        stage.setStageId("1");
        stage.setStageName("test");
        return stage;
    }

    private StageHelperRequest buildStageHelperRequest(){
        return new StageHelperRequest("test", 1);
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
}
