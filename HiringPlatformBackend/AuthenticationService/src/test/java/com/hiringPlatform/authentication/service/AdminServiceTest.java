package com.hiringPlatform.authentication.service;

import com.hiringPlatform.authentication.model.Admin;
import com.hiringPlatform.authentication.model.Role;
import com.hiringPlatform.authentication.model.User;
import com.hiringPlatform.authentication.repository.AdminRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class AdminServiceTest {

    @InjectMocks
    AdminService adminService;

    @Mock
    AdminRepository adminRepository;

    @Mock
    BCryptPasswordEncoder bCryptPasswordEncoder;

    @BeforeEach
    void setUp() {
        // Mocking the BCryptPasswordEncoder
        bCryptPasswordEncoder = Mockito.mock(BCryptPasswordEncoder.class);
        adminService = new AdminService(adminRepository, bCryptPasswordEncoder);
    }

    @Test
    public void testLoginAdminSuccessful() {
        // Given
        Admin admin = buildAdmin();

        // When
        when(adminRepository.findByUserDetailsEmail(admin.getUserDetails().getEmail())).thenReturn(Optional.of(admin));
        when(bCryptPasswordEncoder.matches(admin.getUserDetails().getPassword(), admin.getUserDetails().getPassword())).thenReturn(true);

        // Then
        Admin result = adminService.loginAdmin(admin.getUserDetails().getEmail(), admin.getUserDetails().getPassword());
        assertEquals(result, admin);
    }

    @Test
    public void testLoginAdminPasswordNotMatch() {
        // Given
        Admin admin = buildAdmin();

        // When
        when(adminRepository.findByUserDetailsEmail(admin.getUserDetails().getEmail())).thenReturn(Optional.of(admin));

        // Then
        Admin result = adminService.loginAdmin(admin.getUserDetails().getEmail(), admin.getUserDetails().getPassword());
        assertNull(result);
    }

    @Test
    public void testLoginAdminUserNotPresent() {
        // When
        when(adminRepository.findByUserDetailsEmail(anyString())).thenReturn(Optional.empty());

        // Then
        Admin result = adminService.loginAdmin("test", "test");
        assertNull(result);
    }

    @Test
    public void testLoginAdminWrongRole() {
        // Given
        Admin admin = buildAdminWrongRole();

        // When
        when(adminRepository.findByUserDetailsEmail(admin.getUserDetails().getEmail())).thenReturn(Optional.of(admin));

        // Then
        Admin result = adminService.loginAdmin(admin.getUserDetails().getEmail(), admin.getUserDetails().getPassword());
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

    private Admin buildAdminWrongRole(){
        Admin admin = new Admin();
        admin.setAdminId("testId");
        admin.setUsername("testName");
        admin.setCreatorUser(null);
        User user = new User();
        user.setUserId("testId");
        user.setEmail("testEmail");
        user.setUserRole(new Role("roleId", "ROLE_CANDIDATE", "desc"));
        user.setPassword("testPassword");
        user.setRegistrationDate(new Date(2000));
        user.setAccountEnabled(1);
        admin.setUserDetails(user);
        return admin;
    }

}
