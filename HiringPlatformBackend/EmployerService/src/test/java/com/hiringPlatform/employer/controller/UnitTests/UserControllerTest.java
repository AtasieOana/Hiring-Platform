package com.hiringPlatform.employer.controller.UnitTests;

import com.hiringPlatform.employer.controller.UserController;
import com.hiringPlatform.employer.model.Employer;
import com.hiringPlatform.employer.model.Role;
import com.hiringPlatform.employer.model.User;
import com.hiringPlatform.employer.model.request.UpdateEmployerAccount;
import com.hiringPlatform.employer.model.response.EmployerResponse;
import com.hiringPlatform.employer.model.response.GetLoggedUserResponse;
import com.hiringPlatform.employer.service.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class UserControllerTest {

    @InjectMocks
    UserController userController;

    @Mock
    UserService userService;

    @Test
    public void testGetLoggedUser() {
        // Given
        GetLoggedUserResponse response = buildGetLoggedUserResponse();

        // When
        when(userService.getLoggedUser()).thenReturn(response);

        // Then
        ResponseEntity<GetLoggedUserResponse> result = userController.getLoggedUser();
        assertEquals(result.getBody(), response);
    }

    @Test
    public void testUpdateEmployerAccount() {
        // When
        when(userService.updateEmployerAccount(buildUpdateEmployerAccount())).thenReturn(buildEmployerResponse());

        // Then
        ResponseEntity<EmployerResponse> result = userController.updateAccount(buildUpdateEmployerAccount());
        assertEquals(result.getBody(), buildEmployerResponse());
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
