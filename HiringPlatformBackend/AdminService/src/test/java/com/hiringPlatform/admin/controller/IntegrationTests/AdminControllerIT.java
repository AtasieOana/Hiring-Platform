package com.hiringPlatform.admin.controller.IntegrationTests;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.hiringPlatform.admin.controller.AdminController;
import com.hiringPlatform.admin.model.Admin;
import com.hiringPlatform.admin.model.Role;
import com.hiringPlatform.admin.model.User;
import com.hiringPlatform.admin.model.response.AdminListResponse;
import com.hiringPlatform.admin.model.response.AdminResponse;
import com.hiringPlatform.admin.security.JwtService;
import com.hiringPlatform.admin.service.AdminService;
import com.hiringPlatform.admin.service.RedisService;
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
import java.util.Date;

import static org.mockito.ArgumentMatchers.anyString;
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
    public void testGetAdminResponse() throws Exception {
        // Given
        Admin admin = buildAdmin();
        AdminResponse adminResponse = new AdminResponse(admin.getAdminId(), admin.getUserDetails().getEmail(), admin.getUsername());

        // When
        when(adminService.getAdminResponse(anyString())).thenReturn(adminResponse);

        // Then
        mockMvc.perform(get("/getAdmin/" + admin.getAdminId()))
                .andExpect(status().isOk())
                .andExpect(content().string(objectMapper.writeValueAsString(adminResponse)));
    }

    @Test
    public void testGetAdminsList() throws Exception {
        // Given
        Admin admin = buildAdmin();
        AdminListResponse adminResponse = new AdminListResponse(admin.getUserDetails().getEmail(), admin.getUsername());
        ArrayList<AdminListResponse> adminResponseList = new ArrayList<>();
        adminResponseList.add(adminResponse);

        // When
        when(adminService.getAdminsList()).thenReturn(adminResponseList);

        // Then
        mockMvc.perform(get("/getAdminList"))
                .andExpect(status().isOk())
                .andExpect(content().string(objectMapper.writeValueAsString(adminResponseList)));
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
}
