package com.hiringPlatform.employer.model.request;

import lombok.*;

@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SendMailRequest {

    private String emailReceiver;
    private String emailContent;
    private String emailSubject;
}
