package com.hiringPlatform.authentication.model.request;

import lombok.*;

@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResetPasswordRequest {
    private String email;
    private String newPassword;
    private String token;
}
