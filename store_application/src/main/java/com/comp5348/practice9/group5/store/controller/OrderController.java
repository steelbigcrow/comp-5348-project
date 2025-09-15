package com.comp5348.practice9.group5.store.controller;

import com.comp5348.practice9.group5.store.dto.OrderDTO;
import com.comp5348.practice9.group5.store.model.DeliveryStatus;
import com.comp5348.practice9.group5.store.model.OrderStatus;
import com.comp5348.practice9.group5.store.service.OrderService;
import com.comp5348.practice9.group5.store.util.ServiceResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/store/users/{userId}/orders")
public class OrderController {
    private final OrderService orderService;

    @Autowired
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    /*
    Get all orders info of a user
     */
    @GetMapping
    public ResponseEntity<?> getAllOrdersInfo(@PathVariable Long userId) {
        // 1. Get all orders info of a user
        ServiceResult<List<OrderDTO>> result = orderService.getAllOrdersInfo(userId);

        // 2. handle result
        if (!result.isSuccess()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", result.getErrorMessage()));
        }

        return ResponseEntity.ok(result.getData());
    }

    /*
    Get a specific order info
     */
    @GetMapping("/{orderId}")
    public ResponseEntity<?> getOrderInfo(@PathVariable Long userId, @PathVariable Long orderId) {
        // 1. check validation
        if (orderId == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Invalid request"));
        }

        // 2. Get a specific order info
        ServiceResult<OrderDTO> result = orderService.getOrderInfo(userId, orderId);

        // 2. handle result
        if (!result.isSuccess()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", result.getErrorMessage()));
        }

        return ResponseEntity.ok(result.getData());
    }

    /*
    Create a new order
     */
    @PostMapping
    public ResponseEntity<?> createOrder(@PathVariable Long userId, @RequestBody CreateOrderRequest request) {
        // 1. check validation
        if (request.productId == null || request.quantity <= 0) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Invalid request"));
        }

        // 2. call service to create a new order
        ServiceResult<OrderDTO> result = orderService.createOrder(userId, request.productId, request.quantity);

        // 3. handle result
        if (!result.isSuccess()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", result.getErrorMessage()));
        }

        return ResponseEntity.ok(result.getData());
    }

    /*
    update an order
     */
    @PutMapping("/{orderId}")
    public ResponseEntity<?> updateOrder(@PathVariable Long orderId, @RequestBody UpdateOrderRequest request) {
        // 1. check validation
        if (request.deliveryStatus == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Invalid request"));
        }

        // 2. call service to update an order
        ServiceResult<OrderDTO> result = orderService.updateOrder(orderId, request.deliveryStatus);

        // 3. handle result
        if (!result.isSuccess()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", result.getErrorMessage()));
        }

        return ResponseEntity.ok(Map.of("status", result.getData().getDeliveryStatus().ordinal()));
    }

    public static class CreateOrderRequest{
        public Long productId;
        public int quantity;
    }

    public static class UpdateOrderRequest{
        public Integer deliveryStatus;
    }
}
