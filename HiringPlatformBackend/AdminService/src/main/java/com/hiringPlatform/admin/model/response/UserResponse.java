package com.hiringPlatform.admin.model.response;

import lombok.*;

import java.util.Date;

@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {

    private String userId;
    private String email;
    private Date registrationDate;
    private Integer accountEnabled;
    private String userRole;
    private String userName;
    private String usernameCreator;
    private String idCreator;
}
