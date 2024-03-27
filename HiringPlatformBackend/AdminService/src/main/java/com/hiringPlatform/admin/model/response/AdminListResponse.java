package com.hiringPlatform.admin.model.response;

import lombok.*;

@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdminListResponse {
    private String email;
    private String username;
}