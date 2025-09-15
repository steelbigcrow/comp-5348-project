package com.comp5348.practice9.group5.store.controller;

import com.comp5348.practice9.group5.store.dto.InventoryDTO;
import com.comp5348.practice9.group5.store.service.InventoryService;
import com.comp5348.practice9.group5.store.util.ServiceResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/store/users/{userId}/warehouses/{warehouseId}/inventories")
public class InventoryController {
    private final InventoryService inventoryService;

    @Autowired
    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    /*
    Get all inventory info
     */
    @GetMapping
    public ResponseEntity<?> getAllInventoryInfo(@PathVariable Long userId, @PathVariable Long warehouseId) {
        // 1. Get all inventory info
        ServiceResult<List<InventoryDTO>> result = inventoryService.getAllInventoryInfo(userId, warehouseId);

        // 2. handle result
        if (!result.isSuccess()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", result.getErrorMessage()));
        }

        return ResponseEntity.ok(result.getData());
    }

    /*
    Get a specific inventory info
     */
    @GetMapping("/{inventoryId}")
    public ResponseEntity<?> getInventoryInfo(@PathVariable Long userId, @PathVariable Long warehouseId, @PathVariable Long inventoryId) {
        // 1. Get a specific inventory info
        ServiceResult<InventoryDTO> result = inventoryService.getInventoryInfo(userId, warehouseId, inventoryId);

        // 2. handle result
        if (!result.isSuccess()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", result.getErrorMessage()));
        }

        return ResponseEntity.ok(result.getData());
    }

    /*
    Create a new inventory
     */
    @PostMapping
    public ResponseEntity<?> createInventory(@PathVariable Long userId, @PathVariable Long warehouseId, @RequestBody CreateInventoryRequest request) {
        // 1. Create a new inventory
        ServiceResult<InventoryDTO> result = inventoryService.createInventory(userId, warehouseId, request.productId, request.quantity);

        // 2. handle result
        if (!result.isSuccess()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", result.getErrorMessage()));
        }

        return ResponseEntity.ok(result.getData());
    }

    /*
    Update a specific inventory
     */
    @PutMapping("/{inventoryId}")
    public ResponseEntity<?> updateInventory(@PathVariable Long userId, @PathVariable Long warehouseId, @PathVariable Long inventoryId, @RequestBody UpdateInventoryRequest request) {
        // 1. Update a specific inventory
        ServiceResult<InventoryDTO> result = inventoryService.updateInventory(userId, warehouseId, inventoryId, request.quantity);

        // 2. handle result
        if (!result.isSuccess()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", result.getErrorMessage()));
        }

        return ResponseEntity.ok(result.getData());
    }


    public static class CreateInventoryRequest {
        public long productId;
        public int quantity;
    }

    public static class UpdateInventoryRequest {
        public int quantity;
    }
}
