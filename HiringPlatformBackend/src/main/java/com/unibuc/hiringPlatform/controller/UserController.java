package com.unibuc.hiringPlatform.controller;

import com.unibuc.hiringPlatform.model.User;
import com.unibuc.hiringPlatform.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping(value = "/user")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }


    @PostMapping("/signUp")
    public User signUp(@Valid @RequestBody User user) {
        return userService.signUp(user);
    }

    @GetMapping("/login/{email}/{password}")
    public User login(@PathVariable String email, @PathVariable String password) {
        return userService.login(email, password);
    }
}