package com.example.email_application.controller;

import com.example.email_application.dto.EmailDTO;
import com.example.email_application.model.DeliveryStatus;
import com.example.email_application.service.EmailService;
import com.example.email_application.util.ServiceResult;
import com.example.email_application.util.ValidationUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/email/emails")
public class EmailController {
    private final EmailService emailService;

    @Autowired
    public EmailController(EmailService emailService) {
        this.emailService = emailService;
    }

    /*
    Get an email info
     */
    @GetMapping("/{emailId}")
    public ResponseEntity<?> getEmailInfo(@PathVariable Long emailId) {
        // 1. Get an email info
        ServiceResult<EmailDTO> result = emailService.getEmailInfo(emailId);

        // 2. handle result
        if (!result.isSuccess()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", result.getErrorMessage()));
        }

        return ResponseEntity.ok(result.getData());
    }

    /*
    create an email
     */
    @PostMapping
    public ResponseEntity<?> createEmail(@RequestBody CreateEmailRequest request) {
        // 1. check validation

        // 1.1 check if the deliveryId is valid
        if (request.deliveryId == null || request.deliveryId <= 0) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Invalid deliveryId"));
        }

        // 1.2 check if email is valid
        if (!ValidationUtils.isValidEmail(request.emailAddress)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Invalid email format"));
        }

        // 1.3 check if deliveryStatus is valid
        DeliveryStatus deliveryStatus;
        try {
            deliveryStatus = DeliveryStatus.values()[request.deliveryStatus];
        } catch (ArrayIndexOutOfBoundsException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Invalid delivery status"));
        }

        // 1.4 check if address is valid
        if (request.address == null || request.address.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Invalid address"));
        }

        // 2. create an email: if throw exception, system will return 500 error
        ServiceResult<EmailDTO> result = emailService.createEmail(request.deliveryId, request.emailAddress, deliveryStatus, request.address, request.accident);

        // 3. print the description of email
        System.out.println(result.getData().getDescription());

        return ResponseEntity.ok(Map.of("status", deliveryStatus.ordinal()));
    }

    /*
    delete an email
     */
    @DeleteMapping
    public ResponseEntity<?> deleteEmail(@RequestBody DeleteEmailRequest request) {
        // 1. check validation

        // 1.1 check if the deliveryId is valid
        if (request.deliveryId == null || request.deliveryId <= 0) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Invalid deliveryId"));
        }

        // 1.2 check if deliveryStatus is valid
        DeliveryStatus deliveryStatus;
        try {
            deliveryStatus = DeliveryStatus.values()[request.deliveryStatus];
        } catch (ArrayIndexOutOfBoundsException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Invalid delivery status"));
        }

        // 2. delete the email
        ServiceResult<EmailDTO> result = emailService.deleteEmail(request.deliveryId, deliveryStatus);

        // 3. handle result
        if (!result.isSuccess()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", result.getErrorMessage()));
        }

        return ResponseEntity.ok(Map.of("status", deliveryStatus.ordinal()));
    }

    /*
    Request body for createEmail
     */
    public static class CreateEmailRequest {
        public Integer deliveryId;
        public String emailAddress;
        public Integer deliveryStatus;
        public String address;
        public String accident;
    }

    /*
    Request body for deleting an email
     */
    public static class DeleteEmailRequest{
    private Long deliveryId;
    private Integer deliveryStatus;
    }
}
