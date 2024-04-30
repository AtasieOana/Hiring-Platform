package com.hiringPlatform.admin.service;


import com.hiringPlatform.admin.model.Admin;
import com.hiringPlatform.admin.model.Role;
import com.hiringPlatform.admin.model.User;
import com.hiringPlatform.admin.model.response.AdminListResponse;
import com.hiringPlatform.admin.model.response.AdminResponse;
import com.hiringPlatform.admin.repository.AdminRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class AdminServiceTest {

    @InjectMocks
    AdminService adminService;

    @Mock
    AdminRepository adminRepository;

    @Test
    public void testGetAdmin() {
        // Given
        Admin admin = buildAdmin();

        // When
        when(adminRepository.findById(admin.getAdminId())).thenReturn(Optional.of(admin));

        // Then
        Admin result = adminService.getAdmin(admin.getAdminId());
        assertEquals(result, admin);
    }

    @Test
    public void testGetAdminNotPresent() {
        // Given
        Admin admin = buildAdmin();

        // When
        when(adminRepository.findById(admin.getAdminId())).thenReturn(Optional.empty());

        // Then
        Admin result = adminService.getAdmin(admin.getAdminId());
        assertNull(result);
    }

    @Test
    public void testGetAdminByEmail() {
        // Given
        Admin admin = buildAdmin();

        // When
        when(adminRepository.getAdminByUserDetailsEmail(admin.getUserDetails().getEmail())).thenReturn(Optional.of(admin));

        // Then
        Admin result = adminService.getAdminByEmail(admin.getUserDetails().getEmail());
        assertEquals(result, admin);
    }

    @Test
    public void testGetAdminByEmailNotPresent() {
        // Given
        Admin admin = buildAdmin();

        // When
        when(adminRepository.getAdminByUserDetailsEmail(admin.getUserDetails().getEmail())).thenReturn(Optional.empty());

        // Then
        Admin result = adminService.getAdminByEmail(admin.getUserDetails().getEmail());
        assertNull(result);
    }

    @Test
    public void testEditAdmin() {
        // Given
        Admin admin = buildAdmin();

        // When
        when(adminRepository.findById(admin.getAdminId())).thenReturn(Optional.of(admin));
        when(adminRepository.save(any(Admin.class))).thenReturn(admin);

        // Then
        Admin result = adminService.editAdmin(admin.getAdminId(), admin.getUsername());
        assertEquals(result, admin);
    }

    @Test
    public void testEditAdminNotPresent() {
        // Given
        Admin admin = buildAdmin();

        // When
        when(adminRepository.findById(admin.getAdminId())).thenReturn(Optional.empty());

        // Then
        Admin result = adminService.editAdmin(admin.getAdminId(), admin.getUsername());
        assertNull(result);
    }

    @Test
    public void testGetAdminResponse() {
        // Given
        Admin admin = buildAdmin();
        AdminResponse adminResponse = new AdminResponse(admin.getAdminId(), admin.getUserDetails().getEmail(), admin.getUsername());

        // When
        when(adminRepository.findById(anyString())).thenReturn(Optional.of(admin));

        // Then
        AdminResponse result = adminService.getAdminResponse(admin.getAdminId());
        assertEquals(result, adminResponse);
    }

    @Test
    public void testGetAdminsList() {
        // Given
        Admin admin = buildAdmin();
        ArrayList<Admin> admins = new ArrayList<>();
        admins.add(admin);
        AdminListResponse adminResponse = new AdminListResponse(admin.getUserDetails().getEmail(), admin.getUsername());
        ArrayList<AdminListResponse> adminResponseList = new ArrayList<>();
        adminResponseList.add(adminResponse);

        // When
        when(adminRepository.getAllAdminsInOrder()).thenReturn(admins);

        // Then
        List<AdminListResponse> result = adminService.getAdminsList();
        assertEquals(result, adminResponseList);
    }

    @Test
    public void testGetAdminResponseNotPresent() {
        // Given
        Admin admin = buildAdmin();

        // When
        when(adminRepository.findById(anyString())).thenReturn(Optional.empty());

        // Then
        AdminResponse result = adminService.getAdminResponse(admin.getAdminId());
        assertNull(result);
    }

    @Test
    public void testUpdateCreatedAccounts() {
        // Set up test data
        String oldCreatorEmail = "oldCreator@example.com";
        String newCreatorEmail = "newCreator@example.com";
        Admin oldCreator = new Admin();
        oldCreator.setAdminId("oldCreatorId");
        User oldCreatorUser = new User();
        oldCreatorUser.setUserId("oldCreatorId");
        oldCreatorUser.setEmail(oldCreatorEmail);
        oldCreator.setUserDetails(oldCreatorUser);
        Admin newCreator = new Admin();
        newCreator.setAdminId("newCreatorId");
        User newCreatorUser = new User();
        newCreatorUser.setUserId("newCreatorId");
        newCreatorUser.setEmail(newCreatorEmail);
        newCreator.setUserDetails(newCreatorUser);

        List<Admin> adminsCreated = new ArrayList<>();

        // Populate adminsCreated list with admins created by oldCreator
        when(adminRepository.getAdminsByCreatorUserAdminId(anyString())).thenReturn(adminsCreated);
        when(adminRepository.getAdminByUserDetailsEmail(newCreatorEmail)).thenReturn(Optional.of(newCreator));
        when(adminRepository.getAdminByUserDetailsEmail(oldCreatorEmail)).thenReturn(Optional.of(oldCreator));

        // Execute method
        adminService.updateCreatedAccounts(newCreatorEmail, oldCreatorEmail);

        // Verify state changes
        for (Admin admin : adminsCreated) {
            assertEquals(newCreator, admin.getCreatorUser());
            // Verify that save method was called for each admin
            verify(adminRepository).save(admin);
        }
    }

    @Test
    public void testDeleteAdmin() {
        // Set up test data
        String adminIdToDelete = "admin123";
        Admin adminToDelete = new Admin();
        when(adminRepository.findById(adminIdToDelete)).thenReturn(Optional.of(adminToDelete));

        // Execute method
        adminService.deleteAdmin(adminIdToDelete);

        // Verify state changes
        verify(adminRepository).delete(adminToDelete);
    }

    @Test
    public void testAddAdmin() {
        // Set up test data
        String username = "newAdmin";
        User user = new User();
        String creatorAdminId = "creator123";
        Admin creatorAdmin = new Admin();
        creatorAdmin.setAdminId(creatorAdminId);
        when(adminRepository.findById(creatorAdminId)).thenReturn(Optional.of(creatorAdmin));

        // Execute method
        adminService.addAdmin(username, user, creatorAdminId);

        // Verify state changes
        ArgumentCaptor<Admin> adminCaptor = ArgumentCaptor.forClass(Admin.class);
        verify(adminRepository).save(adminCaptor.capture());
        Admin savedAdmin = adminCaptor.getValue();
        assertEquals(username, savedAdmin.getUsername());
        assertEquals(creatorAdmin, savedAdmin.getCreatorUser());
        assertEquals(user, savedAdmin.getUserDetails());
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
