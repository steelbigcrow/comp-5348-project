package com.comp5348.practice9.group5.store.dto;

import com.comp5348.practice9.group5.store.model.*;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

/*
 * Data Transfer Object for Order.
 */
@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class OrderDTO {
    private long id;
    private Date timestamp;
    private int quantity;
    private double amount;
    private OrderStatus orderStatus;
    private DeliveryStatus deliveryStatus;
    private ProductDTO product;
    private UserDTO user;
    private PaymentDTO payment;
    private Set<InventoryTransactionDTO> inventoryTransactions = new HashSet<>();

    public OrderDTO(Order orderEntity, boolean includeRelatedEntities){
        this.id = orderEntity.getId();
        this.timestamp = orderEntity.getTimestamp();
        this.quantity = orderEntity.getQuantity();
        this.amount = orderEntity.getAmount();
        this.orderStatus = orderEntity.getOrderStatus();
        this.deliveryStatus = orderEntity.getDeliveryStatus();

        if (includeRelatedEntities) {
            // order must have a product and a user
            this.product = new ProductDTO(orderEntity.getProduct());
            this.user = new UserDTO(orderEntity.getUser());

            // order can have a payment or not
            // if the order has a payment, include it
            if (orderEntity.getPayment() != null)
                this.payment = new PaymentDTO(orderEntity.getPayment());

            // order can have multiple inventory transactions
            for (InventoryTransaction inventoryTransaction : orderEntity.getInventoryTransactions()) {
                inventoryTransactions.add(new InventoryTransactionDTO(inventoryTransaction));
            }
        }
    }

    public OrderDTO(Order orderEntity) {
        this(orderEntity, false);  // don't include related entities to avoid infinite recursion
    }
}