package com.comp5348.practice9.group5.store.repository;

import com.comp5348.practice9.group5.store.model.InventoryTransaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InventoryTransactionRepository  extends JpaRepository<InventoryTransaction, Long> {
    // fina all inventory transactions by inventory id
    List<InventoryTransaction> findByInventoryId(Long inventoryId);

    // find all inventory transactions by order id
    List<InventoryTransaction> findByOrderId(Long orderId);
}
