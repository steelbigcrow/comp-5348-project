package com.comp5348.practice9.group5.store.repository;

import com.comp5348.practice9.group5.store.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    // find a payment by order id
    Optional<Payment> findByOrderId(long orderId);

    // find a payment by transaction record id
    Optional<Payment> findByTransactionRecordId(long transactionRecordId);
}