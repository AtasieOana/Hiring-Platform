package com.hiringPlatform.authentication.model.request;

import lombok.*;

@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
public class DeleteUserByAdminRequest {

    private String emailUser;
    private String emailAdmin;
    private String reason;
}
