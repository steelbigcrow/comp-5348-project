package com.comp5348.practice9.group5.store.controller;

import com.comp5348.practice9.group5.store.dto.WarehouseDTO;
import com.comp5348.practice9.group5.store.service.WarehouseService;
import com.comp5348.practice9.group5.store.util.ServiceResult;
import com.comp5348.practice9.group5.store.util.ValidationUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/store/users/{userId}/warehouses")
public class WarehouseController {
    private final WarehouseService warehouseService;

    @Autowired
    public WarehouseController(WarehouseService warehouseService) {
        this.warehouseService = warehouseService;
    }

    /*
    Get all warehouses info
     */
    @GetMapping
    public ResponseEntity<?> getAllWarehousesInfo(@PathVariable Long userId) {
        // 1.check validation

        // 1.1 check if user valid
        if(!ValidationUtils.isValidUserId(userId)){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Invalid user id"));
        }

        // 2. Get all warehouses info
        ServiceResult<List<WarehouseDTO>> result = warehouseService.getAllWarehousesInfo(userId);

        // 3. handle result
        if (!result.isSuccess()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", result.getErrorMessage()));
        }

        return ResponseEntity.ok(result.getData());
    }

    /*
    Get a specific warehouse info
     */
    @GetMapping("/{warehouseId}")
    public ResponseEntity<?> getWarehouseInfo(@PathVariable Long userId, @PathVariable Long warehouseId) {
        // 1. check validation

        // 1.1 check if user valid
        if(!ValidationUtils.isValidUserId(userId)){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Invalid user id"));
        }

        // 1.2 check if warehouse valid
        if(!ValidationUtils.isValidWarehouseId(warehouseId)){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Invalid warehouse id"));
        }

        // 2. Get a specific warehouse info
        ServiceResult<WarehouseDTO> result = warehouseService.getWarehouseInfo(userId, warehouseId);

        // 3. handle result
        if (!result.isSuccess()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", result.getErrorMessage()));
        }

        return ResponseEntity.ok(result.getData());
    }

    /*
    Create a new warehouse
     */
    @PostMapping
    public ResponseEntity<?> createWarehouse(@PathVariable Long userId, @RequestBody WarehouseRequest request) {
        // 1. check validation

        // 1.1 check if user valid
        if(!ValidationUtils.isValidUserId(userId)){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Invalid user id"));
        }

        // 1.2 check if name and address valid
        if(request.name == null || request.name.isEmpty() || request.address == null || request.address.isEmpty()){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Invalid name or address"));
        }

        // 2. Create a new warehouse
        ServiceResult<WarehouseDTO> result = warehouseService.createWarehouse(userId, request.name, request.address);

        // 3. handle result
        if (!result.isSuccess()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", result.getErrorMessage()));
        }

        return ResponseEntity.ok(result.getData());
    }

    /*
    Update a warehouse
     */
    @PutMapping("/{warehouseId}")
    public ResponseEntity<?> updateWarehouse(@PathVariable Long userId, @PathVariable Long warehouseId, @RequestBody WarehouseRequest request) {
        // 1. check validation

        // 1.1 check if user valid
        if(!ValidationUtils.isValidUserId(userId)){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Invalid user id"));
        }

        // 1.2 check if warehouse valid
        if(!ValidationUtils.isValidWarehouseId(warehouseId)){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Invalid warehouse id"));
        }

        // 1.3 check if name and address valid
        if(request.name == null || request.name.isEmpty() || request.address == null || request.address.isEmpty()){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Invalid name or address"));
        }

        // 2. Update a warehouse
        ServiceResult<WarehouseDTO> result = warehouseService.updateWarehouse(userId, warehouseId, request.name, request.address);

        // 3. handle result
        if (!result.isSuccess()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", result.getErrorMessage()));
        }

        return ResponseEntity.ok(result.getData());
    }

    /*
    Delete a warehouse
     */
    @DeleteMapping("/{warehouseId}")
    public ResponseEntity<?> deleteWarehouse(@PathVariable Long userId, @PathVariable Long warehouseId) {
        // 1. check validation

        // 1.1 check if user valid
        if(!ValidationUtils.isValidUserId(userId)){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Invalid user id"));
        }

        // 1.2 check if warehouse valid
        if(!ValidationUtils.isValidWarehouseId(warehouseId)){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Invalid warehouse id"));
        }

        // 2. Delete a warehouse
        ServiceResult<String> result = warehouseService.deleteWarehouse(userId, warehouseId);

        // 3. handle result
        if (!result.isSuccess()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", result.getErrorMessage()));
        }

        return ResponseEntity.ok(Map.of("message", result.getData()));
    }



    public static class WarehouseRequest {
        public String name;
        public String address;
    }
}
