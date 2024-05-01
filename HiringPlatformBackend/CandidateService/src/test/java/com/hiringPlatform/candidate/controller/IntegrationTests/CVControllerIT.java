package com.hiringPlatform.candidate.controller.IntegrationTests;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.hiringPlatform.candidate.controller.CVController;
import com.hiringPlatform.candidate.model.request.CVRequest;
import com.hiringPlatform.candidate.model.response.CVResponse;
import com.hiringPlatform.candidate.security.JwtService;
import com.hiringPlatform.candidate.service.CVService;
import com.hiringPlatform.candidate.service.RedisService;
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

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
@WebMvcTest(controllers = CVController.class)
@ContextConfiguration(classes = {JwtService.class, RedisService.class})
@WithMockUser
@ActiveProfiles("test")
@Import(CVController.class)
public class CVControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    CVService cvService;

    @MockBean
    JwtService jwtService;

    @MockBean
    RedisService redisService;

    @Test
    public void testGetAllCvsForCandidate() throws Exception {
        // Given
        CVResponse cvResponse = buildCVResponse();
        List<CVResponse> cvResponses = new ArrayList<>();
        cvResponses.add(cvResponse);

        // When
        when(cvService.getAllCvsForCandidate(anyString())).thenReturn(cvResponses);

        // Then
        mockMvc.perform(get("/getCvListForCandidate/1"))
                .andExpect(status().isOk())
                .andExpect(content().string(objectMapper.writeValueAsString(cvResponses)));
    }

    @Test
    public void testAddCV() throws Exception {
        // Given
        CVResponse cvResponse = buildCVResponse();
        List<CVResponse> cvResponses = new ArrayList<>();
        cvResponses.add(cvResponse);
        CVRequest request = new CVRequest("name", "1");

        // When
        when(cvService.addCV(anyString(), anyString())).thenReturn(cvResponses);

        // Then
        mockMvc.perform(post("/addCV").contentType("application/json")
                        .content(objectMapper.writeValueAsString(request)).with(csrf()))
                .andExpect(status().isOk())
                .andExpect(content().string(objectMapper.writeValueAsString(cvResponses)));
    }

    @Test
    public void testDeleteCV() throws Exception {
        // Given
        CVResponse cvResponse = buildCVResponse();
        List<CVResponse> cvResponses = new ArrayList<>();
        cvResponses.add(cvResponse);

        // When
        when(cvService.deleteCv(anyString())).thenReturn(cvResponses);

        // Then
        mockMvc.perform(post("/deleteCv/1").with(csrf()))
                .andExpect(status().isOk())
                .andExpect(content().string(objectMapper.writeValueAsString(cvResponses)));
    }

    private CVResponse buildCVResponse(){
        CVResponse response = new CVResponse();
        String lastname = "test";
        String firstname = "test";
        response.setCvName("test");
        response.setCvId("1");
        response.setUploadDate("1970-01-01 02:00:02");
        response.setCandidateFirstname(firstname);
        response.setCandidateLastname(lastname);
        response.setCandidateEmail("test@example.com");
        return response;
    }

}
