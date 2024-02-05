package com.hiringPlatform.authentication.model.request;

import lombok.*;

@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterEmployerRequest {
    private String email;
    private String password;
    private String companyName;
    private String accountType;
}