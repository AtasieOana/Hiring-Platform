package com.hiringPlatform.authentication.model.response;

import com.hiringPlatform.authentication.model.Admin;
import lombok.*;

@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginAdminResponse {
    private String token;
    private long expiresIn;
    private Admin admin;
}