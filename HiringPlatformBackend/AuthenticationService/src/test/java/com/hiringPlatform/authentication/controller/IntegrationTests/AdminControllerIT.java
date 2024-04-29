package com.hiringPlatform.authentication.controller.IntegrationTests;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hiringPlatform.authentication.controller.AdminController;
import com.hiringPlatform.authentication.model.Admin;
import com.hiringPlatform.authentication.model.Role;
import com.hiringPlatform.authentication.model.User;
import com.hiringPlatform.authentication.model.response.LoginAdminResponse;
import com.hiringPlatform.authentication.security.JwtService;
import com.hiringPlatform.authentication.service.AdminService;
import com.hiringPlatform.authentication.service.RedisService;
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

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
@WebMvcTest(controllers = AdminController.class)
@ContextConfiguration(classes = {JwtService.class, RedisService.class})
@WithMockUser
@ActiveProfiles("test")
@Import(AdminController.class)
public class AdminControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    AdminService adminService;

    @MockBean
    JwtService jwtService;

    @MockBean
    RedisService redisService;

    @Test
    public void testLoginAdmin() throws Exception {
        // Given
        Admin admin = buildAdmin();
        LoginAdminResponse loginAdminResponse = buildLoginAdminResponse();

        // When
        when(adminService.loginAdmin(admin.getUserDetails().getEmail(), admin.getUserDetails().getPassword())).thenReturn(admin);
        when(jwtService.generateToken(any())).thenReturn("jwtToken");
        when(jwtService.getExpirationTime()).thenReturn(1L);

        // Then
        mockMvc.perform(get("/loginAdmin/" + admin.getUserDetails().getEmail() + "/" + admin.getUserDetails().getPassword()))
                .andExpect(status().isOk())
                .andExpect(content().string(objectMapper.writeValueAsString(loginAdminResponse)));
    }

    @Test
    public void testLoginAdminNullUser() throws Exception {
        // Given
        Admin admin = buildAdmin();
        LoginAdminResponse loginAdminResponse = buildLoginAdminResponse();
        loginAdminResponse.setToken("");
        loginAdminResponse.setAdmin(null);

        // When`
        when(adminService.loginAdmin(admin.getUserDetails().getEmail(), admin.getUserDetails().getPassword())).thenReturn(null);
        when(jwtService.getExpirationTime()).thenReturn(1L);

        // Then
        mockMvc.perform(get("/loginAdmin/" + admin.getUserDetails().getEmail() + "/" + admin.getUserDetails().getPassword()))
                .andExpect(status().isOk())
                .andExpect(content().string(objectMapper.writeValueAsString(loginAdminResponse)));
    }


    private Admin buildAdmin(){
        Admin admin = new Admin();
        admin.setAdminId("testId");
        admin.setUsername("testName");
        admin.setCreatorUser(null);
        User user = new User();
        user.setUserId("testId");
        user.setEmail("testEmail");
        user.setUserRole(new Role("roleId", "ROLE_ADMIN", "desc"));
        user.setPassword("testPassword");
        user.setRegistrationDate(new Date(2000));
        user.setAccountEnabled(1);
        admin.setUserDetails(user);
        return admin;
    }

    private LoginAdminResponse buildLoginAdminResponse(){
        LoginAdminResponse loginAdminResponse = new LoginAdminResponse();
        loginAdminResponse.setToken("jwtToken");
        loginAdminResponse.setAdmin(buildAdmin());
        loginAdminResponse.setExpiresIn(1L);
        return loginAdminResponse;
    }

}
