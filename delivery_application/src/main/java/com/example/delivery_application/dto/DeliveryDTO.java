package com.example.delivery_application.dto;

import com.example.delivery_application.model.Delivery;
import com.example.delivery_application.model.DeliveryStatus;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

/*
 * Data Transfer Object for Delivery.
 */
@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class DeliveryDTO {
    private long id;
    private long orderId;
    private DeliveryStatus status;
    private Date timestamp;
    private int quantity;
    private String address;
    private String email;

    //constructor
    public DeliveryDTO(Delivery deliveryEntity) {
        this.id = deliveryEntity.getId();
        this.orderId = deliveryEntity.getOrderId();
        this.status = deliveryEntity.getStatus();
        this.timestamp = deliveryEntity.getTimestamp();
        this.quantity = deliveryEntity.getQuantity();
        this.address = deliveryEntity.getAddress();
        this.email = deliveryEntity.getEmail();
    }
}
