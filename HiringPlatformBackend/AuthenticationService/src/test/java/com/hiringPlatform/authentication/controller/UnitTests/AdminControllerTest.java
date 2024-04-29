package com.hiringPlatform.authentication.controller.UnitTests;

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
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Date;
import java.util.Objects;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class AdminControllerTest {

    @InjectMocks
    AdminController adminController;

    @Mock
    AdminService adminService;

    @Mock
    JwtService jwtService;

    @Mock
    RedisService redisService;

    @Test
    public void testLoginAdmin() {
        // Given
        Admin admin = buildAdmin();
        LoginAdminResponse loginAdminResponse = buildLoginAdminResponse();

        // When
        when(adminService.loginAdmin(admin.getUserDetails().getEmail(), admin.getUserDetails().getPassword())).thenReturn(admin);
        when(jwtService.generateToken(any())).thenReturn("jwtToken");
        when(jwtService.getExpirationTime()).thenReturn(1L);

        // Then
        ResponseEntity<LoginAdminResponse> result = adminController.loginAdmin(admin.getUserDetails().getEmail(), admin.getUserDetails().getPassword());
        assertEquals(result.getBody(), loginAdminResponse);
        assertEquals(result.getStatusCode(), HttpStatus.OK);
    }

    @Test
    public void testLoginAdminNullUser() {
        // Given
        Admin admin = buildAdmin();
        LoginAdminResponse loginAdminResponse = buildLoginAdminResponse();
        loginAdminResponse.setToken("");
        loginAdminResponse.setAdmin(null);

        // When`
        when(adminService.loginAdmin(admin.getUserDetails().getEmail(), admin.getUserDetails().getPassword())).thenReturn(null);
        when(jwtService.getExpirationTime()).thenReturn(1L);

        // Then
        ResponseEntity<LoginAdminResponse> result = adminController.loginAdmin(admin.getUserDetails().getEmail(), admin.getUserDetails().getPassword());
        assertEquals(Objects.requireNonNull(result.getBody()).getToken(), "");
        assertEquals(result.getBody(), loginAdminResponse);
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

    private LoginAdminResponse buildLoginAdminResponse(){
        LoginAdminResponse loginAdminResponse = new LoginAdminResponse();
        loginAdminResponse.setToken("jwtToken");
        loginAdminResponse.setAdmin(buildAdmin());
        loginAdminResponse.setExpiresIn(1L);
        return loginAdminResponse;
    }

}
