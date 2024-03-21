package com.hiringPlatform.authentication.config;


import com.hiringPlatform.authentication.model.Admin;
import com.hiringPlatform.authentication.model.Role;
import com.hiringPlatform.authentication.model.User;
import com.hiringPlatform.authentication.repository.AdminRepository;
import com.hiringPlatform.authentication.repository.RoleRepository;
import com.hiringPlatform.authentication.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class DataInitializer implements CommandLineRunner {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final AdminRepository adminRepository;


    @Autowired
    public DataInitializer(UserRepository userRepository,
                           RoleRepository roleRepository,
                           AdminRepository adminRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.adminRepository = adminRepository;
    }

    @Override
    public void run(String... args) {
        try {
        // Create the roles: ADMIN, EMPLOYER, CANDIDATE
        Role adminRole = createRoleIfNotExists("ADMIN", "The admin is the one who takes care of the management of the application.");
        createRoleIfNotExists("EMPLOYER", "The employer is the one who seeks to hire a person for a job.");
        createRoleIfNotExists("CANDIDATE", "The candidate wants to be employed at a job.");
        // Create default admin user
        createUserIfNotExists("admin.joblistic@gmail.com", "adminPassword", adminRole);
        } catch (Exception e) {
            System.out.println("Database not ready");
        }
    }

    private Role createRoleIfNotExists(String roleName, String roleDesc) {
        Role roleToBeAdded = new Role();
        roleToBeAdded.setRoleName(roleName);
        roleToBeAdded.setRoleDescription(roleDesc);
        return roleRepository.findByRoleName(roleName).orElseGet(() -> roleRepository.save(roleToBeAdded));
    }

    private void createUserIfNotExists(String email, String password, Role role) {
        userRepository.findByEmail(email).orElseGet(() -> {
            User user = new User();
            user.setEmail(email);
            user.setAccountEnabled(1);
            user.setRegistrationDate(new Date());
            user.setPassword(passwordEncoder().encode(password));
            user.setUserRole(role);
            User savedUser = userRepository.save(user);
            Admin admin = new Admin();
            admin.setUsername("Admin");
            admin.setAdminId(savedUser.getUserId());
            admin.setCreatorUser(null);
            admin.setUserDetails(savedUser);
            adminRepository.save(admin);
            return savedUser;
        });
    }

    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
