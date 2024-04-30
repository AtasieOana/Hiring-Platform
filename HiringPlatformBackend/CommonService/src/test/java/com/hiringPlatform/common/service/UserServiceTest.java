package com.hiringPlatform.common.service;

import com.hiringPlatform.common.model.User;
import com.hiringPlatform.common.model.Role;
import com.hiringPlatform.common.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @InjectMocks
    UserService userService;

    @Mock
    UserRepository userRepository;

    @Test
    public void testGetUserPresent() {
        // Given
        User user = buildUser();

        // When
        when(userRepository.findById(anyString())).thenReturn(Optional.of(user));

        // Then
        User result = userService.getUser("testId");
        assertEquals(result, user);
    }

    @Test
    public void testGetUserNotPresent() {
        // When
        when(userRepository.findById(anyString())).thenReturn(Optional.empty());

        // Then
        User result = userService.getUser("testId");
        assertNull(result);
    }

    private User buildUser(){
        User user = new User();
        user.setUserId("1");
        user.setEmail("test@example.com");
        user.setPassword("testPassword");
        Role role = new Role("1", "ROLE_CANDIDATE", "description");
        user.setUserRole(role);
        return user;
    }

}
