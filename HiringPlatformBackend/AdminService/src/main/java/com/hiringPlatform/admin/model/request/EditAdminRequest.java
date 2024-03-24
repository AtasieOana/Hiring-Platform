package com.hiringPlatform.admin.model.request;

import lombok.*;

@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
public class EditAdminRequest {

    private String userId;
    private String newUsername;
    private String newPassword;
}
