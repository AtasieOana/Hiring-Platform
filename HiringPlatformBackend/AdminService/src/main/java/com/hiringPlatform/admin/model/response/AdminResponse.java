package com.hiringPlatform.admin.model.response;

import lombok.*;

@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdminResponse {

    private String userId;
    private String email;
    private String username;
}
