package com.hiringPlatform.common.controller;

import com.hiringPlatform.common.model.request.ReviewResponse;
import com.hiringPlatform.common.model.request.SendMailRequest;
import com.hiringPlatform.common.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = {"http://localhost:3000"})
public class EmailController {

    private final EmailService emailService;

    @Autowired
    public EmailController(EmailService emailService){
        this.emailService = emailService;
    }

    @PostMapping("/sendMail")
    public ResponseEntity<Boolean> sendMail(@RequestBody SendMailRequest request) {
        emailService.sendEmailToUserAsync(request.getEmailReceiver(), request.getEmailContent(), request.getEmailSubject());
        return ResponseEntity.ok(true);
    }
}
