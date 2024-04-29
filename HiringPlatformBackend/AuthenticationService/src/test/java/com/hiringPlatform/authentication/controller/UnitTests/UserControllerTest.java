package com.hiringPlatform.authentication.controller.UnitTests;

import com.hiringPlatform.authentication.controller.UserController;
import com.hiringPlatform.authentication.model.Role;
import com.hiringPlatform.authentication.model.User;
import com.hiringPlatform.authentication.model.request.*;
import com.hiringPlatform.authentication.model.response.LoginResponse;
import com.hiringPlatform.authentication.model.response.RegisterResponse;
import com.hiringPlatform.authentication.security.JwtService;
import com.hiringPlatform.authentication.service.RedisService;
import com.hiringPlatform.authentication.service.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

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

    @Mock
    JwtService jwtService;

    @Mock
    RedisService redisService;

    @Test
    public void testSignUpCandidate() {
        // Given
        RegisterCandidateRequest registerCandidateRequest = buildRegisterCandidateRequest();
        RegisterResponse response = buildRegisterResponseCandidate();

        // When
        when(userService.signUpCandidate(registerCandidateRequest)).thenReturn(response);

        // Then
        ResponseEntity<RegisterResponse> result = userController.signUp(registerCandidateRequest);
        assertEquals(result.getBody(), response);
        assertEquals(result.getStatusCode(), HttpStatus.OK);
    }

    @Test
    public void testSignUpEmployer() {
        // Given
        RegisterEmployerRequest registerEmployerRequest = buildRegisterEmployerRequest();
        RegisterResponse response = buildRegisterResponseEmployer();

        // When
        when(userService.signUpEmployer(registerEmployerRequest)).thenReturn(response);

        // Then
        ResponseEntity<RegisterResponse> result = userController.signUp(registerEmployerRequest);
        assertEquals(result.getBody(), response);
        assertEquals(result.getStatusCode(), HttpStatus.OK);
    }

    @Test
    public void testLogin() {
        // Given
        User user = buildUser();
        LoginResponse loginResponse = buildLoginResponse();

        // When
        when(userService.login(user.getEmail(), user.getPassword())).thenReturn(user);
        when(jwtService.generateToken(any())).thenReturn("jwtToken");
        when(jwtService.getExpirationTime()).thenReturn(1L);

        // Then
        ResponseEntity<LoginResponse> result = userController.login(user.getEmail(), user.getPassword());
        assertEquals(result.getBody(), loginResponse);
        assertEquals(result.getStatusCode(), HttpStatus.OK);
    }

    @Test
    public void testLoginNullUser() {
        // Given
        User user = buildUser();
        LoginResponse loginResponse = buildLoginResponse();
        loginResponse.setToken("");
        loginResponse.setRoleName(null);

        // When
        when(userService.login(user.getEmail(), user.getPassword())).thenReturn(null);
        when(jwtService.getExpirationTime()).thenReturn(1L);

        // Then
        ResponseEntity<LoginResponse> result = userController.login(user.getEmail(), user.getPassword());
        assertEquals(Objects.requireNonNull(result.getBody()).getToken(), "");
        assertEquals(result.getBody(), loginResponse);
        assertEquals(result.getStatusCode(), HttpStatus.OK);
    }

    @Test
    public void testLogout() {
        // Given
        String resultExp = "User logout";

        // Then
        ResponseEntity<String> result = userController.logout();
        assertEquals(result.getBody(), resultExp);
        assertEquals(result.getStatusCode(), HttpStatus.OK);
    }

    @Test
    public void testSeeUsers() {
        // Given
        User user = buildUser();
        List<User> userList = new ArrayList<>();
        userList.add(user);

        // When
        when(userService.getAllUsers()).thenReturn(userList);

        // Then
        ResponseEntity<List<User>> result = userController.getAllUsers();
        assertEquals(result.getBody(), userList);
        assertEquals(result.getStatusCode(), HttpStatus.OK);
    }

    @Test
    public void testCheckTokenTrue() {
        // When
        when(userService.verifyToken(anyString(), anyString())).thenReturn(true);

        // Then
        ResponseEntity<Boolean> result = userController.verifyToken("email", "token");
        assertEquals(result.getBody(), true);
        assertEquals(result.getStatusCode(), HttpStatus.OK);
    }

    @Test
    public void testCheckTokenFalse() {
        // When
        when(userService.verifyToken(anyString(), anyString())).thenReturn(false);

        // Then
        ResponseEntity<Boolean> result = userController.verifyToken("email", "token");
        assertEquals(result.getBody(), false);
        assertEquals(result.getStatusCode(), HttpStatus.OK);
    }


    @Test
    public void testForgotPassword() {
        // When
        when(userService.forgotPassword(anyString())).thenReturn(true);

        // Then
        ResponseEntity<Boolean> result = userController.forgotPassword("email");
        assertEquals(result.getBody(), true);
        assertEquals(result.getStatusCode(), HttpStatus.OK);
    }

    @Test
    public void testResetPassword() {
        // Given
        ResetPasswordRequest request = new ResetPasswordRequest();
        request.setEmail("email");
        request.setToken("token");
        request.setNewPassword("password");

        // When
        when(userService.resetPassword(request)).thenReturn(true);

        // Then
        ResponseEntity<Boolean> result = userController.resetPassword(request);
        assertEquals(result.getBody(), true);
        assertEquals(result.getStatusCode(), HttpStatus.OK);
    }

    @Test
    public void testLoginGoogle() {
        // Given
        UserGoogleRequest request = buildUserGoogleRequest();
        User user = buildUser();
        LoginResponse loginResponse = buildLoginResponse();

        // When
        when(userService.loginGoogle(request)).thenReturn(user);
        when(jwtService.generateToken(any())).thenReturn("jwtToken");
        when(jwtService.getExpirationTime()).thenReturn(1L);

        // Then
        ResponseEntity<LoginResponse> result = userController.loginGoogle(request);
        assertEquals(result.getBody(), loginResponse);
        assertEquals(result.getStatusCode(), HttpStatus.OK);
    }

    @Test
    public void testAuthGoogle() {
        // Given
        UserGoogleRequest request = buildUserGoogleRequest();
        User user = buildUser();
        LoginResponse loginResponse = buildLoginResponse();

        // When
        when(userService.authGoogle(request)).thenReturn(user);
        when(jwtService.generateToken(any())).thenReturn("jwtToken");
        when(jwtService.getExpirationTime()).thenReturn(1L);

        // Then
        ResponseEntity<LoginResponse> result = userController.authGoogle(request);
        assertEquals(result.getBody(), loginResponse);
        assertEquals(result.getStatusCode(), HttpStatus.OK);
    }

    @Test
    public void testDeleteUser() {
        // When
        when(userService.deleteUser("email")).thenReturn(true);

        // Then
        ResponseEntity<Boolean> result = userController.deleteUser("email");
        assertEquals(result.getBody(), true);
        assertEquals(result.getStatusCode(), HttpStatus.OK);
    }

    @Test
    public void testDeleteUserByEmail() {
        DeleteUserByAdminRequest request = new DeleteUserByAdminRequest();
        request.setEmailUser("email");
        request.setEmailAdmin("email");
        request.setReason("reason");

        // When
        when(userService.deleteUserByAdmin(anyString(), anyString(), anyString())).thenReturn(true);

        // Then
        ResponseEntity<Boolean> result = userController.deleteUserByAdmin(request);
        assertEquals(result.getBody(), true);
        assertEquals(result.getStatusCode(), HttpStatus.OK);
    }

    private UserGoogleRequest buildUserGoogleRequest(){
        UserGoogleRequest userGoogleRequest = new UserGoogleRequest();
        userGoogleRequest.setEmail("test@example.com");
        userGoogleRequest.setGivenName("test");
        userGoogleRequest.setFamilyName("test");
        userGoogleRequest.setName("test");
        userGoogleRequest.setAccountType("ROLE_EMPLOYER");
        return userGoogleRequest;
    }

    private RegisterCandidateRequest buildRegisterCandidateRequest(){
        RegisterCandidateRequest userRequest = new RegisterCandidateRequest();
        userRequest.setEmail("test@example.com");
        userRequest.setPassword("password");
        userRequest.setAccountType("ROLE_CANDIDATE");
        String lastname = "Doe";
        String firstname = "John";
        userRequest.setFirstname(firstname);
        userRequest.setLastname(lastname);
        return userRequest;
    }

    private RegisterEmployerRequest buildRegisterEmployerRequest(){
        RegisterEmployerRequest userRequest = new RegisterEmployerRequest();
        userRequest.setEmail("test@example.com");
        userRequest.setPassword("password");
        userRequest.setAccountType("ROLE_EMPLOYER");
        userRequest.setCompanyName("Company");
        return userRequest;
    }

    private RegisterResponse buildRegisterResponseCandidate(){
        RegisterResponse response = new RegisterResponse();
        response.setEmail("test@example.com");
        response.setRoleName("ROLE_CANDIDATE");
        return response;
    }

    private RegisterResponse buildRegisterResponseEmployer(){
        RegisterResponse response = new RegisterResponse();
        response.setEmail("test@example.com");
        response.setRoleName("ROLE_EMPLOYER");
        return response;
    }

    private LoginResponse buildLoginResponse(){
        LoginResponse response = new LoginResponse();
        response.setToken("jwtToken");
        response.setExpiresIn(1L);
        response.setRoleName("ROLE_EMPLOYER");
        return response;
    }

    private User buildUser(){
        User user = new User();
        user.setUserId("testUserId");
        user.setEmail("test@example.com");
        user.setPassword("testPassword");
        Role role = new Role("1", "ROLE_EMPLOYER", "description");
        user.setUserRole(role);
        user.setAccountEnabled(1);
        return user;
    }
}
