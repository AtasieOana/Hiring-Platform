package com.hiringPlatform.admin.service;

import com.hiringPlatform.admin.model.Admin;
import com.hiringPlatform.admin.model.User;
import com.hiringPlatform.admin.model.response.AdminResponse;
import com.hiringPlatform.admin.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
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

    public Admin getAdminByEmail(String adminEmail){
        Optional<Admin> optionalUser = adminRepository.getAdminByUserDetailsEmail(adminEmail);
        return optionalUser.orElse(null);
    }

    public void updateCreatedAccounts(String newCreatorUserEmail, String oldCreatorUserEmail){
        Admin newCreator = getAdminByEmail(newCreatorUserEmail);
        Admin oldCreator = getAdminByEmail(oldCreatorUserEmail);
        List<Admin> adminsCreated = adminRepository.getAdminsByCreatorUserAdminId(oldCreator.getAdminId());
        adminsCreated.forEach(admin -> {
            admin.setCreatorUser(newCreator);
            adminRepository.save(admin);
        });
    }

    public void deleteAdmin(String adminId){
        adminRepository.delete(getAdmin(adminId));
    }

    public Admin editAdmin(String adminId, String newUsername){
        Optional<Admin> optionalUser = adminRepository.findById(adminId);
        if(optionalUser.isPresent()){
            Admin adminToBeSaved = optionalUser.get();
            adminToBeSaved.setUsername(newUsername);
            return adminRepository.save(adminToBeSaved);
        }
        return null;
    }

    public void addAdmin(String username, User user, String creatorAdminId){
        Optional<Admin> creatorAdmin = adminRepository.findById(creatorAdminId);
        if(creatorAdmin.isPresent()){
            Admin adminToBeSaved = new Admin();
            adminToBeSaved.setAdminId(user.getUserId());
            adminToBeSaved.setUsername(username);
            adminToBeSaved.setCreatorUser(creatorAdmin.get());
            adminToBeSaved.setUserDetails(user);
            adminRepository.save(adminToBeSaved);
        }
    }

    public AdminResponse getAdminResponse(String adminId){
        Optional<Admin> optionalUser = adminRepository.findById(adminId);
        if(optionalUser.isPresent()){
            AdminResponse adminResponse = new AdminResponse();
            adminResponse.setEmail(optionalUser.get().getUserDetails().getEmail());
            adminResponse.setUserId(adminId);
            adminResponse.setUsername(optionalUser.get().getUsername());
            return adminResponse;
        }
        return null;
    }

}
