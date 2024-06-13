package com.hiringPlatform.common.controller.IntegrationTests;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hiringPlatform.common.controller.UserController;
import com.hiringPlatform.common.model.Candidate;
import com.hiringPlatform.common.model.Role;
import com.hiringPlatform.common.model.User;
import com.hiringPlatform.common.model.response.GetLoggedUserResponse;
import com.hiringPlatform.common.security.JwtService;
import com.hiringPlatform.common.service.UserService;
import com.hiringPlatform.common.service.RedisService;
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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
@WebMvcTest(controllers = UserController.class)
@WithMockUser
@ContextConfiguration(classes = {JwtService.class, RedisService.class})
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

    private Candidate buildCandidate(){
        Candidate candidate = new Candidate();
        User user = new User();
        user.setUserId("1");
        user.setEmail("test@example.com");
        user.setPassword("testPassword");
        Role role = new Role("1", "ROLE_EMPLOYER", "description");
        user.setUserRole(role);
        user.setAccountEnabled(1);
        candidate.setUserDetails(user);
        candidate.setFirstname("test");
        candidate.setLastname("test");
        candidate.setCandidateId("1");
        return candidate;
    }

    private GetLoggedUserResponse buildGetLoggedUserResponse(){
        GetLoggedUserResponse response = new GetLoggedUserResponse();
        response.setHasCv(true);
        response.setToken("token");
        response.setCandidate(buildCandidate());
        return response;
    }
}
