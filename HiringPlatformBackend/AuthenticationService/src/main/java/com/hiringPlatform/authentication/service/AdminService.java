package com.hiringPlatform.authentication.service;

import com.hiringPlatform.authentication.model.Admin;
import com.hiringPlatform.authentication.model.User;
import com.hiringPlatform.authentication.repository.AdminRepository;
import com.hiringPlatform.authentication.repository.RoleRepository;
import com.hiringPlatform.authentication.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.Optional;

@Service
public class AdminService {

    private final UserRepository userRepository;

    private final AdminRepository adminRepository;

    @Autowired
    public AdminService(UserRepository userRepository, AdminRepository adminRepository) {
        this.userRepository = userRepository;
        this.adminRepository = adminRepository;
    }

    /**
     * Method used for login into an admin account
     * @param email the user email
     * @param password the user password
     * @return if the user data is correct the returnable is the logged used, else null
     */
    public Admin loginAdmin(String email, String password) {
        Optional<Admin> optionalUser = adminRepository.findByUserDetailsEmail(email);
        if(optionalUser.isPresent()) {
            BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();
            boolean passwordMatch = bCryptPasswordEncoder.matches(password, optionalUser.get().getUserDetails().getPassword());
            if (!passwordMatch || !Objects.equals(optionalUser.get().getUserDetails().getUserRole().getRoleName(), "ROLE_ADMIN")) {
                return null;
            } else {
                return optionalUser.get();
            }
        }
        else{
            return null;
        }
    }
}
