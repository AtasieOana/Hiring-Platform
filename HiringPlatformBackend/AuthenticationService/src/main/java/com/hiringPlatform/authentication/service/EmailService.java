package com.hiringPlatform.authentication.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.util.Properties;

@Service
public class EmailService {

    @Value("${spring.mail.host}")
    String host;
    @Value("${spring.mail.port}")
    String port;
    @Value("${spring.mail.username}")
    String username;
    @Value("${spring.mail.password}")
    String password;

    private Session mailSession;

    @PostConstruct()
    private void makeSession() {
        Properties properties = new Properties();
        properties.put("mail.smtp.host", host);
        properties.put("mail.smtp.port", port);
        properties.put("mail.smtp.auth", "true");
        properties.put("mail.smtp.starttls.enable", "true");
        properties.put("mail.smtp.user", username);
        properties.put("mail.smtp.password", password);
        mailSession = Session.getDefaultInstance(properties);
    }

    @Async
    public void sendEmailToUserAsync(String emailReceiver, String emailContent, String emailSubject) {
        try {
            MimeMessage messageFormed = new MimeMessage(mailSession);
            messageFormed.setFrom(new InternetAddress("joblistic@gmail.com"));
            messageFormed.addRecipient(Message.RecipientType.TO, new InternetAddress(emailReceiver));
            messageFormed.setSubject(emailSubject);
            messageFormed.setContent(emailContent, "text/html; charset=utf-8");

            System.out.println("Mail prepared!");
            Transport t = mailSession.getTransport("smtp");
            t.connect(username, password);
            t.sendMessage(messageFormed, messageFormed.getAllRecipients());
            t.close();
            System.out.println("Mail send successfully!");
        } catch (MessagingException ex) {
            ex.printStackTrace();
        }
    }
}
