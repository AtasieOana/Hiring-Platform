package com.hiringPlatform.admin.model.request;

import lombok.*;

@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddAdminRequest {

    private String creatorId;
    private String username;
    private String password;
    private String email;
}
