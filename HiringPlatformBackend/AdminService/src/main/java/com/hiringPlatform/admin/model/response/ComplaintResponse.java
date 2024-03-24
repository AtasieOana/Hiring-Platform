package com.hiringPlatform.admin.model.response;

import lombok.*;

import java.util.Date;

@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ComplaintResponse {

    private String complaintId;
    private String motivation;
    private String complainantUserEmail;
    private String complainedUserEmail;
    private String status;
    private String processingAdminEmail;
    private Date complaintDate;

}
