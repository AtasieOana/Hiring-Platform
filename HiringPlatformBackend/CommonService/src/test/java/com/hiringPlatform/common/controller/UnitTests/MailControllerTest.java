package com.hiringPlatform.common.controller.UnitTests;

import com.hiringPlatform.common.controller.MailController;
import com.hiringPlatform.common.model.request.SendMailRequest;
import com.hiringPlatform.common.service.MailService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(MockitoExtension.class)
public class MailControllerTest {

    @InjectMocks
    MailController mailController;

    @Mock
    MailService mailService;

    @Test
    public void testSendMail() {
        // Given
        SendMailRequest request = new SendMailRequest();
        request.setEmailContent("test");
        request.setEmailReceiver("test");
        request.setEmailSubject("test");

        // Then
        ResponseEntity<Boolean> result = mailController.sendMail(request);
        assertEquals(result.getBody(), true);
        assertEquals(result.getStatusCode(), HttpStatus.OK);
    }

}
