package com.hiringPlatform.admin.controller.IntegrationTests;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.hiringPlatform.admin.controller.UserController;
import com.hiringPlatform.admin.model.Admin;
import com.hiringPlatform.admin.model.Role;
import com.hiringPlatform.admin.model.User;
import com.hiringPlatform.admin.model.request.AddAdminRequest;
import com.hiringPlatform.admin.model.request.EditAdminRequest;
import com.hiringPlatform.admin.model.response.LoginAdminResponse;
import com.hiringPlatform.admin.model.response.UserResponse;
import com.hiringPlatform.admin.security.JwtService;
import com.hiringPlatform.admin.service.RedisService;
import com.hiringPlatform.admin.service.UserService;
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

import java.util.Date;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
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
    public void testAddAdmin() throws Exception {
        // Given
        User user = buildUserAdmin();
        UserResponse userResponse = buildUserResponseAdmin();
        List<UserResponse> userResponseList = List.of(userResponse);
        AddAdminRequest request = new AddAdminRequest(userResponse.getIdCreator(),
                userResponse.getUserName(), user.getPassword(), user.getEmail());

        // When
        when(userService.addAdmin(any())).thenReturn(userResponseList);

        // Then
        mockMvc.perform(post("/addAdmin").contentType("application/json")
                        .content(objectMapper.writeValueAsString(request)).with(csrf()))
                .andExpect(status().isOk())
                .andExpect(content().string(objectMapper.writeValueAsString(userResponseList)));
    }

    @Test
    public void testDeleteAdmin() throws Exception {
        // Given
        Admin admin = buildAdmin();
        UserResponse userResponse = buildUserResponseAdmin();
        List<UserResponse> userResponseList = List.of(userResponse);

        // When
        when(userService.deleteAdmin(anyString(), anyString())).thenReturn(userResponseList);

        // Then
        mockMvc.perform(post("/deleteAdmin/" + admin.getCreatorUser().getUserDetails().getEmail() +
                "/" + admin.getUserDetails().getEmail()).with(csrf()))
                .andExpect(status().isOk())
                .andExpect(content().string(objectMapper.writeValueAsString(userResponseList)));
    }
    
    @Test
    public void testEditAdmin() throws Exception {
        // Given
        LoginAdminResponse response = buildLoginAdminResponse();
        EditAdminRequest request = new EditAdminRequest("1", "newUsername", "newPassword");

        // When
        when(userService.editAdmin(anyString(), anyString(), anyString())).thenReturn(response);

        // Then
        mockMvc.perform(post("/editAdmin").contentType("application/json")
                        .content(objectMapper.writeValueAsString(request)).with(csrf()))
                .andExpect(status().isOk())
                .andExpect(content().string(objectMapper.writeValueAsString(response)));
    }

    @Test
    public void testGetUserList() throws Exception {
        // Given
        UserResponse userResponseAdmin = buildUserResponseAdmin();
        UserResponse userResponseEmp = buildUserResponseEmployer();
        UserResponse userResponseCandidate = buildUserResponseCandidate();
        List<UserResponse> userResponseList = List.of(userResponseEmp, userResponseAdmin, userResponseCandidate);

        // When
        when(userService.getUserList()).thenReturn(userResponseList);

        // Then
        mockMvc.perform(get("/getUserList"))
                .andExpect(status().isOk())
                .andExpect(content().string(objectMapper.writeValueAsString(userResponseList)));
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
