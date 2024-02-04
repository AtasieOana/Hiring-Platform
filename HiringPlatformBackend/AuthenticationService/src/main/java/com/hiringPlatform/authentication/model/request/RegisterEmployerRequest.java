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
    private String street;
    private String zipCode;
    private String city;
    private String region;
    private String country;
    private String accountType;
}