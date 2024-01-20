package com.hiringPlatform.authentication.model;

import lombok.*;

@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponse {
    private String token;
    private long expiresIn;
    private String username;
    private String roleName;
}