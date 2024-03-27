package com.hiringPlatform.admin.controller;

import com.hiringPlatform.admin.model.response.AdminListResponse;
import com.hiringPlatform.admin.model.response.AdminResponse;
import com.hiringPlatform.admin.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    private final AdminService adminService;

    @Autowired
    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/getAdmin/{adminId}")
    public ResponseEntity<AdminResponse> getUserList(@PathVariable String adminId) {
        AdminResponse response = adminService.getAdminResponse(adminId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/getAdminList")
    public ResponseEntity<List<AdminListResponse>> getAdminList() {
        List<AdminListResponse> response = adminService.getAdminsList();
        return ResponseEntity.ok(response);
    }
}
