package com.comp5348.practice9.group5.store.service;

import com.comp5348.practice9.group5.store.dto.InventoryTransactionDTO;
import com.comp5348.practice9.group5.store.dto.OrderDTO;
import com.comp5348.practice9.group5.store.dto.PaymentDTO;
import com.comp5348.practice9.group5.store.model.*;
import com.comp5348.practice9.group5.store.repository.OrderRepository;
import com.comp5348.practice9.group5.store.repository.PaymentRepository;
import com.comp5348.practice9.group5.store.repository.UserRepository;
import com.comp5348.practice9.group5.store.util.BankConfig;
import com.comp5348.practice9.group5.store.util.ServiceResult;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class PaymentService {
    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final InventoryTransactionService inventoryTransactionService;
    private final RestTemplate restTemplate;

    @Autowired
    public PaymentService(UserRepository userRepository,
                          OrderRepository orderRepository,
                          PaymentRepository paymentRepository,
                          InventoryTransactionService inventoryTransactionService,
                          RestTemplate restTemplate) {
        this.paymentRepository = paymentRepository;
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
        this.inventoryTransactionService = inventoryTransactionService;
        this.restTemplate = restTemplate;
    }

    /*
    Get a payment info
     */
    @Transactional
    public ServiceResult<PaymentDTO> getPaymentInfo(Long paymentId) {
        // 1. check if the payment exists
        if (!paymentRepository.existsById(paymentId)) {
            return ServiceResult.failure("Payment not found");
        }

        // 2. get a payment info
        Payment payment = paymentRepository.getReferenceById(paymentId);

        // 3. convert to DTO and return success
        return ServiceResult.success(new PaymentDTO(payment));
    }

    /*
    Create a payment
     */
    @Transactional
    public ServiceResult<PaymentDTO> createPayment(Long userId, Long orderId, long fromAccountId, String address) {
        // 1. get optional order and user
        Optional<Order> optionalOrder = orderRepository.findById(orderId);
        Optional<User> optionalUser = userRepository.findById(userId);

        // 1.1 check if the order exists
        if (optionalOrder.isEmpty()) {
            return ServiceResult.failure("Order not found");
        }

        // 1.2 check if the user exists
        if (optionalUser.isEmpty()) {
            return ServiceResult.failure("User not found");
        }

        // 2. get the order and user
        Order order = optionalOrder.get();
        User user = optionalUser.get();

        // 3. use HTTP request to make a payment

        // 3.1 create a transfer
        ServiceResult<PaymentDTO> paymentResult = createTransfer(fromAccountId, order);

        // 3.2 if the payment failed, return the result
        if (!paymentResult.isSuccess()) {
            return paymentResult;
        }

        // 4. use HTTP request to create a delivery

        // 4.1 create a delivery
        ServiceResult<OrderDTO> deliveryResult = createDelivery(address, order, user);

        // 4.2 if the delivery failed, return the result
        if (!deliveryResult.isSuccess()) {
            // 4.2.1 refund the payment
            Payment payment = paymentRepository.getReferenceById(paymentResult.getData().getId());
            refundTransfer(payment, order);

            // 4.2.2 restore the status of order
            order.setOrderStatus(OrderStatus.PENDING);
            order.setDeliveryStatus(DeliveryStatus.EMPTY);
            orderRepository.save(order);

            // 4.2.3 delete the payment
            paymentRepository.delete(payment);

            // 4.2.4 return the result
            return ServiceResult.failure(deliveryResult.getErrorMessage());
        }


        return paymentResult;
    }

    /*
    create a transfer
     */
    public ServiceResult<PaymentDTO> createTransfer(long fromAccountId, Order order) {
        // 1. determine url
        String website = "http://localhost:8081/";
        String url = website + "bank/customers/0/accounts/" + fromAccountId + "/transaction_records/transfer";

        // 2. create a request entity
        TransferRequest transferRequest = new TransferRequest(BankConfig.CUSTOMER_ID, BankConfig.ACCOUNT_ID, order.getAmount());
        HttpEntity<TransferRequest> requestEntity = new HttpEntity<>(transferRequest);

        // 3. send a POST request to complete the bank transfer
        try {
            // 3.1 send a POST request and get the response
            ResponseEntity<Map<String, Integer>> response = restTemplate.exchange(url, HttpMethod.POST, requestEntity, new ParameterizedTypeReference<>() {});

            // 4. if the payment succeeded

            // 4.1 check if the response body is present
            if (response.getBody() == null) {
                return ServiceResult.failure("Empty bank response");
            }

            // 4.2 get the response body
            Map<String, Integer> responseBody = response.getBody();

            // 4.3 create a payment
            Payment payment = new Payment(order.getAmount(), PaymentStatus.PAID, order, responseBody.get("id"), fromAccountId);
            paymentRepository.save(payment);

            // 4.4 update the order
            order.setOrderStatus(OrderStatus.PROCESSING);
            orderRepository.save(order);

            return ServiceResult.success(new PaymentDTO(payment));
        } catch (Exception e) {
            return ServiceResult.failure("Payment failed: " + e.getMessage());
        }
    }

    /*
    create a delivery
     */
    public ServiceResult<OrderDTO> createDelivery(String address, Order order, User user) {
        // 1. determine url
        String website = "http://localhost:8082/";
        String url = website + "delivery/deliveries";

        // 2. create a request entity
        DeliveryRequest deliveryRequest = new DeliveryRequest(order.getId(), order.getQuantity(), address, user.getEmail());
        HttpEntity<DeliveryRequest> requestEntity = new HttpEntity<>(deliveryRequest);

        // 3. send a POST request to complete the delivery
        try {
            // 3.1 send a POST request and get the response
            // if the status code is not 2xx, the exchange method will throw an exception
            ResponseEntity<Map<String, Integer>> response = restTemplate.exchange(url, HttpMethod.POST, requestEntity, new ParameterizedTypeReference<>() {});

            // 4. if the delivery succeeded

            // 4.1 check if the response body is empty
            if (response.getBody() == null) {
                return ServiceResult.failure("Wrong delivery response");
            }

            // 4.2 update the order
            order.setDeliveryStatus(DeliveryStatus.SETUP);
            orderRepository.save(order);

            return ServiceResult.success(new OrderDTO(order));
        } catch (Exception e) {
            return ServiceResult.failure("Delivery failed");
        }
    }

    /*
    cancel a payment
     */
    @Transactional
    public ServiceResult<PaymentDTO> cancelPayment(Long paymentId) {
        // 1. get optional payment and order
        Optional<Payment> optionalPayment = paymentRepository.findById(paymentId);
        Optional<Order> optionalOrder = orderRepository.findById(paymentId);

        // 1.1 check if the payment exists
        if (optionalPayment.isEmpty()) {
            return ServiceResult.failure("Payment not found");
        }

        // 1.2. check if the order exists
        if (optionalOrder.isEmpty()) {
            return ServiceResult.failure("Order not found");
        }

        // 2. get the payment and order
        Payment payment = optionalPayment.get();
        Order order = optionalOrder.get();

        // 3. check if the order is refundable
        if(order.getDeliveryStatus().ordinal()!=1) {
            return ServiceResult.failure("Order is not refundable");
        }

        // 4. cancel the delivery
        ServiceResult<OrderDTO> deliveryResult = cancelDelivery(order);

        // 4.1 check if the delivery is cancelled
        if (!deliveryResult.isSuccess()) {
            return ServiceResult.failure(deliveryResult.getErrorMessage());
        }

        // 5. restore the inventories
        ServiceResult<List< InventoryTransactionDTO>> inventoryTransactionResult = inventoryTransactionService.restoreInventories(order.getId());

        // 5.1 check if the inventories are restored
        if (!inventoryTransactionResult.isSuccess()) {
            return ServiceResult.failure(inventoryTransactionResult.getErrorMessage());
        }

        // 6. process the refund
        ServiceResult<PaymentDTO> refundResult = refundTransfer(payment, order);

        // 6.1 check if the refund is successful
        if (!refundResult.isSuccess()) {
            return ServiceResult.failure(refundResult.getErrorMessage());
        }

        return refundResult;
    }

    /*
    cancel a delivery
     */
    public ServiceResult<OrderDTO> cancelDelivery(Order order) {
        // 1. determine url
        String website = "http://localhost:8082/";
        String url = website + "delivery/deliveries";

        // 2. create a request entity
        CancelDeliveryRequest cancelDeliveryRequest = new CancelDeliveryRequest(order.getId());
        HttpEntity<CancelDeliveryRequest> requestEntity = new HttpEntity<>(cancelDeliveryRequest);
        // 3. send a PUT request to cancel the delivery
        try {
            // 3.1 send a PUT request and get the response
            ResponseEntity<Map<String, Integer>> response = restTemplate.exchange(url, HttpMethod.PUT, requestEntity, new ParameterizedTypeReference<>() {});

            // 4. if the delivery is cancelled

            // 4.1 check if the response body is empty
            if (response.getBody() == null) {
                return ServiceResult.failure("Wrong delivery response");
            }

            // 4.2 update the order
            order.setDeliveryStatus(DeliveryStatus.CANCELLED);
            order.setOrderStatus(OrderStatus.CANCELLED);
            orderRepository.save(order);

            return ServiceResult.success(new OrderDTO(order));
        } catch (Exception e) {
            return ServiceResult.failure("Cancel delivery failed");
        }
    }

    /*
    refund a transfer
     */
    public ServiceResult<PaymentDTO> refundTransfer(Payment payment, Order order) {
        // 1. determine url
        String website = "http://localhost:8081/";
        String url = website + "bank/customers/0/accounts/" + BankConfig.ACCOUNT_ID + "/transaction_records/transfer";

        // 2. create a request entity
        TransferRequest transferRequest = new TransferRequest(0L, payment.getFromAccountId(), order.getAmount());
        HttpEntity<TransferRequest> requestEntity = new HttpEntity<>(transferRequest);

        // 3. send a POST request to complete the bank refund
        try {
            // 3.1 send a POST request and get the response
            ResponseEntity<Map<String, Integer>> response = restTemplate.exchange(url, HttpMethod.POST, requestEntity, new ParameterizedTypeReference<>() {});

            // 4. if the payment succeeded

            // 4.1 check if the response body is empty
            if (response.getBody() == null) {
                return ServiceResult.failure("Wrong bank response");
            }

            // 4.2 cast the response body to a map
            // have to use Integer instead of Long because Jackson cannot convert Long to Integer
            Map<String, Integer> responseBody = response.getBody();

            // 4.3 update the payment
            payment.setPaymentStatus(PaymentStatus.REFUNDED);
            payment.setTransactionRecordId(responseBody.get("id"));
            paymentRepository.save(payment);

            // 4.4 update the order
            order.setOrderStatus(OrderStatus.REFUNDED);
            orderRepository.save(order);

            return ServiceResult.success(new PaymentDTO(payment));
        } catch (Exception e) {
            return ServiceResult.failure("Payment failed");
        }
    }

    /*
    Transfer request body
     */
    public static class TransferRequest {
        public long toCustomerId;
        public long toAccountId;
        public double amount;

        public TransferRequest(Long toCustomerId, Long toAccountId, double amount) {
            this.toCustomerId = toCustomerId;
            this.toAccountId = toAccountId;
            this.amount = amount;
        }
    }

    /*
    Delivery request body
     */
    public static class DeliveryRequest {
        public long orderId;
        public int quantity;
        public String address;
        public String email;

        public DeliveryRequest(long orderId, int quantity, String address, String email) {
            this.orderId = orderId;
            this.quantity = quantity;
            this.address = address;
            this.email = email;
        }
    }

    /*
    Cancel delivery request body
     */
    public static class CancelDeliveryRequest{
        public long orderId;

        public CancelDeliveryRequest(long orderId){
            this.orderId = orderId;
        }
    }
}
