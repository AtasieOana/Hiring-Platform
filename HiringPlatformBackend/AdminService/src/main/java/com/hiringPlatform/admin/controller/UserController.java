package com.hiringPlatform.admin.controller;

import com.hiringPlatform.admin.model.request.AddAdminRequest;
import com.hiringPlatform.admin.model.request.EditAdminRequest;
import com.hiringPlatform.admin.model.response.AdminResponse;
import com.hiringPlatform.admin.model.response.LoginAdminResponse;
import com.hiringPlatform.admin.model.response.UserResponse;
import com.hiringPlatform.admin.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/getUserList")
    public ResponseEntity<List<UserResponse>> getUserList() {
        List<UserResponse> responses =  userService.getUserList();
        return ResponseEntity.ok(responses);
    }

    @PostMapping("/editAdmin")
    public ResponseEntity<LoginAdminResponse> editAdmin(@RequestBody EditAdminRequest request) {
        LoginAdminResponse response =  userService.editAdmin(request.getUserId(), request.getNewUsername(), request.getNewPassword());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/deleteAdmin/{newCreatorEmail}/{adminEmailToBeDeleted}")
    public ResponseEntity<List<UserResponse>> deleteAdmin(@PathVariable String newCreatorEmail, @PathVariable String adminEmailToBeDeleted) {
        List<UserResponse> response =  userService.deleteAdmin(newCreatorEmail, adminEmailToBeDeleted);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/addAdmin")
    public ResponseEntity<List<UserResponse>> addAdmin(@RequestBody AddAdminRequest request) {
        List<UserResponse> response =  userService.addAdmin(request);
        return ResponseEntity.ok(response);
    }
}
