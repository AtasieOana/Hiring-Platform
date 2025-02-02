package com.hiringPlatform.authentication.model.request;

import lombok.*;

@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserGoogleRequest {
    private String email;
    private String givenName;
    private String familyName;
    private String name;
    private String accountType;
}