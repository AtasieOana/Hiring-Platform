package com.hiringPlatform.admin.controller.IntegrationTests;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.hiringPlatform.admin.controller.ComplaintController;
import com.hiringPlatform.admin.model.User;
import com.hiringPlatform.admin.model.request.AddComplaintRequest;
import com.hiringPlatform.admin.model.request.UpdateComplaintRequest;
import com.hiringPlatform.admin.model.response.ComplaintResponse;
import com.hiringPlatform.admin.security.JwtService;
import com.hiringPlatform.admin.service.ComplaintService;
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
@WebMvcTest(controllers = ComplaintController.class)
@ContextConfiguration(classes = {JwtService.class, RedisService.class})
@WithMockUser
@ActiveProfiles("test")
@Import(ComplaintController.class)
public class ComplaintControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    ComplaintService complaintService;

    @MockBean
    JwtService jwtService;

    @MockBean
    RedisService redisService;

    @Test
    public void testGetAllComplaints() throws Exception {
        // Given
        List<ComplaintResponse> complaintResponses = List.of(buildComplaintResponse());

        // When
        when(complaintService.getAllComplaints()).thenReturn(complaintResponses);

        // Then
        mockMvc.perform(get("/getAllComplaints"))
                .andExpect(status().isOk())
                .andExpect(content().string(objectMapper.writeValueAsString(complaintResponses)));
    }

    @Test
    public void testAddComplaint() throws Exception {
        // Given
        AddComplaintRequest addComplaintRequest = new AddComplaintRequest("motivation", "complainantUserEmail", "complainedUserEmail");
        ComplaintResponse complaintResponse = buildComplaintResponse();

        // When
        when(complaintService.addComplaint(any())).thenReturn(complaintResponse);

        // Then
        mockMvc.perform(post("/addComplaint").contentType("application/json")
                        .content(objectMapper.writeValueAsString(addComplaintRequest)).with(csrf()))
                .andExpect(status().isOk())
                .andExpect(content().string(objectMapper.writeValueAsString(complaintResponse)));
    }

    @Test
    public void testUpdateComplaintStatus() throws Exception {
        // Given
        UpdateComplaintRequest request = new UpdateComplaintRequest("1", "1");
        List<ComplaintResponse> complaintResponses = List.of(buildComplaintResponse());

        // When
        when(complaintService.updateComplaintStatus(anyString(), anyString())).thenReturn(complaintResponses);

        // Then
        mockMvc.perform(post("/updateComplaintStatus").contentType("application/json")
                        .content(objectMapper.writeValueAsString(request)).with(csrf()))
                .andExpect(status().isOk())
                .andExpect(content().string(objectMapper.writeValueAsString(complaintResponses)));
    }

    private ComplaintResponse buildComplaintResponse(){
        ComplaintResponse complaint = new ComplaintResponse();
        User complainantUser = new User();
        complainantUser.setUserId("complainantUserId");
        complainantUser.setEmail("complainantUserEmail");
        User complainedUser = new User();
        complainantUser.setUserId("complainedUserId");
        complainantUser.setEmail("complainedUserEmail");
        complaint.setComplaintDate(new Date(2000));
        complaint.setComplainantUserEmail(complainantUser.getEmail());
        complaint.setMotivation("motivation");
        complaint.setStatus("neprocesat");
        complaint.setComplainedUserEmail(complainedUser.getEmail());
        complaint.setProcessingAdminEmail("");
        return complaint;
    }

}
