package com.hiringPlatform.employer.controller.IntegrationTests;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hiringPlatform.employer.controller.StageController;
import com.hiringPlatform.employer.model.Stage;
import com.hiringPlatform.employer.security.JwtService;
import com.hiringPlatform.employer.service.RedisService;
import com.hiringPlatform.employer.service.StageService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.web.servlet.MockMvc;

import java.util.ArrayList;
import java.util.List;

import static org.mockito.Mockito.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
@WebMvcTest(controllers = StageController.class)
@ContextConfiguration(classes = {JwtService.class, RedisService.class})
@WithMockUser
@ActiveProfiles("test")
@Import(StageController.class)
public class StageControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    StageService stageService;

    @MockBean
    JwtService jwtService;

    @MockBean
    RedisService redisService;

    @Test
    public void testGetAllStages() throws Exception {
        // Given
        Stage stage = buildStage();
        List<Stage> stages = new ArrayList<>();
        stages.add(stage);

        // When
        when(stageService.getAllStages()).thenReturn(stages);

        // Then
        mockMvc.perform(get("/getAllStages"))
                .andExpect(status().isOk())
                .andExpect(content().string(objectMapper.writeValueAsString(stages)));
    }

    @Test
    public void testGetStagesForJob() throws Exception {
        // Given
        Stage stage = buildStage();
        List<Stage> stages = new ArrayList<>();
        stages.add(stage);

        // When
        when(stageService.getStagesForJob(anyString())).thenReturn(stages);

        // Then
        mockMvc.perform(get("/getStagesForJob/1" ))
                .andExpect(status().isOk())
                .andExpect(content().string(objectMapper.writeValueAsString(stages)));
    }

    private Stage buildStage(){
        Stage stage = new Stage();
        stage.setStageId("1");
        stage.setStageName("test");
        return stage;
    }

}
