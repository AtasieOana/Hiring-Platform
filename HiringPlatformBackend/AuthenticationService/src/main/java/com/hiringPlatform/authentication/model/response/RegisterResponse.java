package com.hiringPlatform.authentication.model.response;

import lombok.*;

@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterResponse {
    private String email;
    private String username;
    private String roleName;
}