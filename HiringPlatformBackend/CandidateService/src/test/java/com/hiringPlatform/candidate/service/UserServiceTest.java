package com.hiringPlatform.candidate.service;

import com.hiringPlatform.candidate.model.Candidate;
import com.hiringPlatform.candidate.model.Role;
import com.hiringPlatform.candidate.model.User;
import com.hiringPlatform.candidate.model.request.UpdateCandidateAccount;
import com.hiringPlatform.candidate.model.response.CandidateResponse;
import com.hiringPlatform.candidate.model.response.GetLoggedUserResponse;
import com.hiringPlatform.candidate.repository.CandidateRepository;
import com.hiringPlatform.candidate.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @InjectMocks
    UserService userService;

    @Mock
    CandidateRepository candidateRepository;

    @Mock
    JwtService jwtService;

    @Mock
    RedisService redisService;

    @Mock
    CVService cvService;

    @Mock
    BCryptPasswordEncoder bCryptPasswordEncoder;

    @BeforeEach
    void setUp() {
        // Mocking the BCryptPasswordEncoder
        bCryptPasswordEncoder = Mockito.mock(BCryptPasswordEncoder.class);
        userService = new UserService(candidateRepository, redisService,
                jwtService, cvService, bCryptPasswordEncoder);
    }

    @Test
    public void testGetLoggedUser() {
        // Given
        Candidate candidate = buildCandidate();

        // When
        when(redisService.getData("userEmail")).thenReturn("test@example.com");
        when(redisService.getData("userToken")).thenReturn("token");
        when(candidateRepository.findByEmail(candidate.getUserDetails().getEmail())).thenReturn(Optional.of(candidate));
        when(cvService.hasCv(candidate.getUserDetails().getEmail())).thenReturn(true);
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

    @Test
    public void testUpdateCandidateAccount() {
        // Given
        Candidate candidate = buildCandidate();

        // When
        when(redisService.getData("userToken")).thenReturn("token");
        when(candidateRepository.findByEmail(candidate.getUserDetails().getEmail())).thenReturn(Optional.of(candidate));
        when(candidateRepository.save(any(Candidate.class))).thenReturn(candidate);
        when(bCryptPasswordEncoder.encode(anyString())).thenReturn(candidate.getUserDetails().getPassword());

        // Then
        CandidateResponse result = userService.updateCandidateAccount(buildUpdateCandidateAccount());
        assertEquals(result, buildCandidateResponse());
    }

    private UpdateCandidateAccount buildUpdateCandidateAccount(){
        UpdateCandidateAccount updateCandidateAccount = new UpdateCandidateAccount();
        updateCandidateAccount.setEmail("test@example.com");
        updateCandidateAccount.setNewFirstName("test");
        updateCandidateAccount.setNewLastName("test");
        updateCandidateAccount.setNewPassword("testPassword");
        return updateCandidateAccount;
    }

    private CandidateResponse buildCandidateResponse(){
        CandidateResponse candidateResponse = new CandidateResponse();
        candidateResponse.setCandidate(buildCandidate());
        candidateResponse.setToken("token");
        return candidateResponse;
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
