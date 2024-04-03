package com.hiringPlatform.common.controller;

import com.hiringPlatform.common.model.request.SendMailRequest;
import com.hiringPlatform.common.service.MailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = {"http://localhost:3000"})
public class MailController {

    private final MailService emailService;

    @Autowired
    public MailController(MailService emailService){
        this.emailService = emailService;
    }

    @PostMapping("/sendMail")
    public ResponseEntity<Boolean> sendMail(@RequestBody SendMailRequest request) {
        emailService.sendEmailToUserAsync(request.getEmailReceiver(), request.getEmailContent(), request.getEmailSubject());
        return ResponseEntity.ok(true);
    }
}
