package com.comp5348.practice9.group5.store.repository;

import com.comp5348.practice9.group5.store.model.Refund;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RefundRepository extends JpaRepository<Refund, Long> {
    // find a refund by order id
    Optional<Refund> findByOrder_Id(long orderId);

    // find a refund by transaction record id
    Optional<Refund> findByTransactionRecordId(long transactionRecordId);
}
