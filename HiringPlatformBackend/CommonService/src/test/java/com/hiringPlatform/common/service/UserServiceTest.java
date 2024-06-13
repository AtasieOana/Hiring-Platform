package com.hiringPlatform.common.service;

import com.hiringPlatform.common.model.CV;
import com.hiringPlatform.common.model.Candidate;
import com.hiringPlatform.common.model.User;
import com.hiringPlatform.common.model.Role;
import com.hiringPlatform.common.model.response.GetLoggedUserResponse;
import com.hiringPlatform.common.repository.CVRepository;
import com.hiringPlatform.common.repository.CandidateRepository;
import com.hiringPlatform.common.repository.UserRepository;
import com.hiringPlatform.common.security.JwtService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.*;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @InjectMocks
    UserService userService;

    @Mock
    UserRepository userRepository;

    @Mock
    CandidateRepository candidateRepository;

    @Mock
    JwtService jwtService;

    @Mock
    RedisService redisService;

    @Mock
    CVRepository cvRepository;

    @Test
    public void testGetUserPresent() {
        // Given
        User user = buildUser();

        // When
        when(userRepository.findById(anyString())).thenReturn(Optional.of(user));

        // Then
        User result = userService.getUser("testId");
        assertEquals(result, user);
    }

    @Test
    public void testGetUserNotPresent() {
        // When
        when(userRepository.findById(anyString())).thenReturn(Optional.empty());

        // Then
        User result = userService.getUser("testId");
        assertNull(result);
    }

    @Test
    public void testGetLoggedUser() {
        // Given
        Candidate candidate = buildCandidate();

        // When
        when(redisService.getData("userEmail")).thenReturn("test@example.com");
        when(redisService.getData("userToken")).thenReturn("token");
        when(candidateRepository.findByEmail(candidate.getUserDetails().getEmail())).thenReturn(Optional.of(candidate));
        when(cvRepository.findCVsByEmail(candidate.getUserDetails().getEmail())).thenReturn(List.of(new CV()));
        when(jwtService.isTokenExpired(anyString())).thenReturn(false);

        // Then
        GetLoggedUserResponse result = userService.getLoggedUser();
        assertEquals(result, buildGetLoggedUserResponse());
    }

    @Test
    public void testGetLoggedUserRedisNotPresent() {
        // When
        when(redisService.getData("userEmail")).thenReturn(null);

        // Then
        GetLoggedUserResponse result = userService.getLoggedUser();
        assertNull(result);
    }

    @Test
    public void testGetLoggedUserCandidateNotPresent() {
        // Given
        Candidate candidate = buildCandidate();

        // When
        when(redisService.getData("userEmail")).thenReturn("test@example.com");
        when(redisService.getData("userToken")).thenReturn("token");
        when(candidateRepository.findByEmail(candidate.getUserDetails().getEmail())).thenReturn(Optional.empty());

        // Then
        GetLoggedUserResponse result = userService.getLoggedUser();
        assertNull(result);
    }

    @Test
    public void testGetLoggedUserTokenExpired() {
        // Given
        Candidate candidate = buildCandidate();

        // When
        when(redisService.getData("userEmail")).thenReturn("test@example.com");
        when(redisService.getData("userToken")).thenReturn("token");
        when(candidateRepository.findByEmail(candidate.getUserDetails().getEmail())).thenReturn(Optional.of(candidate));
        when(jwtService.isTokenExpired(anyString())).thenReturn(true);

        // Then
        GetLoggedUserResponse result = userService.getLoggedUser();
        assertNull(result);
    }


    private User buildUser(){
        User user = new User();
        user.setUserId("1");
        user.setEmail("test@example.com");
        user.setPassword("testPassword");
        Role role = new Role("1", "ROLE_CANDIDATE", "description");
        user.setUserRole(role);
        return user;
    }

    private Candidate buildCandidate(){
        Candidate candidate = new Candidate();
        User user = new User();
        user.setUserId("1");
        user.setEmail("test@example.com");
        user.setPassword("testPassword");
        Role role = new Role("1", "ROLE_EMPLOYER", "description");
        user.setUserRole(role);
        user.setAccountEnabled(1);
        candidate.setUserDetails(user);
        candidate.setFirstname("test");
        candidate.setLastname("test");
        candidate.setCandidateId("1");
        return candidate;
    }

    private GetLoggedUserResponse buildGetLoggedUserResponse(){
        GetLoggedUserResponse response = new GetLoggedUserResponse();
        response.setHasCv(true);
        response.setToken("token");
        response.setCandidate(buildCandidate());
        return response;
    }

}
