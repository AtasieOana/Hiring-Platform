package com.hiringPlatform.admin.service;


import com.hiringPlatform.admin.exception.EmailAlreadyExistsException;
import com.hiringPlatform.admin.model.*;
import com.hiringPlatform.admin.model.request.AddAdminRequest;
import com.hiringPlatform.admin.model.response.LoginAdminResponse;
import com.hiringPlatform.admin.model.response.UserResponse;
import com.hiringPlatform.admin.repository.RoleRepository;
import com.hiringPlatform.admin.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @InjectMocks
    UserService userService;
    @Mock
    UserRepository userRepository;
    @Mock
    CandidateService candidateService;
    @Mock
    EmployerService employerService;
    @Mock
    AdminService adminService;
    @Mock
    RoleRepository roleRepository;
    @Mock
    RedisService redisService;
    @Mock
    BCryptPasswordEncoder bCryptPasswordEncoder;

    @BeforeEach
    void setUp() {
        // Mocking the BCryptPasswordEncoder
        bCryptPasswordEncoder = Mockito.mock(BCryptPasswordEncoder.class);
        userService = new UserService(userRepository, candidateService,
                employerService, adminService, roleRepository,
                redisService, bCryptPasswordEncoder);
    }

    @Test
    public void testGetUserByEmailPresent() {
        // Given
        User user = buildUserEmployer();

        // When
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));

        // Then
        User result = userService.getUserByEmail(user.getEmail());
        assertEquals(result, user);
    }

    @Test
    public void testGetUserByEmailNotPresent() {
        // Given
        User user = buildUserEmployer();

        // When
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.empty());

        // Then
        User result = userService.getUserByEmail(user.getEmail());
        assertNull(result);
    }

    @Test
    public void testAddAdmin() {
        // Given
        User user = buildUserAdmin();
        UserResponse userResponse = buildUserResponseAdmin();
        List<UserResponse> userResponseList = List.of(userResponse);
        AddAdminRequest request = new AddAdminRequest(userResponse.getIdCreator(),
                userResponse.getUserName(), user.getPassword(), user.getEmail());

        // When
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());
        when(bCryptPasswordEncoder.encode(anyString())).thenReturn(user.getPassword());
        when(roleRepository.findByRoleName(anyString())).thenReturn(Optional.of(user.getUserRole()));
        when(userRepository.save(any(User.class))).thenReturn(user);
        when(userRepository.findAll()).thenReturn(List.of(user));
        when(adminService.getAdmin(anyString())).thenReturn(buildAdmin());

        // Then
        List<UserResponse> result = userService.addAdmin(request);
        assertEquals(result, userResponseList);
    }

    @Test
    public void testAddAdminUserAlreadyExists() {
        // Given
        User user = buildUserAdmin();
        UserResponse userResponse = buildUserResponseAdmin();
        AddAdminRequest request = new AddAdminRequest(userResponse.getIdCreator(),
                userResponse.getUserName(), user.getPassword(), user.getEmail());

        // When
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(user));
        // Then
        EmailAlreadyExistsException emailAlreadyExistsException = assertThrows(EmailAlreadyExistsException.class, () -> userService.addAdmin(request));
        assertEquals("A user with this email already exists!", emailAlreadyExistsException.getMessage());
    }

    @Test
    public void testDeleteAdmin() {
        // Given
        User user = buildUserAdmin();
        Admin admin = buildAdmin();
        UserResponse userResponse = buildUserResponseAdmin();
        List<UserResponse> userResponseList = List.of(userResponse);

        // When
        when(adminService.getAdminByEmail(anyString())).thenReturn(admin);
        when(userRepository.findAll()).thenReturn(List.of(user));
        when(adminService.getAdmin(anyString())).thenReturn(buildAdmin());

        // Then
        List<UserResponse> result = userService.deleteAdmin(admin.getUserDetails().getEmail(), admin.getUserDetails().getEmail());
        assertEquals(result, userResponseList);
    }

    @Test
    public void testDeleteAdminNotPresent() {
        // Given
        User user = buildUserAdmin();
        Admin admin = buildAdmin();
        UserResponse userResponse = buildUserResponseAdmin();
        List<UserResponse> userResponseList = List.of(userResponse);

        // When
        when(adminService.getAdminByEmail(anyString())).thenReturn(null);
        when(userRepository.findAll()).thenReturn(List.of(user));
        when(adminService.getAdmin(anyString())).thenReturn(buildAdmin());

        // Then
        List<UserResponse> result = userService.deleteAdmin(admin.getUserDetails().getEmail(), admin.getUserDetails().getEmail());
        assertEquals(result, userResponseList);
    }

    @Test
    public void testEditAdminPresent() {
        // Given
        User user = buildUserAdmin();
        Admin admin = buildAdmin();
        LoginAdminResponse response = buildLoginAdminResponse();

        // When
        when(redisService.getData(anyString())).thenReturn("token");
        when(userRepository.findById(anyString())).thenReturn(Optional.of(user));
        when(bCryptPasswordEncoder.encode(anyString())).thenReturn(user.getPassword());
        when(userRepository.save(any(User.class))).thenReturn(user);
        when(adminService.editAdmin(anyString(), anyString())).thenReturn(admin);

        // Then
        LoginAdminResponse result = userService.editAdmin(admin.getAdminId(), admin.getUsername(), user.getPassword());
        assertEquals(result, response);
    }

    @Test
    public void testEditAdminNotPresent() {
        // Given
        User user = buildUserAdmin();
        Admin admin = buildAdmin();

        // When
        when(redisService.getData(anyString())).thenReturn("token");
        when(userRepository.findById(anyString())).thenReturn(Optional.empty());

        // Then
        LoginAdminResponse result = userService.editAdmin(admin.getAdminId(), admin.getUsername(), user.getPassword());
        assertNull(result);
    }

    @Test
    public void testEditAdminPasswordEmpty() {
        // Given
        User user = buildUserAdmin();
        user.setPassword("");
        Admin admin = buildAdmin();
        LoginAdminResponse response = buildLoginAdminResponse();

        // When
        when(redisService.getData(anyString())).thenReturn("token");
        when(userRepository.findById(anyString())).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);
        when(adminService.editAdmin(anyString(), anyString())).thenReturn(admin);

        // Then
        LoginAdminResponse result = userService.editAdmin(admin.getAdminId(), admin.getUsername(), user.getPassword());
        assertEquals(result, response);
    }

    @Test
    public void testGetUserList() {
        // Given
        User userAdmin = buildUserAdmin();
        User userEmp = buildUserEmployer();
        User userCandidate= buildUserCandidate();
        UserResponse userResponseAdmin = buildUserResponseAdmin();
        UserResponse userResponseEmp = buildUserResponseEmployer();
        UserResponse userResponseCandidate = buildUserResponseCandidate();
        List<UserResponse> userResponseList = List.of(userResponseEmp, userResponseAdmin, userResponseCandidate);
        List<User> userList = List.of(userEmp, userAdmin, userCandidate);

        // When
        when(userRepository.findAll()).thenReturn(userList);
        when(adminService.getAdmin(anyString())).thenReturn(buildAdmin());
        when(employerService.getEmployer(anyString())).thenReturn(buildEmployer());
        when(candidateService.getCandidate(anyString())).thenReturn(buildCandidate());

        // Then
        List<UserResponse> result = userService.getUserList();
        assertEquals(result, userResponseList);
    }

    private User buildUserEmployer(){
        User user = new User();
        user.setUserId("testUserId");
        user.setEmail("test@example.com");
        user.setPassword("testPassword");
        user.setRegistrationDate(new Date(2000));
        Role role = new Role("1", "ROLE_EMPLOYER", "description");
        user.setUserRole(role);
        user.setAccountEnabled(1);
        return user;
    }

    private User buildUserAdmin(){
        User user = new User();
        user.setUserId("testUserId");
        user.setEmail("test@example.com");
        user.setPassword("testPassword");
        user.setRegistrationDate(new Date(2000));
        Role role = new Role("1", "ROLE_ADMIN", "description");
        user.setUserRole(role);
        user.setAccountEnabled(1);
        return user;
    }

    private User buildUserCandidate(){
        User user = new User();
        user.setUserId("testUserId");
        user.setEmail("test@example.com");
        user.setPassword("testPassword");
        user.setRegistrationDate(new Date(2000));
        Role role = new Role("1", "ROLE_CANDIDATE", "description");
        user.setUserRole(role);
        user.setAccountEnabled(1);
        return user;
    }

    private UserResponse buildUserResponseEmployer(){
        UserResponse user = new UserResponse();
        user.setUserId("testUserId");
        user.setEmail("test@example.com");
        user.setRegistrationDate(new Date(2000));
        user.setUserName("Company");
        Role role = new Role("1", "ROLE_EMPLOYER", "description");
        user.setUserRole(role.getRoleName());
        user.setAccountEnabled(1);
        user.setIdCreator("");
        user.setUsernameCreator("");
        return user;
    }

    private UserResponse buildUserResponseCandidate(){
        UserResponse user = new UserResponse();
        user.setUserId("testUserId");
        user.setEmail("test@example.com");
        user.setUserName("test test");
        user.setRegistrationDate(new Date(2000));
        Role role = new Role("1", "ROLE_CANDIDATE", "description");
        user.setUserRole(role.getRoleName());
        user.setAccountEnabled(1);
        user.setIdCreator("");
        user.setUsernameCreator("");
        return user;
    }

    private UserResponse buildUserResponseAdmin(){
        UserResponse user = new UserResponse();
        user.setUserId("testUserId");
        user.setEmail("test@example.com");
        user.setRegistrationDate(new Date(2000));
        user.setUserName("testName");
        Role role = new Role("1", "ROLE_ADMIN", "description");
        user.setUserRole(role.getRoleName());
        user.setAccountEnabled(1);
        user.setUsernameCreator("usernameCreator");
        user.setIdCreator("testCreatorId");
        return user;
    }

    private Employer buildEmployer(){
        Employer employer = new Employer();
        employer.setUserDetails(buildUserEmployer());
        employer.setCompanyName("Company");
        employer.setEmployerId("testUserId");
        return employer;
    }

    private Admin buildAdmin(){
        Admin admin = new Admin();
        admin.setAdminId("testId");
        admin.setUsername("testName");
        User user = new User();
        user.setUserId("testId");
        user.setEmail("testEmail");
        user.setUserRole(new Role("roleId", "ROLE_ADMIN", "desc"));
        user.setPassword("testPassword");
        user.setRegistrationDate(new Date(2000));
        user.setAccountEnabled(1);
        admin.setUserDetails(user);
        admin.setCreatorUser(buildAdminCreator());
        return admin;
    }

    private Admin buildAdminCreator(){
        Admin admin = new Admin();
        admin.setAdminId("testCreatorId");
        admin.setUsername("usernameCreator");
        User user = new User();
        user.setUserId("testId");
        user.setEmail("testEmail");
        user.setUserRole(new Role("roleId", "ROLE_ADMIN", "desc"));
        user.setPassword("testPassword");
        user.setRegistrationDate(new Date(2000));
        user.setAccountEnabled(1);
        admin.setUserDetails(user);
        admin.setCreatorUser(null);
        return admin;
    }

    private Candidate buildCandidate(){
        Candidate candidate = new Candidate();
        candidate.setUserDetails(buildUserCandidate());
        candidate.setFirstname("test");
        candidate.setLastname("test");
        candidate.setCandidateId("testUserId");
        return candidate;
    }

    private LoginAdminResponse buildLoginAdminResponse(){
        LoginAdminResponse response = new LoginAdminResponse();
        response.setAdmin(buildAdmin());
        response.setExpiresIn(0L);
        response.setToken("token");
        return response;
    }
}
