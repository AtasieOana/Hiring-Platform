package com.hiringPlatform.admin.model.request;

import lombok.*;

@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddComplaintRequest {

    private String motivation;
    private String complainantUserEmail;
    private String complainedUserEmail;
}
