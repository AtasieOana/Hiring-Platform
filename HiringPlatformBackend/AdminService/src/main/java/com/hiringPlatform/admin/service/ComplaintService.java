package com.hiringPlatform.admin.service;

import com.hiringPlatform.admin.model.Admin;
import com.hiringPlatform.admin.model.Complaint;
import com.hiringPlatform.admin.model.User;
import com.hiringPlatform.admin.model.request.AddComplaintRequest;
import com.hiringPlatform.admin.repository.ComplaintRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.hiringPlatform.admin.model.response.ComplaintResponse;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class ComplaintService {

    private final ComplaintRepository complaintRepository;

    private final AdminService adminService;

    private final UserService userService;

    @Autowired
    public ComplaintService(ComplaintRepository complaintRepository, AdminService adminService, UserService userService) {
        this.complaintRepository = complaintRepository;
        this.adminService = adminService;
        this.userService = userService;
    }

    public List<ComplaintResponse> getAllComplaints(){
        List<Complaint> allComplaints = complaintRepository.findAllOrderDescByDate();
        return allComplaints.stream().map(this::getComplaintResponse).toList();
    }

    public ComplaintResponse addComplaint(AddComplaintRequest addComplaintRequest){
        Complaint complaint = new Complaint();
        complaint.setComplaintDate(new Date());
        complaint.setMotivation(addComplaintRequest.getMotivation());
        complaint.setStatus("neprocesat");
        User complainantUser = userService.getUserByEmail(addComplaintRequest.getComplainantUserEmail());
        complaint.setComplainantUser(complainantUser);
        User complainedUser = userService.getUserByEmail(addComplaintRequest.getComplainedUserEmail());
        complaint.setComplainedUser(complainedUser);
        complaint.setProcessingAdmin(null);
        Complaint savedComplained = complaintRepository.save(complaint);
        return getComplaintResponse(savedComplained);
    }

    private ComplaintResponse getComplaintResponse(Complaint savedComplained) {
        ComplaintResponse complaintResponse = new ComplaintResponse();
        complaintResponse.setComplaintId(savedComplained.getComplaintId());
        complaintResponse.setMotivation(savedComplained.getMotivation());
        complaintResponse.setComplainantUserEmail(savedComplained.getComplainantUser().getEmail());
        complaintResponse.setComplainedUserEmail(savedComplained.getComplainedUser().getEmail());
        complaintResponse.setStatus(savedComplained.getStatus());
        if(savedComplained.getProcessingAdmin() != null){
            complaintResponse.setProcessingAdminEmail(savedComplained.getProcessingAdmin().getUserDetails().getEmail());
        }
        else{
            complaintResponse.setProcessingAdminEmail("");
        }
        complaintResponse.setComplaintDate(savedComplained.getComplaintDate());
        return complaintResponse;
    }

    public List<ComplaintResponse> updateComplaintStatus(String complaintId, String adminId){
        Optional<Complaint> optionalComplaint = complaintRepository.findById(complaintId);
        if(optionalComplaint.isPresent()){
            Complaint complaintToBeSaved = optionalComplaint.get();
            complaintToBeSaved.setStatus("procesat");
            Admin admin = adminService.getAdmin(adminId);
            complaintToBeSaved.setProcessingAdmin(admin);
            complaintRepository.save(complaintToBeSaved);
        }
        return getAllComplaints();
    }


}
