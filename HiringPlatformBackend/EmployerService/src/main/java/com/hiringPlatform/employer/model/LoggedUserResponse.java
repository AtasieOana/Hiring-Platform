package com.hiringPlatform.employer.model;

import lombok.*;

@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoggedUserResponse {
    private String token;
    private String email;
    private String username;
    private String roleName;
}
