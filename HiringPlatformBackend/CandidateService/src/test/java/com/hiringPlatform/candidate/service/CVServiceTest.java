package com.hiringPlatform.candidate.service;


import com.hiringPlatform.candidate.model.CV;
import com.hiringPlatform.candidate.model.Candidate;
import com.hiringPlatform.candidate.model.Role;
import com.hiringPlatform.candidate.model.User;
import com.hiringPlatform.candidate.model.response.CVResponse;
import com.hiringPlatform.candidate.repository.CVRepository;
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
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class CVServiceTest {

    @InjectMocks
    CVService cvService;

    @Mock
    CVRepository cvRepository;

    @Mock
    CandidateService candidateService;

    @Test
    public void testGetAllCvsForCandidate() {
        // Given
        CV cv = buildCV();
        ArrayList<CV> cvs = new ArrayList<>();
        cvs.add(cv);
        CVResponse cvResponse = buildCVResponse();
        List<CVResponse> cvResponses = new ArrayList<>();
        cvResponses.add(cvResponse);

        // When
        when(cvRepository.findCVsForCandidate(anyString())).thenReturn(cvs);

        // Then
        List<CVResponse> result = cvService.getAllCvsForCandidate("1");
        assertEquals(result, cvResponses);
    }

    @Test
    public void testHasCV() {
        // Given
        CV cv = buildCV();
        ArrayList<CV> cvs = new ArrayList<>();
        cvs.add(cv);

        // When
        when(cvRepository.findCVsByEmail(anyString())).thenReturn(cvs);

        // Then
        Boolean result = cvService.hasCv("1");
        assertEquals(result, true);
    }

    @Test
    public void testAddCV() {
        // Given
        Candidate candidate = buildCandidate();
        CV cv = buildCV();
        ArrayList<CV> cvs = new ArrayList<>();
        cvs.add(cv);
        CVResponse cvResponse = buildCVResponse();
        List<CVResponse> cvResponses = new ArrayList<>();
        cvResponses.add(cvResponse);

        // When
        when(candidateService.getCandidateById(anyString())).thenReturn(candidate);
        when(cvRepository.save(any(CV.class))).thenReturn(cv);
        when(cvRepository.findCVsForCandidate(anyString())).thenReturn(cvs);

        // Then
        List<CVResponse> result = cvService.addCV("test", "1");
        assertEquals(result, cvResponses);
    }

    @Test
    public void testGetCV() {
        // Given
        CV cv = buildCV();
        ArrayList<CV> cvs = new ArrayList<>();
        cvs.add(cv);
        CVResponse cvResponse = buildCVResponse();
        List<CVResponse> cvResponses = new ArrayList<>();
        cvResponses.add(cvResponse);

        // When
        when(cvRepository.findById(anyString())).thenReturn(Optional.of(cv));
        when(cvRepository.findCVsForCandidate(anyString())).thenReturn(cvs);

        // Then
        List<CVResponse> result = cvService.deleteCv( "1");
        assertEquals(result, cvResponses);
    }

    @Test
    public void testGetCVNotPresent() {
        // Given
        List<CVResponse> cvResponses = new ArrayList<>();

        // When
        when(cvRepository.findById(anyString())).thenReturn(Optional.empty());

        // Then
        List<CVResponse> result = cvService.deleteCv( "1");
        assertEquals(result, cvResponses);
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

    private CV buildCV(){
        CV cv = new CV();
        cv.setCandidate(buildCandidate());
        cv.setCvName("test");
        cv.setCvId("1");
        cv.setUploadDate(new Date(2000));
        return cv;
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
