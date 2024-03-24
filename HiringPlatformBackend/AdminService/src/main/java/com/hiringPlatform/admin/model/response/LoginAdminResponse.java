package com.hiringPlatform.admin.model.response;

import com.hiringPlatform.admin.model.Admin;
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