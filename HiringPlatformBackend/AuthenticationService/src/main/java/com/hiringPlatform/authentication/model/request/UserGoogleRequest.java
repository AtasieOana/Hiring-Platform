package com.hiringPlatform.authentication.model.request;

import lombok.*;

@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserGoogleRequest {
    private String email;
    private String username;
    private String accountType;
}