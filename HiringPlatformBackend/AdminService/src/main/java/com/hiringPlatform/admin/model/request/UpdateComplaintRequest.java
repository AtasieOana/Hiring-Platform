package com.hiringPlatform.admin.model.request;

import lombok.*;

@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateComplaintRequest {

    private String complaintId;
    private String adminId;
}
