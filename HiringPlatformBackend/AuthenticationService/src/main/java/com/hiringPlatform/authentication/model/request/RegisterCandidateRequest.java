package com.hiringPlatform.authentication.model.request;

import lombok.*;

@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterCandidateRequest {
    private String email;
    private String password;
    private String lastname;
    private String firstname;
    private String accountType;
}