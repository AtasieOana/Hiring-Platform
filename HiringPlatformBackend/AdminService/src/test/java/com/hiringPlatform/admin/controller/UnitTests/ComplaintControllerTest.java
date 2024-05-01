package com.hiringPlatform.admin.controller.UnitTests;


import com.hiringPlatform.admin.controller.ComplaintController;
import com.hiringPlatform.admin.model.User;
import com.hiringPlatform.admin.model.request.AddComplaintRequest;
import com.hiringPlatform.admin.model.request.UpdateComplaintRequest;
import com.hiringPlatform.admin.model.response.ComplaintResponse;
import com.hiringPlatform.admin.service.ComplaintService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Date;
import java.util.List;
import java.util.Objects;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class ComplaintControllerTest {

    @InjectMocks
    ComplaintController complaintController;

    @Mock
    ComplaintService complaintService;

    @Test
    public void testGetAllComplaints() {
        // Given
        List<ComplaintResponse> complaintResponses = List.of(buildComplaintResponse());

        // When
        when(complaintService.getAllComplaints()).thenReturn(complaintResponses);

        // Then
        ResponseEntity<List<ComplaintResponse>> result = complaintController.getAllComplaints();
        assertEquals(complaintResponses.size(), Objects.requireNonNull(result.getBody()).size());
        assertEquals(complaintResponses, result.getBody());
        assertEquals(result.getStatusCode(), HttpStatus.OK);
    }

    @Test
    public void testAddComplaint() {
        // Given
        AddComplaintRequest addComplaintRequest = new AddComplaintRequest("motivation", "complainantUserEmail", "complainedUserEmail");
        ComplaintResponse complaintResponse = buildComplaintResponse();

        // When
        when(complaintService.addComplaint(any())).thenReturn(complaintResponse);

        // Then
        ResponseEntity<ComplaintResponse> result = complaintController.addComplaint(addComplaintRequest);
        assertEquals(result.getBody(), complaintResponse);
        assertNotNull(result.getBody());
        assertEquals(result.getStatusCode(), HttpStatus.OK);
    }

    @Test
    public void testUpdateComplaintStatus() {
        // Given
        UpdateComplaintRequest request = new UpdateComplaintRequest("1", "1");
        List<ComplaintResponse> complaintResponses = List.of(buildComplaintResponse());

        // When
        when(complaintService.updateComplaintStatus(anyString(), anyString())).thenReturn(complaintResponses);

        // Then
        ResponseEntity<List<ComplaintResponse>> result = complaintController.updateComplaintStatus(request);
        assertEquals(result.getBody(), complaintResponses);
        assertEquals(result.getStatusCode(), HttpStatus.OK);
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
