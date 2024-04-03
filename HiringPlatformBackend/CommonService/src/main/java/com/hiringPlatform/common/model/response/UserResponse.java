package com.hiringPlatform.common.model.response;

import lombok.*;

import java.util.Date;

@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {

    private String email;
    private String name;
    private String roleName;
}
