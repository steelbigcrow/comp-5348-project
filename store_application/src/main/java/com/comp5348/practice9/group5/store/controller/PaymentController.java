package com.comp5348.practice9.group5.store.controller;

import com.comp5348.practice9.group5.store.dto.PaymentDTO;
import com.comp5348.practice9.group5.store.service.PaymentService;
import com.comp5348.practice9.group5.store.util.ServiceResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/store/users/{userId}/orders/{orderId}/payments")
public class PaymentController {
    private final PaymentService paymentService;

    @Autowired
    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    /*
    get a payment info
     */
    @GetMapping("/{paymentId}")
    public ResponseEntity<?> getPaymentInfo(@PathVariable Long paymentId) {
        // 1. Get a payment info
        ServiceResult<PaymentDTO> result = paymentService.getPaymentInfo(paymentId);

        // 2. handle result
        if (!result.isSuccess()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", result.getErrorMessage()));
        }

        return ResponseEntity.ok(result.getData());
    }

    /*
    create a payment
     */
    @PostMapping
    public ResponseEntity<?> createPayment(@PathVariable Long userId, @PathVariable Long orderId, @RequestBody CreatePaymentRequest request) {
        // 1. check validation
        if (request.fromAccountId == null || request.address == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "fromAccountId and address are required"));
        }

        // 2. Create a payment
        ServiceResult<PaymentDTO> result = paymentService.createPayment(userId, orderId, request.fromAccountId, request.address);

        // 3. handle result
        if (!result.isSuccess()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", result.getErrorMessage()));
        }

        return ResponseEntity.ok(result.getData());
    }

    /*
    cancel a payment
     */
    @PutMapping("/{paymentId}")
    public ResponseEntity<?> cancelPayment(@PathVariable Long paymentId) {
        // 1. Cancel a payment
        ServiceResult<PaymentDTO> result = paymentService.cancelPayment(paymentId);

        // 2. handle result
        if (!result.isSuccess()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", result.getErrorMessage()));
        }

        return ResponseEntity.ok(result.getData());
    }

    public static class CreatePaymentRequest {
        public Long fromAccountId;
        public String address;
    }
}
