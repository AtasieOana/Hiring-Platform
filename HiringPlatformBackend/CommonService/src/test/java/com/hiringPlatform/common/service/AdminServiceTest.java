package com.hiringPlatform.common.service;

import com.hiringPlatform.common.model.Admin;
import com.hiringPlatform.common.model.Role;
import com.hiringPlatform.common.model.User;
import com.hiringPlatform.common.repository.AdminRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Date;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class AdminServiceTest {

    @InjectMocks
    AdminService adminService;

    @Mock
    AdminRepository adminRepository;

    @Test
    public void testGetAdminPresent() {
        // Given
        Admin admin = buildAdmin();

        // When
        when(adminRepository.findById(anyString())).thenReturn(Optional.of(admin));

        // Then
        Admin result = adminService.getAdmin("testId");
        assertEquals(result, admin);
    }

    @Test
    public void testGetAdminNotPresent() {
        // When
        when(adminRepository.findById(anyString())).thenReturn(Optional.empty());

        // Then
        Admin result = adminService.getAdmin("testId");
        assertNull(result);
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
