package com.hiringPlatform.common.controller.UnitTests;

import com.hiringPlatform.common.controller.UserController;
import com.hiringPlatform.common.model.Candidate;
import com.hiringPlatform.common.model.Role;
import com.hiringPlatform.common.model.User;
import com.hiringPlatform.common.model.response.GetLoggedUserResponse;
import com.hiringPlatform.common.service.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
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
        assertEquals(result.getStatusCode(), HttpStatus.OK);
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
