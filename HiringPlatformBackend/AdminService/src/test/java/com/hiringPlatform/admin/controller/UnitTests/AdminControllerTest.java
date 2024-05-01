package com.hiringPlatform.admin.controller.UnitTests;


import com.hiringPlatform.admin.controller.AdminController;
import com.hiringPlatform.admin.model.Admin;
import com.hiringPlatform.admin.model.Role;
import com.hiringPlatform.admin.model.User;
import com.hiringPlatform.admin.model.response.AdminListResponse;
import com.hiringPlatform.admin.model.response.AdminResponse;
import com.hiringPlatform.admin.service.AdminService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class AdminControllerTest {

    @InjectMocks
    AdminController adminController;

    @Mock
    AdminService adminService;

    @Test
    public void testGetAdminResponse() {
        // Given
        Admin admin = buildAdmin();
        AdminResponse adminResponse = new AdminResponse(admin.getAdminId(), admin.getUserDetails().getEmail(), admin.getUsername());

        // When
        when(adminService.getAdminResponse(anyString())).thenReturn(adminResponse);

        // Then
        ResponseEntity<AdminResponse> result = adminController.getAdmin(admin.getAdminId());
        assertEquals(result.getBody(), adminResponse);
        assertEquals(result.getStatusCode(), HttpStatus.OK);
    }

    @Test
    public void testGetAdminsList() {
        // Given
        Admin admin = buildAdmin();
        AdminListResponse adminResponse = new AdminListResponse(admin.getUserDetails().getEmail(), admin.getUsername());
        ArrayList<AdminListResponse> adminResponseList = new ArrayList<>();
        adminResponseList.add(adminResponse);

        // When
        when(adminService.getAdminsList()).thenReturn(adminResponseList);

        // Then
        ResponseEntity<List<AdminListResponse>> result = adminController.getAdminList();
        assertEquals(result.getBody(), adminResponseList);
        assertEquals(result.getStatusCode(), HttpStatus.OK);
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
