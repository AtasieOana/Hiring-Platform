package com.hiringPlatform.admin.service;


import com.hiringPlatform.admin.model.Employer;
import com.hiringPlatform.admin.model.Role;
import com.hiringPlatform.admin.model.User;
import com.hiringPlatform.admin.repository.EmployerRepository;
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
public class EmployerServiceTest {

    @InjectMocks
    EmployerService employerService;

    @Mock
    EmployerRepository employerRepository;

    @Test
    public void testGetEmployer() {
        // Given
        Employer employer = buildEmployer();

        // When
        when(employerRepository.findById(anyString())).thenReturn(Optional.of(employer));

        // Then
        Employer result = employerService.getEmployer("1");
        assertEquals(result, employer);
    }

    @Test
    public void testGetEmployerNotPresent() {
        // When
        when(employerRepository.findById(anyString())).thenReturn(Optional.empty());

        // Then
        Employer result = employerService.getEmployer("1");
        assertNull(result);
    }

    private Employer buildEmployer(){
        Employer employer = new Employer();
        User user = new User();
        user.setUserId("1");
        user.setEmail("test@example.com");
        user.setPassword("testPassword");
        Role role = new Role("1", "ROLE_CANDIDATE", "description");
        user.setUserRole(role);
        employer.setUserDetails(user);
        employer.setCompanyName("test");
        employer.setEmployerId("1");
        return employer;
    }

}
