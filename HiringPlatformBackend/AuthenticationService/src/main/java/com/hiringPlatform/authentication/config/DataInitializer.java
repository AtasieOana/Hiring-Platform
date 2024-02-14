package com.hiringPlatform.authentication.config;

import com.hiringPlatform.authentication.model.Admin;
import com.hiringPlatform.authentication.model.Role;
import com.hiringPlatform.authentication.model.User;
import com.hiringPlatform.authentication.repository.AdminRepository;
import com.hiringPlatform.authentication.repository.RoleRepository;
import com.hiringPlatform.authentication.repository.UserRepository;
import com.hiringPlatform.authentication.service.RedisService;
import com.hiringPlatform.authentication.service.UserService;
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

    private final RedisService redisService;

    @Autowired
    public DataInitializer(UserRepository userRepository, RoleRepository roleRepository, AdminRepository adminRepository, RedisService redisService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.adminRepository = adminRepository;
        this.redisService = redisService;
    }

    @Override
    public void run(String... args) {
        // Remove Redis config
        redisService.removeData("userToken");
        // Create the roles: ADMIN, EMPLOYER, CANDIDATE
        Role adminRole = createRoleIfNotExists("ROLE_ADMIN", "The admin is the one who takes care of the management of the application.");
        createRoleIfNotExists("ROLE_EMPLOYER", "The employer is the one who seeks to hire a person for a job.");
        createRoleIfNotExists("ROLE_CANDIDATE", "The candidate wants to be employed at a job.");
        // Create default admin user
        createUserIfNotExists("admin@gmail.com", "adminPassword", adminRole);
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
            admin.setUserDetails(savedUser);
            admin.setCreatorUser(null);
            adminRepository.save(admin);
            return userRepository.save(user);
        });
    }

    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}