package com.hiringPlatform.admin.controller;

import com.hiringPlatform.admin.model.request.AddComplaintRequest;
import com.hiringPlatform.admin.model.request.UpdateComplaintRequest;
import com.hiringPlatform.admin.model.response.ComplaintResponse;
import com.hiringPlatform.admin.service.ComplaintService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class ComplaintController {

    private final ComplaintService complaintService;

    @Autowired
    public ComplaintController(ComplaintService complaintService) {
        this.complaintService = complaintService;
    }

    @GetMapping("/getAllComplaints")
    public ResponseEntity<List<ComplaintResponse>> getAllComplaints() {
        List<ComplaintResponse> response = complaintService.getAllComplaints();
        return ResponseEntity.ok(response);
    }

    @PostMapping("/addComplaint")
    public ResponseEntity<ComplaintResponse> addComplaint(@RequestBody AddComplaintRequest request) {
        ComplaintResponse response = complaintService.addComplaint(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/updateComplaintStatus")
    public ResponseEntity<List<ComplaintResponse>> updateComplaintStatus(@RequestBody UpdateComplaintRequest request) {
        List<ComplaintResponse> response = complaintService.updateComplaintStatus(request.getComplaintId(), request.getAdminId());
        return ResponseEntity.ok(response);
    }
}
