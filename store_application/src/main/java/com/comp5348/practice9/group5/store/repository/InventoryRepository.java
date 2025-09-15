package com.comp5348.practice9.group5.store.repository;

import com.comp5348.practice9.group5.store.model.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    // Find all inventories by warehouse id
    List<Inventory> findByWarehouseId(Long warehouseId);

    // Find all inventories by product id
    List<Inventory> findByProductId(Long productId);

    // delete all inventories by warehouse id
    void deleteByWarehouseId(Long warehouseId);
}