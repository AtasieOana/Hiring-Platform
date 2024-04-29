package com.hiringPlatform.authentication.service;

import com.hiringPlatform.authentication.model.Candidate;
import com.hiringPlatform.authentication.model.Employer;
import com.hiringPlatform.authentication.model.Role;
import com.hiringPlatform.authentication.model.User;
import com.hiringPlatform.authentication.model.request.RegisterCandidateRequest;
import com.hiringPlatform.authentication.model.request.RegisterEmployerRequest;
import com.hiringPlatform.authentication.model.request.ResetPasswordRequest;
import com.hiringPlatform.authentication.model.request.UserGoogleRequest;
import com.hiringPlatform.authentication.model.response.RegisterResponse;
import com.hiringPlatform.authentication.repository.RoleRepository;
import com.hiringPlatform.authentication.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @InjectMocks
    UserService userService;

    @Mock
    UserRepository userRepository;

    @Mock
    AuthenticationTokenService authenticationTokenService;

    @Mock
    CandidateService candidateService;

    @Mock
    RoleRepository roleRepository;

    @Mock
    EmployerService employerService;

    @Mock
    RestTemplate restTemplate;

    @Mock
    BCryptPasswordEncoder bCryptPasswordEncoder;

    @BeforeEach
    void setUp() {
        // Mocking the BCryptPasswordEncoder
        bCryptPasswordEncoder = Mockito.mock(BCryptPasswordEncoder.class);
        userService = new UserService(userRepository, authenticationTokenService,
                roleRepository, candidateService, employerService,
                restTemplate, bCryptPasswordEncoder);
    }

    @Test
    public void testSignUpCandidateAlreadyExistsAccount() {
        // Given
        Candidate candidate = buildCandidate();
        RegisterCandidateRequest userRequest = buildRegisterCandidateRequest();

        // When
        when(userRepository.findByEmail(candidate.getUserDetails().getEmail())).thenReturn(Optional.of(candidate.getUserDetails()));

        // Then
        RegisterResponse response = userService.signUpCandidate(userRequest);
        verify(authenticationTokenService).sendAuthenticationEmail(candidate.getUserDetails(), true);
        assertEquals("test@example.com", response.getEmail());
        assertEquals("ROLE_CANDIDATE", response.getRoleName());
    }

    @Test
    public void testSignUpCandidateNewAccount() {
        // Given
        Candidate candidate = buildCandidate();
        RegisterCandidateRequest userRequest = buildRegisterCandidateRequest();

        // When
        when(userRepository.findByEmail(candidate.getUserDetails().getEmail())).thenReturn(Optional.of(candidate.getUserDetails()));

        // Then
        RegisterResponse response = userService.signUpCandidate(userRequest);
        assertEquals("test@example.com", response.getEmail());
        assertEquals("ROLE_CANDIDATE", response.getRoleName());
    }

    @Test
    public void testSignUpEmployerAlreadyExistsAccount() {
        // Given
        Employer employer = buildEmployer();
        RegisterEmployerRequest userRequest = buildRegisterEmployerRequest();

        // When
        when(userRepository.findByEmail(employer.getUserDetails().getEmail())).thenReturn(Optional.of(employer.getUserDetails()));

        // Then
        RegisterResponse response = userService.signUpEmployer(userRequest);
        verify(authenticationTokenService).sendAuthenticationEmail(employer.getUserDetails(), true);
        assertEquals("test@example.com", response.getEmail());
        assertEquals("ROLE_EMPLOYER", response.getRoleName());
    }

    @Test
    public void testSignUpEmployerNewAccount() {
        // Given
        Employer employer = buildEmployer();
        RegisterEmployerRequest userRequest = buildRegisterEmployerRequest();

        // When
        when(userRepository.findByEmail(employer.getUserDetails().getEmail())).thenReturn(Optional.of(employer.getUserDetails()));

        // Then
        RegisterResponse response = userService.signUpEmployer(userRequest);
        assertEquals("test@example.com", response.getEmail());
        assertEquals("ROLE_EMPLOYER", response.getRoleName());
    }

    @Test
    public void testLoginSuccessful() {
        // Given
        User user = buildUser();

        // When
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
        when(bCryptPasswordEncoder.matches(user.getPassword(), user.getPassword())).thenReturn(true);

        // Then
        User response = userService.login(user.getEmail(), user.getPassword());
        assertEquals(user, response);
        assertEquals("test@example.com", response.getEmail());
    }

    @Test
    public void testLoginPasswordNotMatch() {
        // Given
        User user = buildUser();

        // When
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
        when(bCryptPasswordEncoder.matches("otherPassword", user.getPassword())).thenReturn(false);

        // Then
        User response = userService.login(user.getEmail(), "otherPassword");
        assertNull(response);
    }

    @Test
    public void testLoginUserNotPresent() {
        // Given
        String email = "test@gmail.com";
        String password = "testPassword";

        // When
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

        // Then
        User response = userService.login(email, password);
        assertNull(response);
    }

    @Test
    public void testLoginUserAccountNotEnabled() {
        // Given
        User user = buildUser();
        user.setAccountEnabled(0);

        // When
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));

        // Then
        User response = userService.login(user.getEmail(), user.getPassword());
        assertNull(response);
    }

    @Test
    public void testLoginUserAdminAttempt() {
        // Given
        User user = buildAdminUser();
        user.setAccountEnabled(0);

        // When
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));

        // Then
        User response = userService.login(user.getEmail(), user.getPassword());
        assertNull(response);
    }

    @Test
    public void testLoginGoogle() {
        // Given
        UserGoogleRequest request = buildUserGoogleRequest();
        User user = buildUser();

        // When
        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(user));

        // Then
        User response = userService.loginGoogle(request);
        assertEquals(user, response);
        assertEquals(user.getEmail(), response.getEmail());
        assertEquals(request.getAccountType(), response.getUserRole().getRoleName());
    }

    @Test
    public void testLoginGoogleWithoutAccount() {
        // Given
        UserGoogleRequest request = buildUserGoogleRequest();

        // When
        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.empty());

        // Then
        User response = userService.loginGoogle(request);
        assertNull(response);
    }

    @Test
    public void testRegisterGoogleWithAccount() {
        // Given
        UserGoogleRequest request = buildUserGoogleRequest();
        User user = buildUser();

        // When
        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(user));

        // Then
        User response = userService.authGoogle(request);
        assertEquals(user, response);
        assertEquals(user.getEmail(), response.getEmail());
        assertEquals(request.getAccountType(), response.getUserRole().getRoleName());
        assertEquals("", response.getPassword());
    }

    @Test
    public void testRegisterGoogleEmployer() {
        // Given
        UserGoogleRequest request = buildUserGoogleRequest();
        User user = buildUser();
        Role role = new Role("1", "ROLE_EMPLOYER", "description");

        // When
        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.empty());
        when(roleRepository.findByRoleName(request.getAccountType())).thenReturn(Optional.of(role));
        when(userRepository.save(any(User.class))).thenReturn(user);

        // Then
        User response = userService.authGoogle(request);
        assertEquals(user, response);
        assertEquals(user.getEmail(), response.getEmail());
        assertEquals(request.getAccountType(), response.getUserRole().getRoleName());
    }

    @Test
    public void testRegisterGoogleCandidate() {
        // Given
        UserGoogleRequest request = buildUserGoogleRequestCandidate();
        User user = buildCandidate().getUserDetails();
        Role role = new Role("1", "ROLE_CANDIDATE", "description");

        // When
        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.empty());
        when(roleRepository.findByRoleName(request.getAccountType())).thenReturn(Optional.of(role));
        when(userRepository.save(any(User.class))).thenReturn(user);

        // Then
        User response = userService.authGoogle(request);
        assertEquals(user, response);
        assertEquals(user.getEmail(), response.getEmail());
        assertEquals(request.getAccountType(), response.getUserRole().getRoleName());
    }

    @Test
    public void testActivateAccount() {
        // Given
        User user = buildUser();

        // When
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);

        // Then
        userService.activateAccount(user.getEmail());
    }

    @Test
    public void testUpdatePassword() {
        // Given
        User user = buildUser();

        // When
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);

        // Then
        userService.updatePassword(user.getEmail(), "newPassword");
    }

    @Test
    public void testVerifyTokenValid() {
        User user = buildUser();

        // When
        when(authenticationTokenService.verifyToken(user.getEmail(), "token")).thenReturn(true);
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);

        // Then
        Boolean response = userService.verifyToken(user.getEmail(), "token");
        assertEquals(response, true);
    }

    @Test
    public void testVerifyTokenInvalid() {
        User user = buildUser();

        // When
        when(authenticationTokenService.verifyToken(user.getEmail(), "token")).thenReturn(false);

        // Then
        Boolean response = userService.verifyToken(user.getEmail(), "token");
        assertEquals(response, false);
    }

    @Test
    public void testResetPasswordValid() {
        User user = buildUser();
        ResetPasswordRequest request = new ResetPasswordRequest(user.getEmail(), "password", "token");

        // When
        when(authenticationTokenService.verifyToken(user.getEmail(), request.getToken())).thenReturn(true);
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);

        // Then
        Boolean response = userService.resetPassword(request);
        assertEquals(response, true);
    }

    @Test
    public void testResetPasswordInvalid() {
        User user = buildUser();
        ResetPasswordRequest request = new ResetPasswordRequest(user.getEmail(), "password", "token");

        // When
        when(authenticationTokenService.verifyToken(user.getEmail(), request.getToken())).thenReturn(false);

        // Then
        Boolean response = userService.resetPassword(request);
        assertEquals(response, false);
    }

    @Test
    public void testForgotPassword() {
        User user = buildUser();

        // When
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));

        // Then
        Boolean response = userService.forgotPassword(user.getEmail());
        assertEquals(response, true);
    }

    @Test
    public void testForgotPasswordUserNotPresent() {
        // When
        when(userRepository.findByEmail("test")).thenReturn(Optional.empty());

        // Then
        Boolean response = userService.forgotPassword("test");
        assertEquals(response, true);
    }

    @Test
    public void testGetAllUsers() {
        // Given
        List<User> userList = new ArrayList<>();
        userList.add(buildUser());

        // When
        when(userRepository.findAll()).thenReturn(userList);

        // Then
        List<User> response = userService.getAllUsers();
        assertEquals(response.size(), userList.size());
        assertEquals(response, userList);
    }

    @Test
    public void testDeleteUserPresent() {
        // Given
        User user = buildUser();

        // When
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));

        // Then
        Boolean response = userService.deleteUser(user.getEmail());
        assertEquals(response, true);
    }

    @Test
    public void testDeleteUserNotPresent() {
        // Given
        User user = buildUser();

        // When
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.empty());

        // Then
        Boolean response = userService.deleteUser(user.getEmail());
        assertEquals(response, false);
    }

    @Test
    public void testDeleteUserByAdminPresent() {
        // Given
        User user = buildUser();

        // When
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));

        // Then
        Boolean response = userService.deleteUserByAdmin(user.getEmail(), "adminEmail", "reason");
        assertEquals(response, true);
    }

    @Test
    public void testDeleteUserByAdminNotPresent() {
        // Given
        User user = buildUser();

        // When
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.empty());

        // Then
        Boolean response = userService.deleteUserByAdmin(user.getEmail(), "adminEmail", "reason");
        assertEquals(response, false);
    }

    private Candidate buildCandidate(){
        Candidate candidate = new Candidate();
        User user = new User();
        user.setUserId("testUserId");
        user.setEmail("test@example.com");
        user.setPassword("testPassword");
        Role role = new Role("1", "ROLE_CANDIDATE", "description");
        user.setUserRole(role);
        String lastname = "Doe";
        String firstname = "John";
        candidate.setUserDetails(user);
        candidate.setFirstname(firstname);
        candidate.setLastname(lastname);
        candidate.setCandidateId("testUserId");
        return candidate;
    }

    private Employer buildEmployer(){
        Employer employer = new Employer();
        User user = new User();
        user.setUserId("testUserId");
        user.setEmail("test@example.com");
        user.setPassword("testPassword");
        Role role = new Role("1", "ROLE_EMPLOYER", "description");
        user.setUserRole(role);
        user.setAccountEnabled(1);
        employer.setUserDetails(user);
        employer.setCompanyName("Company");
        employer.setEmployerId("testUserId");
        return employer;
    }

    private UserGoogleRequest buildUserGoogleRequest(){
        UserGoogleRequest userGoogleRequest = new UserGoogleRequest();
        userGoogleRequest.setEmail("test@example.com");
        userGoogleRequest.setGivenName("test");
        userGoogleRequest.setFamilyName("test");
        userGoogleRequest.setName("test");
        userGoogleRequest.setAccountType("ROLE_EMPLOYER");
        return userGoogleRequest;
    }

    private UserGoogleRequest buildUserGoogleRequestCandidate(){
        UserGoogleRequest userGoogleRequest = new UserGoogleRequest();
        userGoogleRequest.setEmail("test@example.com");
        userGoogleRequest.setGivenName("test");
        userGoogleRequest.setFamilyName("test");
        userGoogleRequest.setName("test");
        userGoogleRequest.setAccountType("ROLE_CANDIDATE");
        return userGoogleRequest;
    }

    private User buildUser(){
        User user = new User();
        user.setUserId("testUserId");
        user.setEmail("test@example.com");
        user.setPassword("testPassword");
        Role role = new Role("1", "ROLE_EMPLOYER", "description");
        user.setUserRole(role);
        user.setAccountEnabled(1);
        return user;
    }

    private User buildAdminUser(){
        User user = new User();
        user.setUserId("testUserId");
        user.setEmail("test@example.com");
        user.setPassword("testPassword");
        Role role = new Role("1", "ROLE_ADMIN", "description");
        user.setUserRole(role);
        user.setAccountEnabled(1);
        return user;
    }

    private RegisterCandidateRequest buildRegisterCandidateRequest(){
        RegisterCandidateRequest userRequest = new RegisterCandidateRequest();
        userRequest.setEmail("test@example.com");
        userRequest.setPassword("password");
        userRequest.setAccountType("ROLE_CANDIDATE");
        String lastname = "Doe";
        String firstname = "John";
        userRequest.setFirstname(firstname);
        userRequest.setLastname(lastname);
        return userRequest;
    }

    private RegisterEmployerRequest buildRegisterEmployerRequest(){
        RegisterEmployerRequest userRequest = new RegisterEmployerRequest();
        userRequest.setEmail("test@example.com");
        userRequest.setPassword("password");
        userRequest.setAccountType("ROLE_EMPLOYER");
        userRequest.setCompanyName("Company");
        return userRequest;
    }
}
