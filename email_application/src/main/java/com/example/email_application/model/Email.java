package com.example.email_application.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@Entity
public class Email {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // use IDENTITY to auto-increment starting from 1
    private long id;

    // version for optimistic locking
    @Version
    private int version;

    // delivery id
    @Column(nullable = false)
    private long deliveryId;

    // email
    @Column(nullable = false)
    private String emailAddress;

    // description
    @Column(nullable = false)
    private String description;

    // timestamp
    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false)
    private Date timestamp;

    // delivery status
    @Column(nullable = false)
    private DeliveryStatus status;

    // address
    @Column(nullable = false)
    private String address;

    //constructor
    public Email(long deliveryId, String emailAddress, String description, Date timestamp, DeliveryStatus status, String address) {
        this.deliveryId = deliveryId;
        this.emailAddress = emailAddress;
        this.description = description;
        this.timestamp = timestamp;
        this.status = status;
        this.address = address;
    }
}
