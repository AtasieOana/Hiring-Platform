package com.hiringPlatform.authentication.service;

import com.hiringPlatform.authentication.model.Admin;
import com.hiringPlatform.authentication.model.Candidate;
import com.hiringPlatform.authentication.model.Role;
import com.hiringPlatform.authentication.model.User;
import com.hiringPlatform.authentication.repository.AdminRepository;
import com.hiringPlatform.authentication.repository.CandidateRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Date;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class CandidateServiceTest {

    @InjectMocks
    CandidateService candidateService;

    @Mock
    CandidateRepository candidateRepository;

    @Test
    public void testSaveCandidate() {
        // Given
        Candidate candidate = new Candidate();
        User user = new User();
        user.setUserId("testUserId");
        user.setEmail("test@example.com");
        String lastname = "Doe";
        String firstname = "John";
        candidate.setUserDetails(user);
        candidate.setFirstname(firstname);
        candidate.setLastname(lastname);
        candidate.setCandidateId("testUserId");

        // When
        when(candidateRepository.save(candidate)).thenReturn(candidate);

        // Then
        candidateService.saveCandidate(user, lastname, firstname);

        // Checks that the save method was called with an appropriate Candidate object
        ArgumentCaptor<Candidate> candidateCaptor = ArgumentCaptor.forClass(Candidate.class);
        verify(candidateRepository).save(candidateCaptor.capture());

        // Checks that the captured Candidate object has the correct values set
        Candidate capturedCandidate = candidateCaptor.getValue();
        assertEquals("testUserId", capturedCandidate.getCandidateId());
        assertEquals(user, capturedCandidate.getUserDetails());
        assertEquals("Doe", capturedCandidate.getLastname());
        assertEquals("John", capturedCandidate.getFirstname());
    }

}
