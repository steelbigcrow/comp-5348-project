package com.example.delivery_application.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@Entity
public class Delivery {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // use IDENTITY to auto-increment starting from 1
    private long id;

    //version for optimistic locking
    @Version
    private int version;

    //order id
    @Column(nullable = false)
    private long orderId;

    //delivery status
    @Column(nullable = false)
    private DeliveryStatus status;

    //timestamp
    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false)
    private Date timestamp;

    //current quantity
    @Column(nullable = false)
    private int quantity;

    //address
    @Column(nullable = false)
    private String address;

    //user email
    @Column(nullable = false)
    private String email;

    //constructor
    public Delivery(long orderId, DeliveryStatus status, Date timestamp, int quantity, String address, String email) {
        this.orderId = orderId;
        this.status = status;
        this.timestamp = timestamp;
        this.quantity = quantity;
        this.address = address;
        this.email = email;
    }
}
