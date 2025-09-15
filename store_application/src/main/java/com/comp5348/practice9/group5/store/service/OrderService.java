package com.comp5348.practice9.group5.store.service;

import com.comp5348.practice9.group5.store.dto.InventoryTransactionDTO;
import com.comp5348.practice9.group5.store.dto.OrderDTO;
import com.comp5348.practice9.group5.store.model.*;
import com.comp5348.practice9.group5.store.repository.InventoryRepository;
import com.comp5348.practice9.group5.store.repository.OrderRepository;
import com.comp5348.practice9.group5.store.repository.ProductRepository;
import com.comp5348.practice9.group5.store.repository.UserRepository;
import com.comp5348.practice9.group5.store.util.ServiceResult;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final InventoryRepository inventoryRepository;
    private final InventoryTransactionService inventoryTransactionService;

    @Autowired
    public OrderService(OrderRepository orderRepository,
                        UserRepository userRepository,
                        ProductRepository productRepository,
                        InventoryRepository inventoryRepository,
                        InventoryTransactionService inventoryTransactionService) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.inventoryRepository = inventoryRepository;
        this.inventoryTransactionService = inventoryTransactionService;
    }

    /*
    Get all orders info
     */
    @Transactional
    public ServiceResult<List<OrderDTO>> getAllOrdersInfo(Long userId) {
        // 1. check if the user exists
        if (!userRepository.existsById(userId)) {
            return ServiceResult.failure("User not found");
        }

        // 2. get all orders info
        List<Order> orders = orderRepository.findAll();

        // 3. convert to DTO and return success
        List<OrderDTO> orderDTOs = orders.stream().map(Order -> new OrderDTO(Order,true)).toList();

        return ServiceResult.success(orderDTOs);
    }

    /*
    Get a specific order info
     */
    @Transactional
    public ServiceResult<OrderDTO> getOrderInfo(Long userId, Long orderId) {
        // 1. get optional user and order
        Optional<User> userOptional = userRepository.findById(userId);
        Optional<Order> orderOptional = orderRepository.findById(orderId);

        // 1.1 check if the user exists
        if (userOptional.isEmpty()) {
            return ServiceResult.failure("User not found");
        }

        // 1.2 check if the order exists
        if (orderOptional.isEmpty()) {
            return ServiceResult.failure("Order not found");
        }

        // 2. get the user and order
        User user = userOptional.get();
        Order order = orderOptional.get();

        // 3. check if the order belongs to the user
        if (!order.getUser().equals(user)) {
            return ServiceResult.failure("Order not found");
        }

        // 4. return order
        return ServiceResult.success(new OrderDTO(order, true));
    }

    /*
    Create a new order
     */
    @Transactional
    public ServiceResult<OrderDTO> createOrder(Long userId, Long productId, int quantity) {
        // 1. get optional user and product
        Optional<User> userOptional = userRepository.findById(userId);
        Optional<Product> productOptional = productRepository.findById(productId);

        // 1.1 check if the user exists
        if (userOptional.isEmpty()) {
            return ServiceResult.failure("User not found");
        }

        // 1.2 check if the product exists
        if (productOptional.isEmpty()) {
            return ServiceResult.failure("Product not found");
        }

        // 2. get the user and product
        User user = userOptional.get();
        Product product = productOptional.get();

        // 3. check if the inventories are enough

        // 3.1 get all inventories of the product
        List<Inventory> inventories = inventoryRepository.findByProductId(productId);

        // 3.2 calculate the total quantity of the inventories
        int totalQuantity = inventories.stream().mapToInt(Inventory::getQuantity).sum();

        // 3.3 check if the total quantity can meet the order
        if (totalQuantity < quantity) {
            return ServiceResult.failure("Inventories are not enough");
        }

        // 4. create a new order
        Order order = new Order(new Date(), quantity, user, product);
        orderRepository.save(order);

        // 5. launch a consolidation
        ServiceResult<List<InventoryTransactionDTO>> consolidationResult = inventoryTransactionService.launchConsolidation(userId, order.getId());

        // 5.1 check if the consolidation is successful
        if (!consolidationResult.isSuccess()) {
            return ServiceResult.failure(consolidationResult.getErrorMessage());
        }

        return ServiceResult.success(new OrderDTO(order, true));
    }

    /*
    Update an order
     */
    @Transactional
    public ServiceResult<OrderDTO> updateOrder(Long orderId ,Integer deliveryStatus) {
        // 1. get optional order
        Optional<Order> orderOptional = orderRepository.findById(orderId);

        // 1.1 check if the order exists
        if (orderOptional.isEmpty()) {
            return ServiceResult.failure("Order not found");
        }

        // 2. get the order
        Order order = orderOptional.get();

        // 3. update the order
        DeliveryStatus status = DeliveryStatus.values()[deliveryStatus];
        order.setDeliveryStatus(status);
        // 3.1 check if delivery status is COMPLETED
        if (status == DeliveryStatus.COMPLETED) {
            order.setOrderStatus(OrderStatus.COMPLETED);
        }
        orderRepository.save(order);

        return ServiceResult.success(new OrderDTO(order, true));
    }
}
