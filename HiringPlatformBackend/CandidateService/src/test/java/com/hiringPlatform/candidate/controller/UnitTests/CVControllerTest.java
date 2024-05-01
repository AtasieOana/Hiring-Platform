package com.hiringPlatform.candidate.controller.UnitTests;


import com.hiringPlatform.candidate.controller.CVController;
import com.hiringPlatform.candidate.model.request.CVRequest;
import com.hiringPlatform.candidate.model.response.CVResponse;
import com.hiringPlatform.candidate.service.CVService;
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
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class CVControllerTest {

    @InjectMocks
    CVController cvController;

    @Mock
    CVService cvService;

    @Test
    public void testGetAllCvsForCandidate() {
        // Given
        CVResponse cvResponse = buildCVResponse();
        List<CVResponse> cvResponses = new ArrayList<>();
        cvResponses.add(cvResponse);

        // When
        when(cvService.getAllCvsForCandidate(anyString())).thenReturn(cvResponses);

        // Then
        ResponseEntity<List<CVResponse>> result = cvController.getCvListForCandidate("1");
        assertEquals(result.getBody(), cvResponses);
        assertEquals(result.getStatusCode(), HttpStatus.OK);
    }

    @Test
    public void testAddCV() {
        // Given
        CVResponse cvResponse = buildCVResponse();
        List<CVResponse> cvResponses = new ArrayList<>();
        cvResponses.add(cvResponse);
        CVRequest request = new CVRequest("name", "1");

        // When
        when(cvService.addCV(anyString(), anyString())).thenReturn(cvResponses);

        // Then
        ResponseEntity<List<CVResponse>> result = cvController.addCV(request);
        assertEquals(result.getBody(), cvResponses);
        assertEquals(result.getStatusCode(), HttpStatus.OK);
    }

    @Test
    public void testDeleteCV() {
        // Given
        CVResponse cvResponse = buildCVResponse();
        List<CVResponse> cvResponses = new ArrayList<>();
        cvResponses.add(cvResponse);

        // When
        when(cvService.deleteCv(anyString())).thenReturn(cvResponses);

        // Then
        ResponseEntity<List<CVResponse>> result = cvController.deleteCv( "1");
        assertEquals(result.getBody(), cvResponses);
        assertEquals(result.getStatusCode(), HttpStatus.OK);
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
