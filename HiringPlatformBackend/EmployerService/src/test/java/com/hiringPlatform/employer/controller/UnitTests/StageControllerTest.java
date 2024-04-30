package com.hiringPlatform.employer.controller.UnitTests;

import com.hiringPlatform.employer.controller.StageController;
import com.hiringPlatform.employer.model.Stage;
import com.hiringPlatform.employer.service.StageService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class StageControllerTest {

    @InjectMocks
    StageController stageController;
    @Mock
    StageService stageService;

    @Test
    public void testGetAllStages() {
        // Given
        Stage stage = buildStage();
        List<Stage> stages = new ArrayList<>();
        stages.add(stage);

        // When
        when(stageService.getAllStages()).thenReturn(stages);

        // Then
        ResponseEntity<List<Stage>> result = stageController.getAllStages();
        assertEquals(result.getBody(), stages);
        assertEquals(result.getStatusCode(), HttpStatus.OK);
    }

    @Test
    public void testGetStagesForJob() {
        // Given
        Stage stage = buildStage();
        List<Stage> stages = new ArrayList<>();
        stages.add(stage);

        // When
        when(stageService.getStagesForJob(anyString())).thenReturn(stages);

        // Then
        ResponseEntity<List<Stage>> result = stageController.getStagesForJob("1");
        assertEquals(result.getBody(), stages);
        assertEquals(result.getStatusCode(), HttpStatus.OK);
    }

    private Stage buildStage(){
        Stage stage = new Stage();
        stage.setStageId("1");
        stage.setStageName("test");
        return stage;
    }

}
