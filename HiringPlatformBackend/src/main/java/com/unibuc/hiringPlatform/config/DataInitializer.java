package com.unibuc.hiringPlatform.config;

import com.unibuc.hiringPlatform.model.Role;
import com.unibuc.hiringPlatform.model.User;
import com.unibuc.hiringPlatform.repository.RoleRepository;
import com.unibuc.hiringPlatform.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    @Autowired
    public DataInitializer(UserRepository userRepository, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    @Override
    public void run(String... args) {
        // Create the roles: ADMIN, EMPLOYER, CANDIDATE
        Role adminRole = createRoleIfNotExists("ADMIN", "The admin is the one who takes care of the management of the application.");
        createRoleIfNotExists("EMPLOYER", "The employer is the one who seeks to hire a person for a job.");
        createRoleIfNotExists("CANDIDATE", "The candidate wants to be employed at a job.");
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
            user.setUsername("Admin");
            user.setEmail(email);
            user.setAccountEnabled(1);
            user.setRegistrationDate(new Date());
            user.setPassword(passwordEncoder().encode(password));
            user.setUserRole(role);
            return userRepository.save(user);
        });
    }

    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}