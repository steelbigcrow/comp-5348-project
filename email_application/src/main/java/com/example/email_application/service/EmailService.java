package com.example.email_application.service;

import com.example.email_application.dto.EmailDTO;
import com.example.email_application.model.DeliveryStatus;
import com.example.email_application.model.Email;
import com.example.email_application.repository.EmailRepository;
import com.example.email_application.util.ServiceResult;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Optional;

@Service
public class EmailService {
    private final EmailRepository emailRepository;

    @Autowired
    public EmailService(EmailRepository emailRepository) {
        this.emailRepository = emailRepository;
    }

    /*
    Get an email info
     */
    @Transactional
    public ServiceResult<EmailDTO> getEmailInfo(Long emailId) {
        // 1. find an email by emailId
        Optional<Email> email = emailRepository.findById(emailId);

        // 2. check if email exists
        if (email.isEmpty()) {
            return ServiceResult.failure("Email not found");
        }

        // 3. return email info
        return ServiceResult.success(new EmailDTO(email.get()));
    }

    /*
    create an email
     */
    @Transactional
    public ServiceResult<EmailDTO> createEmail(Integer deliveryId, String emailAddress, DeliveryStatus deliveryStatus, String address, String accident) {
        // 1. generate description
        String description = "email address: " + emailAddress +
                ", delivery ID: " + deliveryId +
                ", delivery status: " + deliveryStatus +
                ", address: " + address +
                ", accident: " + accident;

        // 2. create an email
        Email email = new Email(deliveryId, emailAddress,description,new Date(), deliveryStatus, address);
        emailRepository.save(email);

        // 3. return email
        return ServiceResult.success(new EmailDTO(email));
    }

    /*
    delete an email
     */
    @Transactional
    public ServiceResult<EmailDTO> deleteEmail(Long deliveryId, DeliveryStatus deliveryStatus) {
        // 1. find an email by deliveryId and deliveryStatus
        Optional<Email> email = emailRepository.findByDeliveryIdAndStatus(deliveryId, deliveryStatus);

        // 2. check if email exists
        if (email.isEmpty()) {
            return ServiceResult.failure("Email not found");
        }

        // 3. delete the email
        emailRepository.delete(email.get());

        // 4. return email info
        return ServiceResult.success(new EmailDTO(email.get()));
    }
}
