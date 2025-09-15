package com.example.delivery_application.repository;

import com.example.delivery_application.model.Delivery;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DeliveryRepository extends JpaRepository<Delivery, Long> {
    // fina a delivery by order id
    Optional<Delivery> findByOrderId(Long orderId);
}
