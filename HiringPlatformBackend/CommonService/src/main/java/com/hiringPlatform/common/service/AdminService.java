package com.hiringPlatform.common.service;

import com.hiringPlatform.common.model.Admin;
import com.hiringPlatform.common.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AdminService {

    private final AdminRepository adminRepository;

    @Autowired
    public AdminService(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    public Admin getAdmin(String adminId){
        Optional<Admin> optionalUser = adminRepository.findById(adminId);
        return optionalUser.orElse(null);
    }
}
