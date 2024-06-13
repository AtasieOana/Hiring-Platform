package com.hiringPlatform.common.controller;

import com.hiringPlatform.common.model.response.GetLoggedUserResponse;
import com.hiringPlatform.common.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * Method used for getting the logged user
     * @return null if the user is not logged, the user otherwise
     */
    @GetMapping("/getLoggedUser")
    public ResponseEntity<GetLoggedUserResponse> getLoggedUser() {
        GetLoggedUserResponse user =  userService.getLoggedUser();
        return ResponseEntity.ok(user);
    }

}
