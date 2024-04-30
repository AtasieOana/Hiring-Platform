package com.hiringPlatform.employer.service;

import com.hiringPlatform.employer.model.Employer;
import com.hiringPlatform.employer.model.Role;
import com.hiringPlatform.employer.model.User;
import com.hiringPlatform.employer.model.request.UpdateEmployerAccount;
import com.hiringPlatform.employer.model.response.EmployerResponse;
import com.hiringPlatform.employer.model.response.GetLoggedUserResponse;
import com.hiringPlatform.employer.repository.EmployerRepository;
import com.hiringPlatform.employer.security.JwtService;
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
    EmployerRepository employerRepository;

    @Mock
    JwtService jwtService;

    @Mock
    RedisService redisService;

    @Mock
    ProfileService profileService;

    @Mock
    BCryptPasswordEncoder bCryptPasswordEncoder;

    @BeforeEach
    void setUp() {
        // Mocking the BCryptPasswordEncoder
        bCryptPasswordEncoder = Mockito.mock(BCryptPasswordEncoder.class);
        userService = new UserService(employerRepository, profileService, redisService,
                jwtService, bCryptPasswordEncoder);
    }

    @Test
    public void testGetLoggedUser() {
        // Given
        Employer employer = buildEmployer();

        // When
        when(redisService.getData("userEmail")).thenReturn("test@example.com");
        when(redisService.getData("userToken")).thenReturn("token");
        when(employerRepository.findByEmail(employer.getUserDetails().getEmail())).thenReturn(Optional.of(employer));
        when(profileService.hasEmployerProfile(employer.getUserDetails().getEmail())).thenReturn(true);
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
    public void testGetLoggedUserEmployerNotPresent() {
        // Given
        Employer employer = buildEmployer();

        // When
        when(redisService.getData("userEmail")).thenReturn("test@example.com");
        when(redisService.getData("userToken")).thenReturn("token");
        when(employerRepository.findByEmail(employer.getUserDetails().getEmail())).thenReturn(Optional.empty());

        // Then
        GetLoggedUserResponse result = userService.getLoggedUser();
        assertNull(result);
    }

    @Test
    public void testGetLoggedUserTokenExpired() {
        // Given
        Employer employer = buildEmployer();

        // When
        when(redisService.getData("userEmail")).thenReturn("test@example.com");
        when(redisService.getData("userToken")).thenReturn("token");
        when(employerRepository.findByEmail(employer.getUserDetails().getEmail())).thenReturn(Optional.of(employer));
        when(jwtService.isTokenExpired(anyString())).thenReturn(true);

        // Then
        GetLoggedUserResponse result = userService.getLoggedUser();
        assertNull(result);
    }

    @Test
    public void testUpdateEmployerAccount() {
        // Given
        Employer employer = buildEmployer();

        // When
        when(redisService.getData("userToken")).thenReturn("token");
        when(employerRepository.findByEmail(employer.getUserDetails().getEmail())).thenReturn(Optional.of(employer));
        when(employerRepository.save(any(Employer.class))).thenReturn(employer);
        when(bCryptPasswordEncoder.encode(anyString())).thenReturn(employer.getUserDetails().getPassword());

        // Then
        EmployerResponse result = userService.updateEmployerAccount(buildUpdateEmployerAccount());
        assertEquals(result, buildEmployerResponse());
    }

    private UpdateEmployerAccount buildUpdateEmployerAccount(){
        UpdateEmployerAccount updateEmployerAccount = new UpdateEmployerAccount();
        updateEmployerAccount.setEmail("test@example.com");
        updateEmployerAccount.setNewCompanyName("test");
        updateEmployerAccount.setNewPassword("testPassword");
        return updateEmployerAccount;
    }

    private EmployerResponse buildEmployerResponse(){
        EmployerResponse employerResponse = new EmployerResponse();
        employerResponse.setEmployer(buildEmployer());
        employerResponse.setToken("token");
        return employerResponse;
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

    private GetLoggedUserResponse buildGetLoggedUserResponse(){
        GetLoggedUserResponse response = new GetLoggedUserResponse();
        response.setHasProfile(true);
        response.setToken("token");
        response.setEmployer(buildEmployer());
        return response;
    }
}
