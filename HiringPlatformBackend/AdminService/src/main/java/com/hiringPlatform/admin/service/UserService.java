package com.hiringPlatform.admin.service;

import com.hiringPlatform.admin.exception.EmailAlreadyExistsException;
import com.hiringPlatform.admin.model.*;
import com.hiringPlatform.admin.model.request.AddAdminRequest;
import com.hiringPlatform.admin.model.response.LoginAdminResponse;
import com.hiringPlatform.admin.model.response.UserResponse;
import com.hiringPlatform.admin.repository.RoleRepository;
import com.hiringPlatform.admin.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final CandidateService candidateService;
    private final EmployerService employerService;
    private final AdminService adminService;
    private final RoleRepository roleRepository;
    private final RedisService redisService;

    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    public UserService(UserRepository userRepository,
                       CandidateService candidateService,
                       EmployerService employerService,
                       AdminService adminService,
                       RoleRepository roleRepository,
                       RedisService redisService,
                       BCryptPasswordEncoder bCryptPasswordEncoder
                       ) {
        this.userRepository = userRepository;
        this.candidateService = candidateService;
        this.employerService = employerService;
        this.adminService = adminService;
        this.roleRepository = roleRepository;
        this.redisService = redisService;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    public List<UserResponse> getUserList(){
        List<User> userList = userRepository.findAll();
        List<UserResponse> response = new ArrayList<>();
        userList.forEach(user -> {
            UserResponse userResponse = new UserResponse();
            userResponse.setUserRole(user.getUserRole().getRoleName());
            userResponse.setUserId(user.getUserId());
            userResponse.setRegistrationDate(user.getRegistrationDate());
            userResponse.setEmail(user.getEmail());
            userResponse.setAccountEnabled(user.getAccountEnabled());
            if(Objects.equals(user.getUserRole().getRoleName(), "ROLE_EMPLOYER")){
                Employer employer = employerService.getEmployer(user.getUserId());
                userResponse.setUserName(employer.getCompanyName());
                userResponse.setUsernameCreator("");
                userResponse.setIdCreator("");
            }
            else if(Objects.equals(user.getUserRole().getRoleName(), "ROLE_CANDIDATE")){
                Candidate candidate = candidateService.getCandidate(user.getUserId());
                userResponse.setUserName(candidate.getFirstname() + " " + candidate.getLastname());
                userResponse.setUsernameCreator("");
                userResponse.setIdCreator("");
            } else{
                Admin admin = adminService.getAdmin(user.getUserId());
                userResponse.setUserName(admin.getUsername());
                if(admin.getCreatorUser() != null){
                    userResponse.setUsernameCreator(admin.getCreatorUser().getUsername());
                    userResponse.setIdCreator(admin.getCreatorUser().getAdminId());
                }
                else{
                    userResponse.setUsernameCreator("");
                    userResponse.setIdCreator("");
                }
            }
            response.add(userResponse);
        }
        );
        return response;
    }

    public LoginAdminResponse editAdmin(String adminId, String newUsername, String newPassword){
        String userToken = redisService.getData("userToken");
        Optional<User> optionalUser = userRepository.findById(adminId);
        if(optionalUser.isPresent()){
            // Save edited user in db
            User userToBeSaved = optionalUser.get();
            if(!newPassword.isEmpty()) {
                String encodedPassword = bCryptPasswordEncoder.encode(newPassword);
                userToBeSaved.setPassword(encodedPassword);
            }
            else {
                userToBeSaved.setPassword(userToBeSaved.getPassword());
            }
            userRepository.save(userToBeSaved);
            // Save edited admin in db
            Admin admin = adminService.editAdmin(adminId, newUsername);
            LoginAdminResponse response = new LoginAdminResponse();
            response.setToken(userToken);
            response.setAdmin(admin);
            return response;
        }
        else{
            return null;
        }
    }

    public List<UserResponse> deleteAdmin(String newCreatorUserEmail, String adminEmailToBeDeleted){
        Admin admin = adminService.getAdminByEmail(adminEmailToBeDeleted);
        if(admin != null){
            // Update creator for others admins that was created by the user to be deleted
            adminService.updateCreatedAccounts(newCreatorUserEmail, adminEmailToBeDeleted);
            // Delete admin and user entry
            adminService.deleteAdmin(admin.getAdminId());
            userRepository.delete(admin.getUserDetails());
        }
        return getUserList();
    }

    public List<UserResponse> addAdmin(AddAdminRequest request){
        Optional<User> optionalUser = userRepository.findByEmail(request.getEmail());
        if(optionalUser.isPresent()){
            throw new EmailAlreadyExistsException("A user with this email already exists!");
        }
        else{
            // Save user in db
            User user = new User();
            user.setEmail(request.getEmail());
            String encodedPassword = bCryptPasswordEncoder.encode(request.getPassword());
            user.setPassword(encodedPassword);
            user.setRegistrationDate(new Date());
            user.setAccountEnabled(1);
            Optional<Role> role = roleRepository.findByRoleName("ROLE_ADMIN");
            role.ifPresent(user::setUserRole);
            User savedUser = userRepository.save(user);
            // Save admin in db
            adminService.addAdmin(request.getUsername(), savedUser, request.getCreatorId());
            return getUserList();
        }
    }

    public User getUserByEmail(String email){
        Optional<User> user = userRepository.findByEmail(email);
        return user.orElse(null);
    }
}
