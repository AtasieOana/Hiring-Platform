package com.hiringPlatform.authentication.controller.IntegrationTests;

import com.fasterxml.jackson.databind.ObjectMapper;
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
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.web.servlet.MockMvc;

import java.util.ArrayList;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
@WebMvcTest(controllers = UserController.class)
@ContextConfiguration(classes = {JwtService.class, RedisService.class})
@WithMockUser
@ActiveProfiles("test")
@Import(UserController.class)
public class UserControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    UserService userService;

    @MockBean
    JwtService jwtService;

    @MockBean
    RedisService redisService;


    @Test
    public void testSignUpCandidate() throws Exception {
        // Given
        RegisterCandidateRequest registerCandidateRequest = buildRegisterCandidateRequest();
        RegisterResponse response = buildRegisterResponseCandidate();

        // When
        when(userService.signUpCandidate(registerCandidateRequest)).thenReturn(response);

        // Then
        mockMvc.perform(post("/signUpCandidate").contentType("application/json")
                        .content(objectMapper.writeValueAsString(registerCandidateRequest)).with(csrf()))
                .andExpect(status().isOk())
                .andExpect(content().string(objectMapper.writeValueAsString(response)));
    }

    @Test
    public void testSignUpEmployer() throws Exception {
        // Given
        RegisterEmployerRequest registerEmployerRequest = buildRegisterEmployerRequest();
        RegisterResponse response = buildRegisterResponseEmployer();

        // When
        when(userService.signUpEmployer(registerEmployerRequest)).thenReturn(response);

        // Then
        mockMvc.perform(post("/signUpEmployer").contentType("application/json")
                        .content(objectMapper.writeValueAsString(registerEmployerRequest)).with(csrf()))
                .andExpect(status().isOk())
                .andExpect(content().string(objectMapper.writeValueAsString(response)));
    }

    @Test
    public void testLogin() throws Exception{
        // Given
        User user = buildUser();
        LoginResponse loginResponse = buildLoginResponse();

        // When
        when(userService.login(user.getEmail(), user.getPassword())).thenReturn(user);
        when(jwtService.generateToken(any())).thenReturn("jwtToken");
        when(jwtService.getExpirationTime()).thenReturn(1L);

        // Then
        mockMvc.perform(get("/login/" + user.getEmail() + "/" + user.getPassword()))
                .andExpect(status().isOk())
                .andExpect(content().string(objectMapper.writeValueAsString(loginResponse)));
    }

    @Test
    public void testLoginNullUser() throws Exception{
        // Given
        User user = buildUser();
        LoginResponse loginResponse = buildLoginResponse();
        loginResponse.setToken("");
        loginResponse.setRoleName(null);

        // When
        when(userService.login(user.getEmail(), user.getPassword())).thenReturn(null);
        when(jwtService.getExpirationTime()).thenReturn(1L);

        // Then
        mockMvc.perform(get("/login/" + user.getEmail() + "/" + user.getPassword()))
                .andExpect(status().isOk())
                .andExpect(content().string(objectMapper.writeValueAsString(loginResponse)));
    }

    @Test
    public void testLogout() throws Exception{
        // Given
        String resultExp = "User logout";

        // Then
        mockMvc.perform(get("/logoutUser"))
                .andExpect(status().isOk())
                .andExpect(content().string(resultExp));
    }

    @Test
    public void testSeeUsers() throws Exception{
        // Given
        User user = buildUser();
        List<User> userList = new ArrayList<>();
        userList.add(user);

        // When
        when(userService.getAllUsers()).thenReturn(userList);

        // Then
        mockMvc.perform(get("/seeUsers"))
                .andExpect(status().isOk())
                .andExpect(content().string(objectMapper.writeValueAsString(userList)));
    }

    @Test
    public void testCheckTokenTrue() throws Exception{
        // When
        when(userService.verifyToken(anyString(), anyString())).thenReturn(true);

        // Then
        mockMvc.perform(get("/checkToken/email/token"))
                .andExpect(status().isOk())
                .andExpect(content().string(objectMapper.writeValueAsString(true)));
    }

    @Test
    public void testCheckTokenFalse() throws Exception{
        // When
        when(userService.verifyToken(anyString(), anyString())).thenReturn(false);

        // Then
        mockMvc.perform(get("/checkToken/email/token"))
                .andExpect(status().isOk())
                .andExpect(content().string(objectMapper.writeValueAsString(false)));
    }


    @Test
    public void testForgotPassword() throws Exception{
        // When
        when(userService.forgotPassword(anyString())).thenReturn(true);

        // Then
        mockMvc.perform(get("/forgotPassword/email"))
                .andExpect(status().isOk())
                .andExpect(content().string(objectMapper.writeValueAsString(true)));
    }

    @Test
    public void testResetPassword() throws Exception{
        // Given
        ResetPasswordRequest request = new ResetPasswordRequest();
        request.setEmail("email");
        request.setToken("token");
        request.setNewPassword("password");

        // When
        when(userService.resetPassword(request)).thenReturn(true);

        // Then
        mockMvc.perform(post("/resetPassword").contentType("application/json")
                .content(objectMapper.writeValueAsString(request)).with(csrf()))
                .andExpect(status().isOk())
                .andExpect(content().string(objectMapper.writeValueAsString(true)));
    }

    @Test
    public void testLoginGoogle() throws Exception{
        // Given
        UserGoogleRequest request = buildUserGoogleRequest();
        User user = buildUser();
        LoginResponse loginResponse = buildLoginResponse();

        // When
        when(userService.loginGoogle(request)).thenReturn(user);
        when(jwtService.generateToken(any())).thenReturn("jwtToken");
        when(jwtService.getExpirationTime()).thenReturn(1L);

        // Then
        mockMvc.perform(post("/loginGoogle").contentType("application/json")
                        .content(objectMapper.writeValueAsString(request)).with(csrf()))
                .andExpect(status().isOk())
                .andExpect(content().string(objectMapper.writeValueAsString(loginResponse)));
    }

    @Test
    public void testAuthGoogle() throws Exception{
        // Given
        UserGoogleRequest request = buildUserGoogleRequest();
        User user = buildUser();
        LoginResponse loginResponse = buildLoginResponse();

        // When
        when(userService.authGoogle(request)).thenReturn(user);
        when(jwtService.generateToken(any())).thenReturn("jwtToken");
        when(jwtService.getExpirationTime()).thenReturn(1L);

        // Then
        mockMvc.perform(post("/authGoogle").contentType("application/json")
                        .content(objectMapper.writeValueAsString(request)).with(csrf()))
                .andExpect(status().isOk())
                .andExpect(content().string(objectMapper.writeValueAsString(loginResponse)));
    }

    @Test
    public void testDeleteUser() throws Exception{
        // When
        when(userService.deleteUser("email")).thenReturn(true);

        // Then
        mockMvc.perform(delete("/deleteUser/email").with(csrf()))
                .andExpect(status().isOk())
                .andExpect(content().string(objectMapper.writeValueAsString(true)));
    }

    @Test
    public void testDeleteUserByEmail() throws Exception{
        DeleteUserByAdminRequest request = new DeleteUserByAdminRequest();
        request.setEmailUser("email");
        request.setEmailAdmin("email");
        request.setReason("reason");

        // When
        when(userService.deleteUserByAdmin(anyString(), anyString(), anyString())).thenReturn(true);

        // Then
        mockMvc.perform(post("/deleteUserByAdmin").contentType("application/json")
                        .content(objectMapper.writeValueAsString(request)).with(csrf()))
                .andExpect(status().isOk())
                .andExpect(content().string(objectMapper.writeValueAsString(true)));
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
