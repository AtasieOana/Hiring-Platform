package com.hiringPlatform.admin.service;


import com.hiringPlatform.admin.model.Admin;
import com.hiringPlatform.admin.model.Complaint;
import com.hiringPlatform.admin.model.User;
import com.hiringPlatform.admin.model.request.AddComplaintRequest;
import com.hiringPlatform.admin.model.response.ComplaintResponse;
import com.hiringPlatform.admin.repository.ComplaintRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class ComplaintServiceTest {

    @InjectMocks
    ComplaintService complaintService;

    @Mock
    ComplaintRepository complaintRepository;

    @Mock
    AdminService adminService;

    @Mock
    UserService userService;

    @Test
    public void testGetAllComplaints() {
        // Given
        List<Complaint> complaints = List.of(buildComplaint());
        List<ComplaintResponse> complaintResponses = List.of(buildComplaintResponse());

        // When
        when(complaintRepository.findAllOrderDescByDate()).thenReturn(complaints);

        // Then
        List<ComplaintResponse> result = complaintService.getAllComplaints();
        assertEquals(complaintResponses.size(), result.size());
        assertEquals(complaintResponses, result);
    }

    @Test
    public void testAddComplaint() {
        // Given
        AddComplaintRequest addComplaintRequest = new AddComplaintRequest("motivation", "complainantUserEmail", "complainedUserEmail");
        Complaint complaint = buildComplaint();
        ComplaintResponse complaintResponse = buildComplaintResponse();

        // When
        when(userService.getUserByEmail(anyString())).thenReturn(complaint.getComplainantUser());
        when(complaintRepository.save(any(Complaint.class))).thenReturn(complaint);

        // Then
        ComplaintResponse result = complaintService.addComplaint(addComplaintRequest);
        assertEquals(result, complaintResponse);
        assertNotNull(result);
    }

    @Test
    public void testUpdateComplaintStatus() {
        // Given
        Complaint complaint = buildComplaint();
        List<Complaint> complaints = List.of(buildComplaint());
        List<ComplaintResponse> complaintResponses = List.of(buildComplaintResponse());

        // When
        when(complaintRepository.findById(anyString())).thenReturn(Optional.of(complaint));
        when(adminService.getAdmin(anyString())).thenReturn(new Admin());
        when(complaintRepository.save(any(Complaint.class))).thenReturn(complaint);
        when(complaintRepository.findAllOrderDescByDate()).thenReturn(complaints);

        // Then
        List<ComplaintResponse> result = complaintService.updateComplaintStatus("1", "1");
        assertEquals(result, complaintResponses);
    }

    private Complaint buildComplaint(){
        Complaint complaint = new Complaint();
        User complainantUser = new User();
        complainantUser.setUserId("complainantUserId");
        complainantUser.setEmail("complainantUserEmail");
        User complainedUser = new User();
        complainantUser.setUserId("complainedUserId");
        complainantUser.setEmail("complainedUserEmail");
        complaint.setComplaintDate(new Date(2000));
        complaint.setComplainantUser(complainantUser);
        complaint.setMotivation("motivation");
        complaint.setStatus("neprocesat");
        complaint.setComplainedUser(complainedUser);
        complaint. setProcessingAdmin(null);
        return complaint;
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
