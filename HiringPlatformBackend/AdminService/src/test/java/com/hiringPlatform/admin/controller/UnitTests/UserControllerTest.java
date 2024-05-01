package com.hiringPlatform.admin.controller.UnitTests;


import com.hiringPlatform.admin.controller.UserController;
import com.hiringPlatform.admin.model.*;
import com.hiringPlatform.admin.model.request.AddAdminRequest;
import com.hiringPlatform.admin.model.request.EditAdminRequest;
import com.hiringPlatform.admin.model.response.LoginAdminResponse;
import com.hiringPlatform.admin.model.response.UserResponse;
import com.hiringPlatform.admin.service.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class UserControllerTest {

    @InjectMocks
    UserController userController;
    @Mock
    UserService userService;
    
    @Test
    public void testAddAdmin() {
        // Given
        User user = buildUserAdmin();
        UserResponse userResponse = buildUserResponseAdmin();
        List<UserResponse> userResponseList = List.of(userResponse);
        AddAdminRequest request = new AddAdminRequest(userResponse.getIdCreator(),
                userResponse.getUserName(), user.getPassword(), user.getEmail());

        // When
        when(userService.addAdmin(any())).thenReturn(userResponseList);

        // Then
        ResponseEntity<List<UserResponse>> result = userController.addAdmin(request);
        assertEquals(result.getBody(), userResponseList);
        assertEquals(result.getStatusCode(), HttpStatus.OK);
    }

    @Test
    public void testDeleteAdmin() {
        // Given
        Admin admin = buildAdmin();
        UserResponse userResponse = buildUserResponseAdmin();
        List<UserResponse> userResponseList = List.of(userResponse);

        // When
        when(userService.deleteAdmin(anyString(), any())).thenReturn(userResponseList);

        // Then
        ResponseEntity<List<UserResponse>> result = userController.deleteAdmin(admin.getUserDetails().getEmail(), admin.getUserDetails().getEmail());
        assertEquals(result.getBody(), userResponseList);
        assertEquals(result.getStatusCode(), HttpStatus.OK);
    }
    
    @Test
    public void testEditAdmin() {
        // Given
        LoginAdminResponse response = buildLoginAdminResponse();
        EditAdminRequest request = new EditAdminRequest("1", "newUsername", "newPassword");

        // When
        when(userService.editAdmin(anyString(), anyString(), anyString())).thenReturn(response);

        // Then
        ResponseEntity<LoginAdminResponse> result = userController.editAdmin(request);
        assertEquals(result.getBody(), response);
        assertEquals(result.getStatusCode(), HttpStatus.OK);
    }

    @Test
    public void testGetUserList() {
        // Given
        UserResponse userResponseAdmin = buildUserResponseAdmin();
        UserResponse userResponseEmp = buildUserResponseEmployer();
        UserResponse userResponseCandidate = buildUserResponseCandidate();
        List<UserResponse> userResponseList = List.of(userResponseEmp, userResponseAdmin, userResponseCandidate);

        // When
        when(userService.getUserList()).thenReturn(userResponseList);

        // Then
        ResponseEntity<List<UserResponse>> result = userController.getUserList();
        assertEquals(result.getBody(), userResponseList);
        assertEquals(result.getStatusCode(), HttpStatus.OK);
    }

    private User buildUserAdmin(){
        User user = new User();
        user.setUserId("testUserId");
        user.setEmail("test@example.com");
        user.setPassword("testPassword");
        user.setRegistrationDate(new Date(2000));
        Role role = new Role("1", "ROLE_ADMIN", "description");
        user.setUserRole(role);
        user.setAccountEnabled(1);
        return user;
    }

    private User buildUserCandidate(){
        User user = new User();
        user.setUserId("testUserId");
        user.setEmail("test@example.com");
        user.setPassword("testPassword");
        user.setRegistrationDate(new Date(2000));
        Role role = new Role("1", "ROLE_CANDIDATE", "description");
        user.setUserRole(role);
        user.setAccountEnabled(1);
        return user;
    }

    private UserResponse buildUserResponseEmployer(){
        UserResponse user = new UserResponse();
        user.setUserId("testUserId");
        user.setEmail("test@example.com");
        user.setRegistrationDate(new Date(2000));
        user.setUserName("Company");
        Role role = new Role("1", "ROLE_EMPLOYER", "description");
        user.setUserRole(role.getRoleName());
        user.setAccountEnabled(1);
        user.setIdCreator("");
        user.setUsernameCreator("");
        return user;
    }

    private UserResponse buildUserResponseCandidate(){
        UserResponse user = new UserResponse();
        user.setUserId("testUserId");
        user.setEmail("test@example.com");
        user.setUserName("test test");
        user.setRegistrationDate(new Date(2000));
        Role role = new Role("1", "ROLE_CANDIDATE", "description");
        user.setUserRole(role.getRoleName());
        user.setAccountEnabled(1);
        user.setIdCreator("");
        user.setUsernameCreator("");
        return user;
    }

    private UserResponse buildUserResponseAdmin(){
        UserResponse user = new UserResponse();
        user.setUserId("testUserId");
        user.setEmail("test@example.com");
        user.setRegistrationDate(new Date(2000));
        user.setUserName("testName");
        Role role = new Role("1", "ROLE_ADMIN", "description");
        user.setUserRole(role.getRoleName());
        user.setAccountEnabled(1);
        user.setUsernameCreator("usernameCreator");
        user.setIdCreator("testCreatorId");
        return user;
    }

    private Admin buildAdmin(){
        Admin admin = new Admin();
        admin.setAdminId("testId");
        admin.setUsername("testName");
        User user = new User();
        user.setUserId("testId");
        user.setEmail("testEmail");
        user.setUserRole(new Role("roleId", "ROLE_ADMIN", "desc"));
        user.setPassword("testPassword");
        user.setRegistrationDate(new Date(2000));
        user.setAccountEnabled(1);
        admin.setUserDetails(user);
        admin.setCreatorUser(buildAdminCreator());
        return admin;
    }

    private Admin buildAdminCreator(){
        Admin admin = new Admin();
        admin.setAdminId("testCreatorId");
        admin.setUsername("usernameCreator");
        User user = new User();
        user.setUserId("testId");
        user.setEmail("testEmail");
        user.setUserRole(new Role("roleId", "ROLE_ADMIN", "desc"));
        user.setPassword("testPassword");
        user.setRegistrationDate(new Date(2000));
        user.setAccountEnabled(1);
        admin.setUserDetails(user);
        admin.setCreatorUser(null);
        return admin;
    }

    private LoginAdminResponse buildLoginAdminResponse(){
        LoginAdminResponse response = new LoginAdminResponse();
        response.setAdmin(buildAdmin());
        response.setExpiresIn(0L);
        response.setToken("token");
        return response;
    }
}
