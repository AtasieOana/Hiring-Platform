package com.hiringPlatform.common.service;

import com.hiringPlatform.common.model.Candidate;
import com.hiringPlatform.common.model.Role;
import com.hiringPlatform.common.model.User;
import com.hiringPlatform.common.repository.CandidateRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class CandidateServiceTest {

    @InjectMocks
    CandidateService candidateService;

    @Mock
    CandidateRepository candidateRepository;

    @Test
    public void testGetCandidatePresent() {
        // Given
        Candidate candidate = buildCandidate();

        // When
        when(candidateRepository.findById(anyString())).thenReturn(Optional.of(candidate));

        // Then
        Candidate result = candidateService.getCandidate("testId");
        assertEquals(result, candidate);
    }

    @Test
    public void testGetCandidateNotPresent() {
        // When
        when(candidateRepository.findById(anyString())).thenReturn(Optional.empty());

        // Then
        Candidate result = candidateService.getCandidate("testId");
        assertNull(result);
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

}
