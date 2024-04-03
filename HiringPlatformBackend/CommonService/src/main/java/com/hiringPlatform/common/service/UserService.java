package com.hiringPlatform.common.service;

import com.hiringPlatform.common.model.*;
import com.hiringPlatform.common.model.response.UserResponse;
import com.hiringPlatform.common.repository.RoleRepository;
import com.hiringPlatform.common.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final EmployeeService employeeService;
    private final CandidateService candidateService;
    private final AdminService adminService;

    @Autowired
    public UserService(UserRepository userRepository,
                       EmployeeService employeeService,
                       CandidateService candidateService,
                       AdminService adminService) {
        this.userRepository = userRepository;
        this.employeeService = employeeService;
        this.candidateService = candidateService;
        this.adminService = adminService;
    }

    public User getUser(String userId){
        Optional<User> optionalUser = userRepository.findById(userId);
        return optionalUser.orElse(null);
    }

    public User getUserByEmail(String email){
        Optional<User> optionalUser = userRepository.findByEmail(email);
        return optionalUser.orElse(null);
    }

    public String constructNameForUser(User user){
        if(Objects.equals(user.getUserRole().getRoleName(), "ROLE_EMPLOYER")){
            Employer employer = employeeService.getEmployer(user.getUserId());
            return employer.getCompanyName();
        }
        else if(Objects.equals(user.getUserRole().getRoleName(), "ROLE_CANDIDATE")){
            Candidate candidate = candidateService.getCandidate(user.getUserId());
            return candidate.getFirstname() + " " + candidate.getLastname();
        }
        else{
            Admin admin = adminService.getAdmin(user.getUserId());
            return admin.getUsername();
        }
    }

    public List<UserResponse> getAllMappedUserExceptUser(String userEmail){
        List<User> list = userRepository.findAllOrderByEmail();
        List<UserResponse> userResponses = new ArrayList<>();
        list.forEach(user -> {
            if(!Objects.equals(user.getEmail(), userEmail) && user.getAccountEnabled() != 0){
                UserResponse userResponse = new UserResponse();
                userResponse.setEmail(user.getEmail());
                userResponse.setRoleName(user.getUserRole().getRoleName());
                userResponse.setName(constructNameForUser(user));
                userResponses.add(userResponse);
            }
        });
        return userResponses;
    }

    public List<User> findUsersByRole(String roleName){
        return userRepository.findAllByUserRole_RoleName(roleName);
    }
}
