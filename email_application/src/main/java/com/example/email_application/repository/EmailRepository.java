package com.example.email_application.repository;

import com.example.email_application.EmailApplication;
import com.example.email_application.model.DeliveryStatus;
import com.example.email_application.model.Email;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmailRepository extends JpaRepository<Email, Long> {
    // fina an email by delivery id
    Optional<Email> findByDeliveryId(Long deliveryId);

    // fina an email by delivery id and delivery status
    Optional<Email> findByDeliveryIdAndStatus(Long deliveryId, DeliveryStatus deliveryStatus);
}
