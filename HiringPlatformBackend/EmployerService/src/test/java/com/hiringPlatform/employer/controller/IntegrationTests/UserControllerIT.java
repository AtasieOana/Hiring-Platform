package com.hiringPlatform.employer.controller.IntegrationTests;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hiringPlatform.employer.controller.UserController;
import com.hiringPlatform.employer.model.Employer;
import com.hiringPlatform.employer.model.Role;
import com.hiringPlatform.employer.model.User;
import com.hiringPlatform.employer.model.request.UpdateEmployerAccount;
import com.hiringPlatform.employer.model.response.EmployerResponse;
import com.hiringPlatform.employer.model.response.GetLoggedUserResponse;
import com.hiringPlatform.employer.security.JwtService;
import com.hiringPlatform.employer.service.RedisService;
import com.hiringPlatform.employer.service.UserService;
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
    public void testGetLoggedUser() throws Exception {
        // Given
        GetLoggedUserResponse response = buildGetLoggedUserResponse();

        // When
        when(userService.getLoggedUser()).thenReturn(response);

        // Then
        mockMvc.perform(get("/getLoggedUser"))
                .andExpect(status().isOk())
                .andExpect(content().string(objectMapper.writeValueAsString(response)));
    }

    @Test
    public void testUpdateEmployerAccount() throws Exception {
        // When
        when(userService.updateEmployerAccount(buildUpdateEmployerAccount())).thenReturn(buildEmployerResponse());

        // Then
        mockMvc.perform(post("/updateAccount").contentType("application/json")
                        .content(objectMapper.writeValueAsString(buildUpdateEmployerAccount())).with(csrf()))
                .andExpect(status().isOk())
                .andExpect(content().string(objectMapper.writeValueAsString(buildEmployerResponse())));
    }

    private UpdateEmployerAccount buildUpdateEmployerAccount(){
        UpdateEmployerAccount updateEmployerAccount = new UpdateEmployerAccount();
        updateEmployerAccount.setEmail("test@example.com");
        updateEmployerAccount.setNewCompanyName("test");
        updateEmployerAccount.setNewPassword("testPassword");
        return updateEmployerAccount;
    }

    private EmployerResponse buildEmployerResponse(){
        EmployerResponse employerResponse = new EmployerResponse();
        employerResponse.setEmployer(buildEmployer());
        employerResponse.setToken("token");
        return employerResponse;
    }

    private Employer buildEmployer(){
        Employer employer = new Employer();
        User user = new User();
        user.setUserId("1");
        user.setEmail("test@example.com");
        user.setPassword("testPassword");
        Role role = new Role("1", "ROLE_EMPLOYER", "description");
        user.setUserRole(role);
        user.setAccountEnabled(1);
        employer.setUserDetails(user);
        employer.setCompanyName("test");
        employer.setEmployerId("1");
        return employer;
    }

    private GetLoggedUserResponse buildGetLoggedUserResponse(){
        GetLoggedUserResponse response = new GetLoggedUserResponse();
        response.setHasProfile(true);
        response.setToken("token");
        response.setEmployer(buildEmployer());
        return response;
    }
}
