package com.hiringPlatform.authentication.service;

import com.hiringPlatform.authentication.model.Candidate;
import com.hiringPlatform.authentication.model.Employer;
import com.hiringPlatform.authentication.model.User;
import com.hiringPlatform.authentication.repository.CandidateRepository;
import com.hiringPlatform.authentication.repository.EmployerRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class EmployerServiceTest {

    @InjectMocks
    EmployerService employerService;

    @Mock
    EmployerRepository employerRepository;

    @Test
    public void testSaveEmployer() {
        // Given
        Employer employer = new Employer();
        User user = new User();
        user.setUserId("testUserId");
        user.setEmail("test@example.com");
        String companyName = "Company";
        employer.setUserDetails(user);
        employer.setCompanyName(companyName);
        employer.setEmployerId("testUserId");

        // When
        when(employerRepository.save(employer)).thenReturn(employer);

        // Then
        employerService.saveEmployer(user, companyName);

        // Checks that the save method was called with an appropriate Employer object
        ArgumentCaptor<Employer> employerCaptor = ArgumentCaptor.forClass(Employer.class);
        verify(employerRepository).save(employerCaptor.capture());

        // Checks that the captured Employer object has the correct values set
        Employer capturedEmployer = employerCaptor.getValue();
        assertEquals("testUserId", capturedEmployer.getEmployerId());
        assertEquals(user, capturedEmployer.getUserDetails());
        assertEquals(companyName, capturedEmployer.getCompanyName());
    }

}
