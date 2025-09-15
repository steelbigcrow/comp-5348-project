package com.example.delivery_application.controller;

import com.example.delivery_application.dto.DeliveryDTO;
import com.example.delivery_application.model.DeliveryStatus;
import com.example.delivery_application.service.DeliveryService;
import com.example.delivery_application.util.ServiceResult;
import com.example.delivery_application.util.ValidationUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/delivery/deliveries")
public class DeliveryController {
    private final DeliveryService deliveryService;

    @Autowired
    public DeliveryController(DeliveryService deliveryService) {
        this.deliveryService = deliveryService;
    }

    /*
    Get a delivery info
     */
    @GetMapping("/{deliveryId}")
    public ResponseEntity<?> getDeliveryInfo(@PathVariable Long deliveryId) {
        // 1. Get a delivery info
        ServiceResult<DeliveryDTO> result = deliveryService.getDeliveryInfo(deliveryId);

        // 2. handle result
        if (!result.isSuccess()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", result.getErrorMessage()));
        }

        return ResponseEntity.ok(result.getData());
    }

    /*
    create a delivery
     */
    @PostMapping
    public ResponseEntity<?> createDelivery(@RequestBody DeliveryRequest deliveryRequest) {
        // 1. check validation

        // 1.1 check if the quantity is valid
        if (deliveryRequest.quantity <= 0) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Invalid quantity"));
        }

        // 1.2 check if the address is valid
        if (deliveryRequest.address == null || deliveryRequest.address.isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Invalid address"));
        }

        // 1.3 check if the email is valid
        if (!ValidationUtils.isValidEmail(deliveryRequest.email)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Invalid email"));
        }

        // 2. create a delivery
        ServiceResult<DeliveryDTO> result = deliveryService.createDelivery(
                deliveryRequest.orderId,
                deliveryRequest.quantity,
                deliveryRequest.address,
                deliveryRequest.email);

        // 3. handle result
        if (!result.isSuccess()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", result.getErrorMessage()));
        }

        return ResponseEntity.ok(Map.of("status", result.getData().getStatus().ordinal()));
    }

    /*
    Cancel a delivery
     */
    @PutMapping
    public ResponseEntity<?> cancelDelivery(@RequestBody CancelDeliveryRequest request){
        // 1. check validation
        if (request.orderId <= 0) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Invalid order id"));
        }

        // 2. update a delivery
        ServiceResult<DeliveryDTO> result = deliveryService.cancelDelivery(request.orderId);

        // 3. handle result
        if (!result.isSuccess()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", result.getErrorMessage()));
        }

        return ResponseEntity.ok(Map.of("status", result.getData().getStatus().ordinal()));
    }

    /*
    Delivery request body
     */
    public static class DeliveryRequest {
        public long orderId;
        public int quantity;
        public String address;
        public String email;
    }

    /*
    Update delivery request body
     */
    public static class UpdateDeliveryRequest {
        public DeliveryStatus status;
    }

    /*
    Cancel delivery request body
     */
    public static class CancelDeliveryRequest {
        public long orderId;
    }
}
